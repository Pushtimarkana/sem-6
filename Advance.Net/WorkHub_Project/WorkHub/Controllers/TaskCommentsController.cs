using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskCommentsController : ControllerBase
    {
        private readonly TaskContext _db;

        public TaskCommentsController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/taskcomments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskCommentReadDTO>>> GetAll()
        {
            try
            {
                var comments = await _db.TaskComments
                    .Select(c => new TaskCommentReadDTO
                    {
                        CommentId = c.CommentId,
                        TaskId = c.TaskId,
                        UserId = c.UserId,
                        CommentText = c.CommentText,
                        CreatedAt = c.CreatedAt,

                    })
                    .ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting comments", error = ex.Message });
            }
        }

        // GET: api/taskcomments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var comment = await _db.TaskComments
                    .Include(c => c.User)
                    .Include(c => c.Task)
                    .FirstOrDefaultAsync(c => c.CommentId == id);

                if (comment == null)
                    return NotFound(new { message = "Comment not found" });

                return Ok(comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting comment", error = ex.Message });
            }
        }

        // POST: api/taskcomments
        [HttpPost]
        public async Task<IActionResult> Create(TaskCommentDTO commentdto)
        {
            try
            {
                var comment = new TaskComment()
                {
                    TaskId = commentdto.TaskId,
                    UserId = commentdto.UserId,
                    CommentText = commentdto.CommentText
                };
                comment.CreatedAt = DateTime.Now;

                _db.TaskComments.Add(comment);
                await _db.SaveChangesAsync();

                return Created("", comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating comment", error = ex.Message });
            }
        }

        // PUT: api/taskcomments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,TaskCommentDTO commentdto)
        {
            try
            {
                var existing = await _db.TaskComments.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Comment not found" });

                existing.CommentText = commentdto.CommentText;

                await _db.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating comment", error = ex.Message });
            }
        }

        // DELETE: api/taskcomments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var comment = await _db.TaskComments.FindAsync(id);
                if (comment == null)
                    return NotFound(new { message = "Comment not found" });

                _db.TaskComments.Remove(comment);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting comment", error = ex.Message });
            }
        }
    }
}

