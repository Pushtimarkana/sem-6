using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSkillsController : ControllerBase
    {
        private readonly TaskContext _db;

        public UserSkillsController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/userskills
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserSkillReadDTO>>> GetAll()
        {
            try
            {
                var data = await _db.UserSkills
                    .Select(us=>new UserSkillReadDTO
                    {
                        UserId=us.UserId,
                        UserName=us.User.FullName,
                        SkillId=us.SkillId,
                        SkillName=us.Skill.SkillName,
                        SkillLevel=us.SkillLevel,

                    })
                    .ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting user skills", error = ex.Message });
            }
        }

        // GET: api/userskills/1/2
        [HttpGet("{userId}/{skillId}")]
        public async Task<IActionResult> GetById(int userId, int skillId)
        {
            try
            {
                var data = await _db.UserSkills
                    .FirstOrDefaultAsync(x => x.UserId == userId && x.SkillId == skillId);

                if (data == null)
                    return NotFound(new { message = "UserSkill not found" });

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting user skill", error = ex.Message });
            }
        }

        // POST: api/userskills
        [HttpPost]
        public async Task<IActionResult> Create(UserSkillDTO dto)
        {
            try
            {
                var userSkill = new UserSkill
                {
                    UserId = dto.UserId,
                    SkillId = dto.SkillId,
                    SkillLevel = dto.SkillLevel
                };

                _db.UserSkills.Add(userSkill);
                await _db.SaveChangesAsync();

                return Created("", userSkill);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating user skill", error = ex.Message });
            }
        }

        // PUT: api/userskills/1/2
        [HttpPut("{userId}/{skillId}")]
        public async Task<IActionResult> Update(int userId, int skillId, UserSkillDTO dto)
        {
            try
            {
                var existing = await _db.UserSkills
                    .FirstOrDefaultAsync(x => x.UserId == userId && x.SkillId == skillId);

                if (existing == null)
                    return NotFound(new { message = "UserSkill not found" });

                existing.SkillLevel = dto.SkillLevel;
                await _db.SaveChangesAsync();

                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user skill", error = ex.Message });
            }
        }

        // DELETE: api/userskills/1/2
        [HttpDelete("{userId}/{skillId}")]
        public async Task<IActionResult> Delete(int userId, int skillId)
        {
            try
            {
                var data = await _db.UserSkills
                    .FirstOrDefaultAsync(x => x.UserId == userId && x.SkillId == skillId);

                if (data == null)
                    return NotFound(new { message = "UserSkill not found" });

                _db.UserSkills.Remove(data);
                await _db.SaveChangesAsync();

                return Ok(new { message = "UserSkill deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user skill", error = ex.Message });
            }
        }
    }
}