<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Process;
use Spatie\TypeScriptTransformer\Formatters\Formatter;

final class StylisticEslintFormatter implements Formatter
{
    public function format(string $file): void
    {
        $process = Process::run('npm run lint:fix');

        if ($process->failed()) {
            $process->throw();
        }
    }
}
