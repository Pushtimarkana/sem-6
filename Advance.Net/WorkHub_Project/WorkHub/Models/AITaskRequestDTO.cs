namespace WorkHub.Models
{
    public class AITaskRequestDTO
    {
        public string TaskTitle { get; set; }
    }

    public class AIAssignResponseDTO
    {
        public string SuggestedUser { get; set; }
        public string EstimatedTime { get; set; }
        public string Reason { get; set; }
    }
}
