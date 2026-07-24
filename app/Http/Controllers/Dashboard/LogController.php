<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Support\AuditLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    public function auditLogs(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $logs = AuditLog::query()
            ->with('user:id,name,email')
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('action', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('entity_type', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($user) => $user
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        $logs->through(fn (AuditLog $log) => [
            'id' => $log->id,
            'user' => $log->user
                ? "{$log->user->name} ({$log->user->email})"
                : 'Système',
            'action' => $log->action,
            'entity_type' => $log->entity_type ?? 'Système',
            'entity_id' => $log->entity_id,
            'description' => $log->description,
            'level' => $log->level,
            'ip_address' => $log->ip_address,
            'user_agent' => $log->user_agent,
            'created_at' => $log->created_at?->toISOString(),
        ]);

        return Inertia::render('dashboard/auditLog/AuditLog', [
            'logs' => $logs,
        ]);
    }

    public function purge(AuditLogger $auditLogger)
    {
        $deleted = AuditLog::query()
            ->where('created_at', '<', now()->subMonths(6))
            ->delete();

        $auditLogger->record(
            'audit_logs.purged',
            null,
            "{$deleted} journaux d'audit de plus de six mois supprimés.",
            level: 'warning',
        );

        return back()->with('success', "{$deleted} journaux supprimés.");
    }

    public function chatbotLogs()
    {
        return Inertia::render('dashboard/ChatbotLogs/ChatbotLogs', [
            'logs' => [
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'total' => 0,
                    'from' => 0,
                    'to' => 0,
                ],
                'links' => [
                    ['url' => null, 'label' => '&laquo; Précédent', 'active' => false],
                    ['url' => null, 'label' => '1', 'active' => true],
                    ['url' => null, 'label' => 'Suivant &raquo;', 'active' => false],
                ],
            ],
        ]);
    }
}
