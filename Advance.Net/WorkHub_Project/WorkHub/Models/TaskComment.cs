using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

public partial class TaskComment
{
    [Key]
    public int CommentId { get; set; }

    [Required]
    public int? TaskId { get; set; }

    [Required]
    public int? UserId { get; set; }

    [Required]
    public string? CommentText { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [ForeignKey("TaskId")]
    [InverseProperty("TaskComments")]
    public virtual Task? Task { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("TaskComments")]
    public virtual User? User { get; set; }
}

public partial class TaskCommentDTO
{
    public int? TaskId { get; set; }
    public int? UserId { get; set; }
    public string? CommentText { get; set; }

}
public partial class TaskCommentReadDTO
{
    public int CommentId { get; set; }
    public int? TaskId { get; set; }
    public int? UserId { get; set; }
    public string? CommentText { get; set; }
    public DateTime? CreatedAt { get; set; }
}

