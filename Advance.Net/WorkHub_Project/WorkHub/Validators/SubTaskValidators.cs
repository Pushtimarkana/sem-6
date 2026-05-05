using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class SubTaskValidators : AbstractValidator<SubTaskDTO>
    {
        public SubTaskValidators() {
            RuleFor(x => x.TaskId)
                    .NotEmpty().WithMessage("Task ID is required");

            RuleFor(x => x.Title)
                    .NotEmpty().WithMessage("Title is required")
                    .MaximumLength(200).WithMessage("Title must be at most 200 characters");
        }
    }
}
