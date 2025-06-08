<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Support\StylisticEslintFormatter;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;
use Mockery;
use Mockery\MockInterface;

covers(StylisticEslintFormatter::class);

describe(StylisticEslintFormatter::class, function (): void {
    beforeEach(function (): void {
        $this->formatter = new StylisticEslintFormatter;
    });

    it('formats using eslint', function (): void {
        // Arrange
        $mockReturnProcess = Mockery::mock(PendingProcess::class, function (MockInterface $mock): void {
            $mock->shouldReceive('failed')
                ->once()
                ->andReturn(false);
        });

        Process::shouldReceive('run')
            ->once()
            ->with('npm run lint:fix')
            ->andReturn($mockReturnProcess);

        // Act & Assert
        $this->formatter->format('some-file.ts');
    });

    it('throws an exception when process fails', function (): void {
        // Arrange
        $pendingProcess = Mockery::mock(PendingProcess::class);
        $pendingProcess->shouldReceive('failed')->once()->andReturn(true);
        $pendingProcess->shouldReceive('throw')->once();

        Process::shouldReceive('run')
            ->once()
            ->with('npm run lint:fix')
            ->andReturn($pendingProcess);

        // Act & Assert
        $this->formatter->format('some-file.ts');
    });
});
