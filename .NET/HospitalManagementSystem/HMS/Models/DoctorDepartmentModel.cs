using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public class DoctorDepartmentModel
    {
        [Key]
        public int DoctorDepartmentID { get; set; }
        public int DoctorID { get; set; }
        public int DepartmentID { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public int UserID { get; set; }
    }
}
