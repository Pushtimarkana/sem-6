using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly TaskContext _db;

        public NotificationsController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/notifications
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var data = await _db.Notifications.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting notifications", error = ex.Message });
            }
        }

        // GET: api/notifications/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var data = await _db.Notifications.FindAsync(id);

                if (data == null)
                    return NotFound(new { message = "Notification not found" });

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting notification", error = ex.Message });
            }
        }

        // POST: api/notifications
        [HttpPost]
        public async Task<IActionResult> Create(NotificationDTO dto)
        {
            try
            {
                var notification = new Notification
                {
                    UserId = dto.UserId,
                    Message = dto.Message,
                    IsRead = dto.IsRead ?? false,
                    CreatedAt = DateTime.Now
                };

                _db.Notifications.Add(notification);
                await _db.SaveChangesAsync();

                return Created("", notification);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating notification", error = ex.Message });
            }
        }

        // PUT: api/notifications/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, NotificationDTO dto)
        {
            try
            {
                var existing = await _db.Notifications.FindAsync(id);

                if (existing == null)
                    return NotFound(new { message = "Notification not found" });

                existing.Message = dto.Message;
                existing.IsRead = dto.IsRead;
                existing.UserId = dto.UserId;

                await _db.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating notification", error = ex.Message });
            }
        }

        // DELETE: api/notifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var data = await _db.Notifications.FindAsync(id);

                if (data == null)
                    return NotFound(new { message = "Notification not found" });

                _db.Notifications.Remove(data);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Notification deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting notification", error = ex.Message });
            }
        }
    }
}