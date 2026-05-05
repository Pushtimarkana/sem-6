using System.Threading.Tasks;
using WorkHub.Models;
namespace WorkHub.Services.Interfaces
{
    public interface IAIAssignmentService
    {
        Task<AIAssignResponseDTO> SuggestBestUser(string taskTitle);

        Task<string> AskProjectAI(string question, string? documentText);
    }
}
