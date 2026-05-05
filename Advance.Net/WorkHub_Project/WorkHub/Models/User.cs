using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

[Index("Email", Name = "UQ__Users__A9D105343FBC0A9E", IsUnique = true)]
public partial class User
{
    [Key]
    public int UserId { get; set; }

    [StringLength(100)]
    [Required]
    public string FullName { get; set; } = null!;

    [StringLength(100)]
    [Required]
    public string Email { get; set; } = null!;

    [StringLength(255)]
    [Required]
    public string PasswordHash { get; set; } = null!;

    [Required]
    public int? RoleId { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }

    [StringLength(255)]
    public string? ProfileImage { get; set; }

    // ---------------- NAVIGATION ----------------
    [InverseProperty("User")]
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    [ForeignKey("RoleId")]
    [InverseProperty("Users")]
    public virtual Role? Role { get; set; }

    [InverseProperty("AssignedToNavigation")]
    public virtual ICollection<Task> TaskAssignedToNavigations { get; set; } = new List<Task>();

    [InverseProperty("User")]
    public virtual ICollection<TaskComment> TaskComments { get; set; } = new List<TaskComment>();

    [InverseProperty("CreatedByNavigation")]
    public virtual ICollection<Task> TaskCreatedByNavigations { get; set; } = new List<Task>();

    [InverseProperty("User")]
    public virtual ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
}

public partial class UserDTO
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string? Password { get; set; }
    public int? RoleId { get; set; }
    public bool? IsActive { get; set; }

}
public partial class UsersReadDTO
{
    public int UserId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    //public string PasswordHash { get; set; }
    public int? RoleId { get; set; }

    public bool? IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public string? RoleName { get; set; }

    public string? ProfileImage { get; set; }

    public List<UserSkillMiniDTO> Skills { get; set; }
    public List<UserTaskMiniDTO> AssignedTasks { get; set; }

}
public class UserSkillMiniDTO
{
    public int SkillId { get; set; }
    public string SkillName { get; set; }
    public string? SkillLevel { get; set; }
}
public class UserTaskMiniDTO
{
    public int TaskId { get; set; }
    public string Title { get; set; }
    public string Status { get; set; }
    public string Priority { get; set; }
}



