using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkHub.Models;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LabelsController : ControllerBase
    {
        private readonly TaskContext _db;

        public LabelsController(TaskContext db)
        {
            _db = db;
        }

        // GET: api/labels
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var labels = await _db.Labels.ToListAsync();
                return Ok(labels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting labels", error = ex.Message });
            }
        }

        // GET: api/labels/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var label = await _db.Labels
                    //.Include(l => l.Tasks)
                    .FirstOrDefaultAsync(l => l.LabelId == id);

                if (label == null)
                    return NotFound(new { message = "Label not found" });

                return Ok(label);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting label", error = ex.Message });
            }
        }

        // POST: api/labels
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(LabelDTO labeldto)
        {
            try
            {
                var label = new Labels
                {
                    LabelName = labeldto.LabelName
                };

                _db.Labels.Add(label);
                await _db.SaveChangesAsync();

                return Created("", label);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating label", error = ex.Message });
            }
        }

        // PUT: api/labels/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, LabelDTO labeldto)
        {
            try
            {
                var existing = await _db.Labels.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Label not found" });

                existing.LabelName = labeldto.LabelName;
                await _db.SaveChangesAsync();

                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating label", error = ex.Message });
            }
        }

        // DELETE: api/labels/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var label = await _db.Labels.FindAsync(id);
                if (label == null)
                    return NotFound(new { message = "Label not found" });

                _db.Labels.Remove(label);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Label deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting label", error = ex.Message });
            }
        }
    }
}





