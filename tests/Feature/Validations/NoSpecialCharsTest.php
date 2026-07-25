<?php

namespace Tests\Feature\Validations;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NoSpecialCharsTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_valid_strings_pass()
    {
        $rule = new \App\Rules\NoSpecialChars();
        $validator = \Illuminate\Support\Facades\Validator::make(
            ['field' => 'Valid String 123 -_@'],
            ['field' => [$rule]]
        );

        $this->assertTrue($validator->passes());
    }

    public function test_invalid_strings_fail()
    {
        $rule = new \App\Rules\NoSpecialChars();
        
        $invalidStrings = [
            'Invalid!',
            'Bad"string',
            'Has#hash',
            'Money$',
            'Percent%',
            'And&',
            'Slash/',
            'Parens()',
            'Equals=',
            'Question?',
            'Inverted¡',
            'Braces{}',
            'Brackets[]',
            'Dot.'
        ];

        foreach ($invalidStrings as $invalidString) {
            $validator = \Illuminate\Support\Facades\Validator::make(
                ['field' => $invalidString],
                ['field' => [$rule]]
            );
            $this->assertTrue($validator->fails(), "The string '{$invalidString}' should fail the validation.");
        }
    }
}
