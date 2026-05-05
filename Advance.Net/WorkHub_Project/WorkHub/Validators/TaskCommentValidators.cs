using FluentValidation;
using WorkHub.Models;

namespace WorkHub.Validators
{
    public class TaskCommentValidators: AbstractValidator<TaskCommentDTO>
    {
        public TaskCommentValidators() {

            // TaskId
            RuleFor(x => x.TaskId)
                    .NotEmpty().WithMessage("Task id is required");

            RuleFor(x => x.UserId).NotEmpty().WithMessage("User id is Required");

            RuleFor(x => x.CommentText).NotEmpty().WithMessage("Comment text is required");
                
        }
    }
}
