using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

public partial class Skill
{
    [Key]
    public int SkillId { get; set; }

    [StringLength(100)]
    [Required]
    public string SkillName { get; set; } = null!;

    [InverseProperty("Skill")]
    public virtual ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
}
public class SkillDTO
{
    public string SkillName { get; set; } = null!;
}

public class SkillReadDTO
{
    public int SkillId { get; set; }
    public string SkillName { get; set; }

}
