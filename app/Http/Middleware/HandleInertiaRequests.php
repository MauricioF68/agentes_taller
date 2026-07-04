<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $activeGroupId = null;

        if ($user) {
            if ($user->role === 'docente') {
                $group = $user->groupsAsTeacher()->first();
                $activeGroupId = $group ? $group->id : null;
            } elseif ($user->role === 'alumno') {
                $group = $user->groupsAsStudent()->first();
                $activeGroupId = $group ? $group->id : null;
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'unread_notifications_count' => $user->unreadNotifications()->count()
                ]) : null,
                'activeGroupId' => $activeGroupId,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ]
        ];
    }
}
