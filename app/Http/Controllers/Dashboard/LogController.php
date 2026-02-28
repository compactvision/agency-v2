<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    public function auditLogs()
    {
        return Inertia::render('dashboard/auditLog/AuditLog', [
            'logs' => [
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page'    => 1,
                    'total'        => 0,
                    'from'         => 0,
                    'to'           => 0,
                ],
                'links' => [
                    ['url' => null, 'label' => '&laquo; Précédent', 'active' => false],
                    ['url' => null, 'label' => '1', 'active' => true],
                    ['url' => null, 'label' => 'Suivant &raquo;', 'active' => false],
                ],
            ],
        ]);
    }

    public function chatbotLogs()
    {
        return Inertia::render('dashboard/ChatbotLogs/ChatbotLogs', [
            'logs' => [
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page'    => 1,
                    'total'        => 0,
                    'from'         => 0,
                    'to'           => 0,
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
