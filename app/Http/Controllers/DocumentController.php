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
    public function store(\App\Http\Requests\StoreDocumentRequest $request, UploadDocumentUseCase $uploadDocumentUseCase)
    {

        try {
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