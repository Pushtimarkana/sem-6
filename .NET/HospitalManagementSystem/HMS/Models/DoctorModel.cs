using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public class DoctorModel
    {
        [Key]
        public int? DoctorID { get; set; }

        [Required (ErrorMessage ="Name is Required")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Name must be between 6 and 20 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage ="Phone Number is Required")]
        [Phone(ErrorMessage ="Enter Valid Phone Number")]
        public string Phone { get; set; }

        [Required(ErrorMessage ="Email is Required")]
        [EmailAddress(ErrorMessage ="Enter Valid Email Address")]
        public string Email { get; set; }

        [Required(ErrorMessage ="Qualification is Required")]
        [StringLength(50,ErrorMessage ="Enter Length under 50 charcter")]
        public string Qualification { get; set; }

        [Required(ErrorMessage = "Specialization is Required")]
        [StringLength(50, ErrorMessage = "Enter Length under 50 charcter")]
        public string Specialization { get; set; }

        [Required(ErrorMessage ="IsActive is Required")]
        public bool IsActive { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }

        [Required(ErrorMessage ="User Id is Required")]
        public int UserID { get; set; }
   
    }
    public class DoctorDropDownModel
    {
        public int DoctorID { get; set; }
        public string Name { get; set; }
    }
}

