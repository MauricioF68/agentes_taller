<?php

namespace App\Domain\Documents\UseCases;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use App\Domain\Documents\Models\Document;
use App\Domain\Documents\Models\Category;
use App\Jobs\IngestDocumentToVectorDB;
use Illuminate\Http\UploadedFile;
use Exception;

class UploadDocumentUseCase
{
    /**
     * Ejecuta la subida de un documento validando que el alumno pertenezca al grupo.
     *
     * @param UploadedFile $file
     * @param int $groupId
     * @param int $userId
     * @param int $categoryId  // Cambiado de string $category a int $categoryId
     * @return Document
     * @throws Exception
     */
    public function execute(UploadedFile $file, int $groupId, int $userId, int $categoryId): Document
    {
        $user = User::find($userId);

        // Regla de Negocio: Solo los alumnos pueden subir archivos
        if (!$user || $user->role !== 'alumno') {
            throw new Exception("Operación denegada: Solo los alumnos pueden subir documentos.");
        }

        $group = Group::find($groupId);

        // Regla de Negocio: El alumno debe pertenecer obligatoriamente al grupo
        if (!$group || !$group->students()->where('users.id', $userId)->exists()) {
            throw new Exception("Operación denegada: No perteneces a este grupo.");
        }

        // Regla de Negocio Adicional: Validar que la categoría exista en la base de datos
        $category = Category::find($categoryId);
        if (!$category) {
            throw new Exception("Operación denegada: La categoría de entregable especificada no es válida.");
        }

        // Obtener el nombre original del archivo
        $originalName = $file->getClientOriginalName();

        // Guardar el archivo físicamente en storage/app/public/documents
        $filePath = $file->store('documents', 'public');

        // Registrar la metadata en la base de datos respetando la nueva estructura
        $document = Document::create([
            'group_id' => $groupId,
            'category_id' => $categoryId, 
            'uploaded_by' => $userId,
            'original_name' => $originalName,
            'file_path' => $filePath,
            'status_ai' => 'pending'       
        ]);

        IngestDocumentToVectorDB::dispatch($document);

        return $document;
    }
}