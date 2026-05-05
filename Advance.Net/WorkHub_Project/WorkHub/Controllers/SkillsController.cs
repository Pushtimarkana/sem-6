using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly TaskContext _db;

        public SkillsController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/skills
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillReadDTO>>> GetAll()
        {
            try
            {
                var data = await _db.Skills
                    .Select(s=>new SkillReadDTO
                    {
                        SkillId = s.SkillId,
                        SkillName = s.SkillName,
                    })
                    .ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting skills", error = ex.Message });
            }
        }

        // GET: api/skills/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var data = await _db.Skills.FindAsync(id);

                if (data == null)
                    return NotFound(new { message = "Skill not found" });

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting skill", error = ex.Message });
            }
        }

        // POST: api/skills
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(SkillDTO dto)
        {
            try
            {
                var skill = new Skill
                {
                    SkillName = dto.SkillName
                };

                _db.Skills.Add(skill);
                await _db.SaveChangesAsync();

                return Created("", skill);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating skill", error = ex.Message });
            }
        }

        // PUT: api/skills/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SkillDTO dto)
        {
            try
            {
                var existing = await _db.Skills.FindAsync(id);

                if (existing == null)
                    return NotFound(new { message = "Skill not found" });

                existing.SkillName = dto.SkillName;
                await _db.SaveChangesAsync();

                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating skill", error = ex.Message });
            }
        }

        // DELETE: api/skills/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var data = await _db.Skills.FindAsync(id);

                if (data == null)
                    return NotFound(new { message = "Skill not found" });

                _db.Skills.Remove(data);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Skill deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting skill", error = ex.Message });
            }
        }
    }
}
