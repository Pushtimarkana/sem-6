using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class UserSkillValidators : AbstractValidator<UserSkillDTO>
    {
        public UserSkillValidators()
        {
            RuleFor(x => x.UserId)
                    .NotEmpty().WithMessage("User id is required").NotNull();

            RuleFor(x => x.SkillId).NotEmpty().WithMessage("Skilll id is Required");

            RuleFor(x => x.SkillLevel).MaximumLength(20).WithMessage("Skill Level 's lengrh is 20 charcter");
        }
    }
}
