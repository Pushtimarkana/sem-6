using Microsoft.AspNetCore.Mvc;
using WorkHub.Models;
using WorkHub.Services.Interfaces;

namespace WorkHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IAIAssignmentService _aiService;

        public AIController(IAIAssignmentService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("suggest")]
        public async Task<IActionResult> Suggest([FromBody] AITaskRequestDTO dto)
        {
            var result = await _aiService.SuggestBestUser(dto.TaskTitle);
            return Ok(result);
        }

        //[HttpPost("chat")]
        //public async Task<IActionResult> Chat([FromBody] AIChatRequestDTO dto)
        //{
        //    var result = await _aiService.AskProjectAI(dto.Question,);
        //    return Ok(new { answer = result });
        //}

        [HttpPost("chat-with-file")]
        [RequestSizeLimit(10_000_000)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ChatWithFile([FromForm] AIChatRequestDTO request)
        {
            string fileText = "";

            if (request.File != null)
            {
                using var stream = request.File.OpenReadStream();
                using var reader = new StreamReader(stream);

                fileText = await reader.ReadToEndAsync();
            }

            var result = await _aiService.AskProjectAI(request.Question, fileText);

            return Ok(new { answer = result });
        }
    }
}