using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

[PrimaryKey("UserId", "SkillId")]
public partial class UserSkill
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int SkillId { get; set; }

    [StringLength(20)]
    public string? SkillLevel { get; set; }

    [ForeignKey("SkillId")]
    [InverseProperty("UserSkills")]
    public virtual Skill Skill { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserSkills")]
    public virtual User User { get; set; } = null!;
}

public class UserSkillDTO
{
    public int UserId { get; set; }
    public int SkillId { get; set; }
    public string? SkillLevel { get; set; }   // Beginner / Intermediate / Expert
}

public class UserSkillReadDTO
{
    public int UserId { get; set; }
    public string? UserName {  get; set; }
    public int SkillId { get; set; }
    public string? SkillName { get; set; }
    public string? SkillLevel { get; set; }

}
