using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskLabelsController : ControllerBase
    {
        private readonly TaskContext _db;

        public TaskLabelsController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/tasklabels
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var data = await _db.TaskLabels.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting task labels", error = ex.Message });
            }
        }

        // GET: api/tasklabels/5/3
        [HttpGet("{taskId}/{labelId}")]
        public async Task<IActionResult> GetById(int taskId, int labelId)
        {
            try
            {
                var data = await _db.TaskLabels
                    .FirstOrDefaultAsync(x => x.TaskId == taskId && x.LabelId == labelId);

                if (data == null)
                    return NotFound(new { message = "Record not found" });

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting task label", error = ex.Message });
            }
        }

        // POST: api/tasklabels
        [HttpPost]
        public async Task<IActionResult> Create(TaskLabelDTO taskLabeldto)
        {
            try
            {
                var tasklabel = new TaskLabel
                {
                    TaskId = taskLabeldto.TaskId,
                    LabelId = taskLabeldto.LabelId,
                };
                _db.TaskLabels.Add(tasklabel);
                await _db.SaveChangesAsync();

                return Created("", tasklabel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating task label", error = ex.Message });
            }
        }

        // DELETE: api/tasklabels/5/3
        [HttpDelete("{taskId}/{labelId}")]
        public async Task<IActionResult> Delete(int taskId, int labelId)
        {
            try
            {
                var data = await _db.TaskLabels
                    .FirstOrDefaultAsync(x => x.TaskId == taskId && x.LabelId == labelId);

                if (data == null)
                    return NotFound(new { message = "Record not found" });

                _db.TaskLabels.Remove(data);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Task label deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting task label", error = ex.Message });
            }
        }
    }
}




