<?php

namespace App\Jobs;

use App\Domain\Documents\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Domain\Documents\Events\DocumentStatusUpdated;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IngestDocumentToVectorDB implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $document;

    /**
     * Inyectamos el documento recién creado en el constructor.
     */
    public function __construct(Document $document)
    {
        $this->document = $document;
    }

    /**
     * Ejecuta el trabajo en segundo plano.
     */
    public function handle(): void
    {
        try {
            // 1. Obtener la ruta física del archivo guardado
            $absolutePath = storage_path('app/public/' . $this->document->file_path);

            if (!file_exists($absolutePath)) {
                throw new \Exception("El archivo no se encontró físicamente en el servidor.");
            }

            // 2. Obtener el slug de la categoría (Ej. "project_charter")
            $this->document->load('category');
            $categorySlug = $this->document->category->slug;

            // 3. Petición HTTP a tu API de Python
            // Le damos 60 segundos de timeout por si Gemini está un poco lento
            $response = Http::timeout(60)
                ->attach(
                    'file', file_get_contents($absolutePath), $this->document->original_name
                )->post('http://127.0.0.1:8000/ingest/', [
                    'group_id' => (string) $this->document->group_id,
                    'category' => $categorySlug,
                ]);

            // 4. Evaluar la respuesta del motor de IA
            if ($response->successful()) {
                // Éxito: Pintamos el check verde (vectorized)
                $this->document->update(['status_ai' => 'vectorized']);
                Log::info("Documento vectorizado con éxito en ChromaDB. ID: " . $this->document->id);
                event(new DocumentStatusUpdated($this->document));
            } else {
                $this->document->update(['status_ai' => 'failed']);
                Log::error("Error de Python al vectorizar. Detalles: " . $response->body());

                event(new DocumentStatusUpdated($this->document));
            
            }

        } catch (\Exception $e) {
            // Error de red, caída del servidor de Python, etc.
            $this->document->update(['status_ai' => 'failed']);
            Log::error("Fallo crítico de conexión con IA: " . $e->getMessage());
            if (isset($this->document)) {
                event(new DocumentStatusUpdated($this->document));
            }
        }
    }
}