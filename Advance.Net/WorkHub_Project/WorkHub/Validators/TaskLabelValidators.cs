using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class TaskLabelValidators : AbstractValidator<TaskLabelDTO>
    {
        public TaskLabelValidators() {
            RuleFor(tl => tl.LabelId).NotEmpty().WithMessage("Label id is required");
            RuleFor(tl => tl.TaskId).NotEmpty().WithMessage("Task id is required");

        }
    }
}
