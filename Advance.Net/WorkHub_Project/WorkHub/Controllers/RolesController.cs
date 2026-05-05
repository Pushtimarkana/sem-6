using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles ="Admin")]
    public class RolesController : ControllerBase
    {
        private readonly TaskContext _db;

        private readonly IConfiguration _config;

        //public RolesController(IConfiguration config)
        //{
        //    _config = config;
        //}


        public RolesController(TaskContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }


        [HttpGet("test-key")]
        public IActionResult TestKey()
        {
            var key = _config["Gemini:ApiKey"];
            return Ok(key != null ? "Key Found" : "Key Missing");
        }

        // GET: api/roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleReadDTO>>> GetAll()
        {
            try
            {
                var roles = await _db.Roles
                    .Select(r=>new RoleReadDTO
                    {
                        RoleId = r.RoleId,
                        RoleName=r.RoleName

                    })
                    .ToListAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting roles", error = ex.Message });
            }
        }

        // GET: api/roles/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var role = await _db.Roles.FindAsync(id);
                if (role == null)
                    return NotFound(new { message = "Role not found" });

                return Ok(role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting role", error = ex.Message });
            }
        }

        // POST: api/roles
        [HttpPost]
        public async Task<IActionResult> Create(RoleDTO roledto)
        {
            try
            {
                bool exists = await _db.Roles.AnyAsync(r => r.RoleName == roledto.RoleName);
                if (exists)
                    return BadRequest(new { message = "Role already exists" });

                var role = new Role()
                {
                    RoleName = roledto.RoleName
                };

                _db.Roles.Add(role);
                await _db.SaveChangesAsync();

                return Created("", role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating role", error = ex.Message });
            }
        }

        // PUT: api/roles/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RoleDTO roledto)
        {
            try
            {

                var existing = await _db.Roles.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Role not found" });

                existing.RoleName = roledto.RoleName;
                await _db.SaveChangesAsync();

                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating role", error = ex.Message });
            }
        }

        // DELETE: api/roles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var role = await _db.Roles.FindAsync(id);
                if (role == null)
                    return NotFound(new { message = "Role not found" });

                _db.Roles.Remove(role);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Role deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting role", error = ex.Message });
            }
        }
    }
}


