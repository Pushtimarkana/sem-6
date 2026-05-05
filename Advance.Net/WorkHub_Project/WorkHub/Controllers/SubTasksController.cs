using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubTasksController : ControllerBase
    {
        private readonly TaskContext _db;

        public SubTasksController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/subtasks
        [Authorize(Roles = "Admin,User")]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<SubTaskReadDTO>>> GetAll()
        {
            try
            {
                var subtasks = await _db.SubTasks
                     .Include(s => s.Task)
                    .Select( s=>new SubTaskReadDTO
                    {
                        SubTaskId=s.SubTaskId,
                        TaskId=s.TaskId,
                        Title=s.Title,
                        IsCompleted =s.IsCompleted,
                        Tasktitle=s.Task.Title,
                        AssignedTo=s.Task.AssignedTo
                    })
                    .ToListAsync();

                return Ok(subtasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting subtasks", error = ex.Message });
            }
        }

        // GET: api/subtasks/5
        [Authorize(Roles = "Admin,User")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var subtask = await _db.SubTasks
                    .Include(s => s.Task)
                    .FirstOrDefaultAsync(s => s.SubTaskId == id);

                if (subtask == null)
                    return NotFound(new { message = "SubTask not found" });

                return Ok(subtask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting subtask", error = ex.Message });
            }
        }

        // POST: api/subtasks
        [Authorize(Roles = "Admin,User")]
        [HttpPost]
        public async Task<IActionResult> Create( SubTaskDTO subTaskdto)
        {
            try
            {
                // Get logged-in userId from token
                var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;

                var task = await _db.Tasks
               .FirstOrDefaultAsync(t => t.TaskId == subTaskdto.TaskId);

                if (task == null)
                    return NotFound(new { message = "Task not found" });

                if (role != "Admin" && task.AssignedTo != loggedInUserId)
                {
                    return Forbid("You are not allowed to manage subtasks for this task");
                }
                var subTask = new SubTask()
                {
                    TaskId = subTaskdto.TaskId,
                    Title = subTaskdto.Title,
                    IsCompleted = subTaskdto.IsCompleted ??=false
                };

                _db.SubTasks.Add(subTask);
                await _db.SaveChangesAsync();

                return Created("", subTask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating subtask", error = ex.Message });
            }
        }

        // PUT: api/subtasks/5
        [Authorize(Roles = "Admin,User")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,SubTaskDTO subTaskdto)
        {
            try
            {
                //var existing = await _db.SubTasks.FindAsync(id);
                //if (existing == null)
                //    return NotFound();
                var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;

                var subTask = await _db.SubTasks
                    .Include(s => s.Task)
                    .FirstOrDefaultAsync(s => s.SubTaskId == id);

                if (subTask == null)
                    return NotFound(new { message = "SubTask not found" });

                if (role != "Admin" && subTask.Task.AssignedTo != loggedInUserId)
                    return Forbid("Not allowed");

                subTask.Title = subTaskdto.Title;
                subTask.IsCompleted = subTaskdto.IsCompleted;
                subTask.TaskId = subTaskdto.TaskId;

                await _db.SaveChangesAsync();
                return Ok(subTask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating subtask", error = ex.Message });
            }
        }

        // DELETE: api/subtasks/5
        [Authorize(Roles = "Admin,User")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var subTask = await _db.SubTasks
                .Include(s => s.Task)
                .FirstOrDefaultAsync(s => s.SubTaskId == id);
                if (subTask == null)
                    return NotFound(new { message = "SubTask not found" });

                var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;


                if (role != "Admin" && subTask.Task.AssignedTo != loggedInUserId)
                    return Forbid("Not allowed");

                _db.SubTasks.Remove(subTask);
                await _db.SaveChangesAsync();

                return Ok(new { message = "SubTask deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting subtask", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,User")]
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> ToggleComplete(int id)
        {
            var subTask = await _db.SubTasks.FindAsync(id);
            if (subTask == null) return NotFound();

            subTask.IsCompleted = !subTask.IsCompleted;
            await _db.SaveChangesAsync();

            return Ok(subTask);
        }

    }
}



