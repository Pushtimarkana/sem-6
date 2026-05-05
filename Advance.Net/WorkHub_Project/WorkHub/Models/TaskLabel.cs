using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace WorkHub.Models
{
    public class TaskLabel
    {
        [Required]
        public int TaskId { get; set; }

        [Required]
        public int LabelId { get; set; }

        //----------Navigation-------------------

        [ForeignKey(nameof(TaskId))]
        public Task Task { get; set; }

        [ForeignKey(nameof(LabelId))]
        public Labels Label { get; set; }
    }
    public class TaskLabelDTO
    {
        public int TaskId { get; set; }
        public int LabelId { get; set; }
    }
}
