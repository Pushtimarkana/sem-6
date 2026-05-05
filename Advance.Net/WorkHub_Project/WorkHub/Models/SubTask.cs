using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

public partial class SubTask
{
    [Key]
    public int SubTaskId { get; set; }

    [Required]
    public int? TaskId { get; set; }

    [StringLength(200)]
    [Required]
    public string? Title { get; set; }

    public bool? IsCompleted { get; set; }

    [ForeignKey("TaskId")]
    [InverseProperty("SubTasks")]
    public virtual Task? Task { get; set; }
}

public partial class SubTaskDTO
{
    public int? TaskId { get; set; }
    public string? Title { get; set; }
    public bool? IsCompleted { get; set; }
}

public partial class SubTaskReadDTO
{
    public int? TaskId { get; set; }
    public string? Title { get; set; }
    public int SubTaskId { get; set; }

    public bool? IsCompleted { get; set; }

    public string? Tasktitle { get; set; }
    public int? AssignedTo { get; set; }


}
