namespace WorkHub.Models
{
    public class AIChatRequestDTO
    {
        public string Question { get; set; }

        public IFormFile? File { get; set; }
    }
}
