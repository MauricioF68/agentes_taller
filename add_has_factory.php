<?php

$models = [
    'app/Domain/Agile/Models/BacklogItem.php',
    'app/Domain/Agile/Models/Sprint.php',
    'app/Domain/Agile/Models/MeetingMinute.php',
    'app/Domain/Agile/Models/Daily.php',
    'app/Domain/Groups/Models/Group.php',
    'app/Domain/Academic/Models/AcademicCycle.php',
    'app/Domain/Documents/Models/Category.php',
    'app/Domain/Documents/Models/Document.php',
    'app/Domain/Evaluations/Models/Evaluation.php',
];

foreach ($models as $modelPath) {
    $fullPath = __DIR__ . '/' . $modelPath;
    if (file_exists($fullPath)) {
        $content = file_get_contents($fullPath);
        
        if (strpos($content, 'use Illuminate\Database\Eloquent\Factories\HasFactory;') === false) {
            $content = preg_replace('/use Illuminate\\\\Database\\\\Eloquent\\\\Model;/', "use Illuminate\\Database\\Eloquent\\Model;\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;", $content);
        }
        
        if (strpos($content, 'use HasFactory;') === false) {
            $content = preg_replace('/class [a-zA-Z0-9_]+ extends Model\s*\{/', "$0\n    use HasFactory;\n", $content);
        }
        
        file_put_contents($fullPath, $content);
        echo "Updated $modelPath\n";
    }
}
