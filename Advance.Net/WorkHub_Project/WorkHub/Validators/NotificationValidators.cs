using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class NotificationValidators : AbstractValidator<NotificationDTO>
    {
        public NotificationValidators() {
            RuleFor(n=>n.UserId).NotEmpty().WithMessage("UserId is required");
            RuleFor(n => n.Message).NotEmpty().WithMessage("Message is required");

        }
    }
}
