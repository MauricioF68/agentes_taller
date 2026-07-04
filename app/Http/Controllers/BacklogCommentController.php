<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Domain\Agile\Models\BacklogItem;
use App\Models\BacklogItemComment;
use App\Notifications\NewBacklogCommentNotification;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class BacklogCommentController extends Controller
{
    /**
     * Store a new comment (Teacher side)
     */
    public function store(Request $request, BacklogItem $item)
    {
        $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $comment = BacklogItemComment::create([
            'backlog_item_id' => $item->id,
            'user_id' => auth()->id(),
            'content' => $request->content
        ]);

        // Notify all students in the group
        $students = $item->group->students;
        Notification::send($students, new NewBacklogCommentNotification($comment));

        return back()->with('success', 'Comentario añadido y alumnos notificados.');
    }

    /**
     * View for Students to see comments and edit items
     */
    public function indexStudentComments(Request $request)
    {
        $user = $request->user();

        // Mark all unread notifications as read
        $user->unreadNotifications->markAsRead();

        // Get the comments the student should see (from their group)
        // Since a student only belongs to one group currently, we get the group
        $group = $user->groupsAsStudent()->first();
        
        if (!$group) {
            return redirect()->route('dashboard')->with('error', 'No tienes grupo asignado.');
        }

        // Fetch items from this group that have comments, along with the comments and teacher data
        $itemsWithComments = BacklogItem::where('group_id', $group->id)
            ->whereHas('comments')
            ->with(['comments' => function($query) {
                $query->latest();
            }, 'comments.user', 'sprint'])
            ->latest('updated_at')
            ->get();

        return Inertia::render('Agile/Comments/Index', [
            'group' => $group,
            'itemsWithComments' => $itemsWithComments,
            'members' => $group->students,
            'sprints' => $group->sprints
        ]);
    }
}
