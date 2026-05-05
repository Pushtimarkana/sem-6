using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

public partial class Labels
{
    [Key]
    public int LabelId { get; set; }

    [StringLength(50)]
    [Required]
    public string? LabelName { get; set; }

    //[ForeignKey("LabelId")]
    //[InverseProperty("Labels")]
    //public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

    public ICollection<TaskLabel> TaskLabels { get; set; } = new List<TaskLabel>();

}

public class LabelDTO
{
    public string? LabelName { get; set; }
}

public class LabelReadDTO
{
    public int LabelId { get; set; }
    public string LabelName { get; set; }
}
