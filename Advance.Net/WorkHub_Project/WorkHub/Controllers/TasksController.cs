using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly TaskContext _db;
        public TasksController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/tasks
        [Authorize(Roles = "Admin,User")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskReadDTO>>> GetAll()
        {
            try
            {
                var tasks = await _db.Tasks
                .Include(t => t.CreatedByNavigation)
                .Include(t => t.AssignedToNavigation)
                .Include(t => t.TaskLabels)
                .ThenInclude(tl => tl.Label)
                .Select(t => new TaskReadDTO
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    CreatedByName = t.CreatedByNavigation.FullName,
                    AssignedToName = t.AssignedToNavigation != null
                        ? t.AssignedToNavigation.FullName
                        : null,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    Labels = t.TaskLabels.Select(tl => new LabelReadDTO
                    {
                        LabelId = tl.Label.LabelId,
                        LabelName = tl.Label.LabelName
                    }).ToList()
                }).ToListAsync();
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting tasks", error = ex.Message });
            }
        }

        // GET: api/tasks/5
        [Authorize(Roles = "Admin,User")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var task = await _db.Tasks
                    //.Include(t => t.CreatedByNavigation)
                    //.Include(t => t.AssignedToNavigation)
                    //.Include(t => t.SubTasks)
                    //.Include(t => t.TaskComments)
                    //.Include(t => t.Labels)
                    .FirstOrDefaultAsync(t => t.TaskId == id);

                if (task == null)
                    return NotFound(new { message = "Task not found" });

                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting task", error = ex.Message });
            }
        }

        // POST: api/tasks
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Models.TaskDTO taskdto)
        {
            try
            {
                var task = new Models.Task()
                {
                    Title = taskdto.Title,
                    Description = taskdto.Description,
                    Priority = taskdto.Priority,
                    Status = taskdto.Status,
                    DueDate = taskdto.DueDate,
                    CreatedBy = taskdto.CreatedBy,
                    AssignedTo = taskdto.AssignedTo

                };
                task.CreatedAt = DateTime.Now;
                task.UpdatedAt = DateTime.Now;

                _db.Tasks.Add(task);
                await _db.SaveChangesAsync();

                return Created("", task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating task", error = ex.Message });
            }
        }

        // PUT: api/tasks/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Models.TaskDTO taskdto)
        {
            try
            {
                var existing = await _db.Tasks.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Task not found" });

                existing.Title = taskdto.Title;
                existing.Description = taskdto.Description;
                existing.Priority = taskdto.Priority;
                existing.Status = taskdto.Status;
                existing.DueDate = taskdto.DueDate;
                existing.AssignedTo = taskdto.AssignedTo;
                existing.UpdatedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating task", error = ex.Message });
            }
        }

        // DELETE: api/tasks/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var task = await _db.Tasks.FindAsync(id);
                if (task == null)
                    return NotFound(new { message = "Task not found" });

                _db.Tasks.Remove(task);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Task deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting task", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("unassigned")]
        public async Task<IActionResult> GetUnassignedTasks()
        {
            var tasks = await _db.Tasks
                .Where(t => t.AssignedTo == null)
                .Select(t => new
                {
                    t.TaskId,
                    t.Title,
                    t.Priority,
                    t.Status
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{taskId}/assign/{userId}")]
        public async Task<IActionResult> AssignTask(int taskId, int userId)
        {
            var task = await _db.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound("Task not found");

            task.AssignedTo = userId;
            task.UpdatedAt = DateTime.Now;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Task assigned successfully" });
        }

    }
}
