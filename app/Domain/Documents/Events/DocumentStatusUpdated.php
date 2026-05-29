<?php

namespace App\Domain\Documents\Events;

use App\Domain\Documents\Models\Document;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class DocumentStatusUpdated implements ShouldQueue, ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, Queueable, SerializesModels;

    public $documentId;
    public $statusAi;
    public $groupId;

    /**
     * Creamos el evento pasando los datos esenciales del documento.
     */
    public function __construct(Document $document)
    {
        $this->documentId = $document->id;
        $this->statusAi = $document->status_ai;
        $this->groupId = $document->group_id;
    }

    /**
     * Definimos el canal por el cual transmitiremos.
     * Usaremos un canal por grupo para que los alumnos de un grupo solo escuchen sus propios archivos.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('group-channel.' . $this->groupId)
        ];
    }

    /**
     * El nombre del evento que escuchará el Frontend en JavaScript.
     */
    public function broadcastAs(): string
    {
        return 'document.status.updated';
    }
}