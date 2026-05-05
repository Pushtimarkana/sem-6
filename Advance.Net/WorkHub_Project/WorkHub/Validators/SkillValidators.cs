using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class SkillValidators : AbstractValidator<SkillDTO>
    {
        public SkillValidators() {
            RuleFor(x => x.SkillName)
                     .NotEmpty().WithMessage("Skill Name is required")
                     .MaximumLength(100).WithMessage("Title must be at most 100 characters");
        }
    }
}
