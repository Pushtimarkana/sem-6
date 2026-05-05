using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class UsersController : ControllerBase
    {
        private readonly TaskContext _db;

        public UsersController(TaskContext db)
        {
            _db = db;
        }
        // GET: api/users
        //[Authorize(Roles ="Admin")]
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _db.Users.Select(u => new UsersReadDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    RoleId = u.RoleId,
                    RoleName = u.Role != null ? u.Role.RoleName : null,
                    ProfileImage=u.ProfileImage,
                    //  USER SKILLS
                    Skills = u.UserSkills.Select(us => new UserSkillMiniDTO
                    {
                        SkillId = us.SkillId,
                        SkillName = us.Skill.SkillName,
                        SkillLevel = us.SkillLevel
                    }).ToList(),

                    //  TASKS ASSIGNED TO USER
                    AssignedTasks = u.TaskAssignedToNavigations.Select(t => new UserTaskMiniDTO
                    {
                        TaskId = t.TaskId,
                        Title = t.Title,
                        Status = t.Status,
                        Priority = t.Priority
                    }).ToList()
                }).ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting users", error = ex.Message });
            }
        }

        //[Authorize (Roles="Admin")]
        // GET: api/users/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _db.Users
                     .Where(u => u.UserId == id)
                     .Select(u => new UsersReadDTO
                     {
                         UserId = u.UserId,
                         FullName = u.FullName,
                         Email = u.Email,
                         IsActive = u.IsActive,
                         CreatedAt = u.CreatedAt,
                         UpdatedAt = u.UpdatedAt,
                         RoleId = u.RoleId,
                         RoleName = u.Role != null ? u.Role.RoleName : null,
                         ProfileImage = u.ProfileImage,

                         //  USER SKILLS
                         Skills = u.UserSkills.Select(us => new UserSkillMiniDTO
                         {
                             SkillId = us.SkillId,
                             SkillName = us.Skill.SkillName,
                             SkillLevel = us.SkillLevel
                         }).ToList(),

                         //  TASKS ASSIGNED TO USER
                         AssignedTasks = u.TaskAssignedToNavigations.Select(t => new UserTaskMiniDTO
                         {
                             TaskId = t.TaskId,
                             Title = t.Title,
                             Status = t.Status,
                             Priority = t.Priority
                         }).ToList()
                     })
                     .FirstOrDefaultAsync();
                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting User", error = ex.Message });
            }
        }

        // POST: api/users
        //[Authorize]
        [AllowAnonymous]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(UserDTO userdto)
        {
            try
            {
                bool exists = await _db.Users.AnyAsync(u => u.Email == userdto.Email);
                if (exists)
                    return BadRequest(new { message = "Email already exists" });
                if (string.IsNullOrWhiteSpace(userdto.Password))
                {
                    return BadRequest("Password is required");
                }
                //var hasher = new PasswordHasher<User>();
                var user = new User
                {
                    FullName = userdto.FullName,
                    Email = userdto.Email,
                    RoleId = userdto.RoleId,
                    IsActive = userdto.IsActive,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    PasswordHash = userdto.Password
                };


                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                return Created("", user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating user", error = ex.Message });
            }
        }

        // PUT: api/users/5
        [Authorize(Roles = "Admin,User")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserDTO userdto)
        {
            try
            {
                // Get logged-in userId from token
                var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                if (id != loggedInUserId)
                {
                    return Forbid("You can only update your own profile");
                }
                var existing = await _db.Users.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "User not found" });
                bool emailExists = await _db.Users.AnyAsync(u =>
                         u.Email == userdto.Email && u.UserId != id);

                if (emailExists)
                    return BadRequest(new { message = "Email already exists" });

                existing.FullName = userdto.FullName;
                existing.Email = userdto.Email; 
                existing.RoleId = userdto.RoleId;
                existing.IsActive = userdto.IsActive;
                existing.UpdatedAt = DateTime.Now;
                if (!string.IsNullOrWhiteSpace(userdto.Password))
                {
                    //var hasher = new PasswordHasher<User>();
                    existing.PasswordHash = userdto.Password;
                }

                await _db.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }

        // DELETE: api/user/5
        //[Authorize]
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _db.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                _db.Users.Remove(user);
                await _db.SaveChangesAsync();

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user", error = ex.Message });
            }
        }

        [HttpGet("non-admin")]
        [Authorize(Roles = "Admin")]
        //[Authorize]
        public async Task<IActionResult> GetNonAdminUsers()
        {
            var users = await _db.Users
                .Where(u => u.Role.RoleName != "Admin")
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.ProfileImage,
                    Skills = u.UserSkills.Select(us => new
                    {
                        us.SkillId,
                        SkillName = us.Skill.SkillName
                    }).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost("{id}/upload-profile")]
        public async Task<IActionResult> UploadProfileImage(int id,IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found");

            var allowedTypes = new[] { ".jpg", ".jpeg", ".png" };
            var ext = Path.GetExtension(file.FileName).ToLower();

            if (!allowedTypes.Contains(ext))
                return BadRequest("Only JPG, JPEG, PNG allowed");

            var fileName = $"user_{id}_{Guid.NewGuid()}{ext}";
            var folderPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/uploads/users"
            );

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Save relative path in DB
            user.ProfileImage = $"/uploads/users/{fileName}";
            user.UpdatedAt = DateTime.Now;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                imageUrl = user.ProfileImage
            });
        }




    }
}
