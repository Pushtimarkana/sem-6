using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public class AppointmentModel
    {
        [Key]
        public int? AppointmentID { get; set; }

        [Required(ErrorMessage = "Doctor is required.")]
        public int DoctorID { get; set; }

        [Required(ErrorMessage = "Patient is required.")]
        public int PatientID { get; set; }

        [Required(ErrorMessage = "Appointment date is required.")]
        [DataType(DataType.DateTime)]
        [Display(Name = "Appointment Date & Time")]
        public DateTime AppointmentDate { get; set; }

        [Required(ErrorMessage = "Appointment status is required.")]
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        public string AppointmentStatus { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string Description { get; set; }

        [Display(Name = "Special Remarks")]
        [StringLength(300, ErrorMessage = "Remarks cannot exceed 300 characters.")]
        public string SpecialRemarks { get; set; }
        public DateTime? Created { get; set; }
        public DateTime Modified { get; set; }

        [Required(ErrorMessage = "User is required.")]
        public int UserID { get; set; }

        [Required(ErrorMessage = "Consulted amount is required.")]
        public decimal TotalConsultedAmount { get; set; }








    }
}
