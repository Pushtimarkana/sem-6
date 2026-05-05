using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using WorkHub.Models;
using WorkHub.Services.Interfaces;
namespace WorkHub.Services
{
    public class AIAssignmentService : IAIAssignmentService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        private readonly TaskContext _db;

        public AIAssignmentService(IConfiguration config, TaskContext db)
        {
            _config = config;
            _db = db;
        }

        public async Task<AIAssignResponseDTO> SuggestBestUser(string taskTitle)
        {
            var apiKey = _config["Gemini:ApiKey"];

            // 🔥 Fetch users with skills
            var users = await _db.Users
                .Include(u => u.UserSkills)
                .ThenInclude(us => us.Skill)
                .ToListAsync();

            // 🔥 Build dynamic prompt
            var promptBuilder = new StringBuilder();

            promptBuilder.AppendLine("You are an AI Task Assignment Assistant.");
            promptBuilder.AppendLine("Analyze users, their skills, skill levels, and workload.");
            promptBuilder.AppendLine("Suggest the best user for the task and estimate completion time.\n");

            promptBuilder.AppendLine("Team Members:\n");

            foreach (var user in users)
            {
                var activeTasks = user.TaskAssignedToNavigations?.Count ?? 0;

                promptBuilder.AppendLine($"User: {user.FullName}");
                promptBuilder.AppendLine($"Active Tasks: {activeTasks}");
                promptBuilder.AppendLine("Skills:");

                foreach (var skill in user.UserSkills)
                {
                    promptBuilder.AppendLine($"- {skill.Skill.SkillName} ({skill.SkillLevel})");
                }

                promptBuilder.AppendLine();
            }

            promptBuilder.AppendLine($"Task Title: {taskTitle}");
            promptBuilder.AppendLine("\nInstructions:");
            promptBuilder.AppendLine("- Match task keywords with relevant skills.");
            promptBuilder.AppendLine("- Higher skill level is better.");
            promptBuilder.AppendLine("- Fewer active tasks is better.");
            promptBuilder.AppendLine("- Estimate realistic completion time (like: 6 hours, 2 days, 1 week, 1 month).");
            promptBuilder.AppendLine("- Respond ONLY in JSON format exactly like below:");

            promptBuilder.AppendLine(@"
            {
              ""SuggestedUser"": ""Full Name"",
              ""EstimatedTime"": ""Time estimation"",
              ""Reason"": ""Short explanation""
            }
            ");

            var requestBody = new
            {
                contents = new[]
                {
            new
            {
                parts = new[]
                {
                    new { text = promptBuilder.ToString() }
                }
            }
        }
            };

            var json = JsonSerializer.Serialize(requestBody);

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}"
            );

            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var client = new HttpClient();
            var response = await client.SendAsync(request);

            var result = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(result);

            var aiText = doc.RootElement
                            .GetProperty("candidates")[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString();

            if (string.IsNullOrEmpty(aiText))
                throw new Exception("AI returned empty response");

            // 🔥 CLEAN MARKDOWN WRAPPERS (very important)
            aiText = aiText.Trim();

            // Remove ```json and ```
            if (aiText.StartsWith("```"))
            {
                aiText = aiText.Replace("```json", "")
                               .Replace("```", "")
                               .Trim();
            }

            // Extra safety: extract only JSON object
            int startIndex = aiText.IndexOf("{");
            int endIndex = aiText.LastIndexOf("}");

            if (startIndex >= 0 && endIndex >= 0)
            {
                aiText = aiText.Substring(startIndex, endIndex - startIndex + 1);
            }

            // 🔥 Now safely deserialize
            var aiResponse = JsonSerializer.Deserialize<AIAssignResponseDTO>(
                aiText,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            return aiResponse;
        }


        public async Task<string> AskProjectAI(string question, string? documentText)
        {
            var apiKey = _config["Gemini:ApiKey"];

            var users = await _db.Users
                .Include(u => u.TaskAssignedToNavigations)
                .Include(u => u.UserSkills)
                .ThenInclude(us => us.Skill)
                .ToListAsync();

            var tasks = await _db.Tasks.ToListAsync();

            var prompt = new StringBuilder();

            prompt.AppendLine("You are an AI Project Assistant for admin.");
            prompt.AppendLine("Answer admin questions based on the following project data.\n");
            prompt.AppendLine("You are an AI Project Assistant.");
            if (!string.IsNullOrEmpty(documentText))
            {
                prompt.AppendLine("Project Document Content:");
                prompt.AppendLine(documentText);
                prompt.AppendLine();
            }
            prompt.AppendLine($"Admin Question: {question}");
            prompt.AppendLine("Answer professionally.");

            prompt.AppendLine("Users:\n");

            foreach (var user in users)
            {
                prompt.AppendLine($"User: {user.FullName}");
                prompt.AppendLine($"Active Tasks: {user.TaskAssignedToNavigations.Count}");

                foreach (var skill in user.UserSkills)
                {
                    prompt.AppendLine($"Skill: {skill.Skill.SkillName} ({skill.SkillLevel})");
                }

                prompt.AppendLine();
            }

            prompt.AppendLine("Tasks:\n");

            foreach (var task in tasks)
            {
                prompt.AppendLine($"Task: {task.Title}, Priority: {task.Priority}, Status: {task.Status}");
            }

            prompt.AppendLine($"\nAdmin Question: {question}");
            prompt.AppendLine("Provide a clear and professional answer.");

            var requestBody = new
            {
                contents = new[]
                {
            new
            {
                parts = new[]
                {
                    new { text = prompt.ToString() }
                }
            }
        }
            };

            var json = JsonSerializer.Serialize(requestBody);

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}"
            );

            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var client = new HttpClient();
            var response = await client.SendAsync(request);
            var result = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(result);

            var aiText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return aiText ?? "No response";
        }
    }
}