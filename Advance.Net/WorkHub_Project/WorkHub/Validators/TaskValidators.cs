using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class TaskValidators : AbstractValidator<TaskDTO>
    {
        public TaskValidators() {

            // Title
            RuleFor(x => x.Title)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Title is required")
                    .MaximumLength(200).WithMessage("Title must be at most 200 characters");

            // Status
            RuleFor(x => x.Status)
                    .NotEmpty().WithMessage("Status is required");

            // Priority (optional but controlled)
            RuleFor(x => x.Priority).MaximumLength(20).WithMessage("Priority must be at most 20 characters");

            // CreatedBy
            RuleFor(x => x.CreatedBy)
                    .NotNull().WithMessage("CreatedBy is required");

            // AssignedTo (optional)
            RuleFor(x => x.AssignedTo)
                    .Cascade(CascadeMode.Stop)
                    .NotEqual(x => x.CreatedBy)
                    .When(x => x.AssignedTo.HasValue)
                    .Unless(x => !x.AssignedTo.HasValue)
                    .WithMessage("AssignedTo cannot be same as CeatedBy");

            
        }
        
    }
}
