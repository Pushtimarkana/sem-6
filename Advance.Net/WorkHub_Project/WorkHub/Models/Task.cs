using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

public partial class Task
{
    [Key]
    public int TaskId { get; set; }

    [StringLength(200)]
    [Required]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    [StringLength(20)]
    public string? Priority { get; set; }

    [StringLength(20)]
    [Required]
    public string? Status { get; set; }

    public DateOnly? DueDate { get; set; }

    [Required]
    public int? CreatedBy { get; set; }

    public int? AssignedTo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }

    // ---------------- NAVIGATION ----------------

    [ForeignKey("AssignedTo")]
    [InverseProperty("TaskAssignedToNavigations")]
    public virtual User? AssignedToNavigation { get; set; }

    [ForeignKey("CreatedBy")]
    [InverseProperty("TaskCreatedByNavigations")]
    public virtual User? CreatedByNavigation { get; set; }

    [InverseProperty("Task")]
    public virtual ICollection<SubTask> SubTasks { get; set; } = new List<SubTask>();

    [InverseProperty("Task")]
    public virtual ICollection<TaskComment> TaskComments { get; set; } = new List<TaskComment>();

    //[ForeignKey("TaskId")]
    //[InverseProperty("Tasks")]
    //public virtual ICollection<Labels> Labels { get; set; } = new List<Labels>();

    public ICollection<TaskLabel> TaskLabels { get; set; } = new List<TaskLabel>();

}

public partial class TaskDTO
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public DateOnly? DueDate { get; set; }
    public int? CreatedBy { get; set; }
    public int? AssignedTo { get; set; }
}

public class TaskReadDTO
{
    public int TaskId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string Priority { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateOnly? DueDate { get; set; }
    public string CreatedByName { get; set; } = null!;
    public string? AssignedToName { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<LabelReadDTO> Labels { get; set; } = new();
}