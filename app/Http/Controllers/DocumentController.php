<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Domain\Documents\UseCases\UploadDocumentUseCase;
use Exception;

class DocumentController extends Controller
{
    /**
     * Almacena un documento subido por el alumno.
     */
    public function store(Request $request, UploadDocumentUseCase $uploadDocumentUseCase)
    {
        // Validación de entrada HTTP (Formatos: PDF, DOC, DOCX, TXT. Peso máximo: 10MB)
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'category_id' => 'required|exists:categories,id',
            'file' => 'required|file|mimes:pdf,doc,docx,txt|max:20240', 
        ]);

        try {
            // Ejecutamos el caso de uso
            $uploadDocumentUseCase->execute(
                $request->file('file'),
                $request->group_id,
                auth()->id(),
                $request->category_id
            );
            
            return back()->with('success', 'Documento subido y registrado exitosamente.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}