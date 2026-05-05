using FluentValidation;
using WorkHub.Models;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Validators
{
    public class UserValidators:AbstractValidator<UserDTO>
    {
        public UserValidators()
        {
            RuleFor(x => x.FullName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("User Name is Required");

            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
            .MinimumLength(6).WithMessage("Password must be at least 6 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Password));
            RuleFor(x => x.RoleId).Cascade(CascadeMode.Stop).GreaterThan(0);
        
            //RuleFor(x => x.Password).Cascade(CascadeMode.Stop).NotEmpty().WithMessage("Password is Required");
        
        }

    }
}
