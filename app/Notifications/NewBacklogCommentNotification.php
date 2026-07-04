<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\BacklogItemComment;

class NewBacklogCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $comment;

    public function __construct(BacklogItemComment $comment)
    {
        $this->comment = $comment;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // We only want database notifications for now
    }

    public function toArray(object $notifiable): array
    {
        return [
            'comment_id' => $this->comment->id,
            'item_id' => $this->comment->backlog_item_id,
            'item_title' => $this->comment->backlogItem->title,
            'teacher_name' => $this->comment->user->name,
            'message' => 'El docente ' . $this->comment->user->name . ' ha dejado un comentario en: ' . $this->comment->backlogItem->title
        ];
    }
}
