using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public class PatientModel
    {
        [Key]
        public int PatientID { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int IsActive { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public int UserID { get; set; }
    }
    public class PatientDropDownModel
    {
        public int PatientID { get; set; }
        public string Name { get; set; }
    }
}
