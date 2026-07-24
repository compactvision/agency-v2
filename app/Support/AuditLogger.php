<?php

namespace App\Support;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class AuditLogger
{
    private const SENSITIVE_KEY_PATTERN = '/password|token|secret|authorization|recovery|cookie|card|cvv/i';

    public function record(
        string $action,
        ?Model $entity,
        string $description,
        array $oldValues = [],
        array $newValues = [],
        string $level = 'info',
    ): AuditLog {
        $request = app()->runningInConsole() ? null : request();

        return AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity_type' => $entity ? class_basename($entity) : null,
            'entity_id' => $entity?->getKey(),
            'description' => $description,
            'level' => in_array($level, ['info', 'warning', 'error', 'critical'], true) ? $level : 'info',
            'old_values' => $oldValues === [] ? null : $this->redact($oldValues),
            'new_values' => $newValues === [] ? null : $this->redact($newValues),
            'ip_address' => $request?->ip(),
            'user_agent' => $request ? mb_substr((string) $request->userAgent(), 0, 1000) : null,
        ]);
    }

    private function redact(array $values): array
    {
        return Arr::map($values, function (mixed $value, string|int $key): mixed {
            if (is_string($key) && preg_match(self::SENSITIVE_KEY_PATTERN, $key)) {
                return '[REDACTED]';
            }

            return is_array($value) ? $this->redact($value) : $value;
        });
    }
}
