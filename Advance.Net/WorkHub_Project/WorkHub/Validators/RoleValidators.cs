using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class RoleValidators: AbstractValidator<RoleDTO>
    {
        public RoleValidators() { 
            RuleFor(x => x.RoleName).NotEmpty().WithMessage("Role Name is Required");
        }
    }
}
