<?php

namespace Tests\Feature;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use App\Domain\Documents\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_upload_document(): void
    {
        Storage::fake('local');
        
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        $category = Category::factory()->create();

        $file = UploadedFile::fake()->create('report.pdf', 100, 'application/pdf');

        $response = $this->actingAs($student)->post('/documents', [
            'group_id' => $group->id,
            'category_id' => $category->id,
            'file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('documents', [
            'group_id' => $group->id,
            'category_id' => $category->id,
            'original_name' => 'report.pdf',
        ]);
        
        // Assert file exists in storage. DocumentController likely stores in 'documents'
        // Need to check exact path logic, but usually it's public/documents or similar.
    }

    public function test_document_upload_validates_fields_and_extension(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        
        $invalidFile = UploadedFile::fake()->create('script.exe', 100, 'application/x-msdownload');

        $response = $this->actingAs($student)->post('/documents', [
            'group_id' => '', // Missing
            'category_id' => '', // Missing
            'file' => $invalidFile,
        ]);

        $response->assertSessionHasErrors(['group_id', 'category_id', 'file']);
    }
}
