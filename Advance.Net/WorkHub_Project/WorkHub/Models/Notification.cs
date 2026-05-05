using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

public partial class Notification
{
    [Key]
    public int NotificationId { get; set; }

    [Required]
    public int? UserId { get; set; }

    [StringLength(255)]
    [Required]
    public string? Message { get; set; }

    public bool? IsRead { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Notifications")]
    public virtual User? User { get; set; }
}

public class NotificationDTO
{
    public int? UserId { get; set; }
    public string? Message { get; set; }
    public bool? IsRead { get; set; }
}
