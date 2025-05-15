<?php

declare(strict_types=1);

namespace App\Support;

use RuntimeException;
use Spatie\TypeScriptTransformer\Formatters\Formatter;

final class StylisticEslintFormatter implements Formatter
{
    public function format(string $file): void
    {
        exec('npm run lint:fix', $output, $resultCode);

        if ($resultCode !== 0) {
            throw new RuntimeException(
                sprintf(
                    'Failed to format file %s. Output: %s',
                    $file,
                    implode("\n", $output)
                )
            );
        }
    }
}
