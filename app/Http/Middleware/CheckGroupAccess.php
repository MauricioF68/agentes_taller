<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Domain\Groups\Models\Group;

class CheckGroupAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $group = $request->route('group');
        $user = auth()->user();

        if (!$group || !$user) {
            abort(403, 'Acceso denegado.');
        }

        if (is_numeric($group)) {
            $group = Group::findOrFail($group);
        }

        if ($user->role === 'docente') {
            if ($group->teacher_id !== $user->id) {
                abort(403, 'No tienes acceso a este grupo. No eres el docente asignado.');
            }
        } else if ($user->role === 'alumno') {
            if (!$group->students()->where('user_id', $user->id)->exists()) {
                abort(403, 'No perteneces a este grupo.');
            }
        }

        return $next($request);
    }
}
