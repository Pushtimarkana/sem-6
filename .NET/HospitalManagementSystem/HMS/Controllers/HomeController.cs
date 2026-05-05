using System.Diagnostics;
using HMS.Models;
using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly HospitalDbContext _context; // Add DbContext

        public HomeController(ILogger<HomeController> logger, HospitalDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            // Dashboard data
            ViewBag.TotalPatients = _context.Patient.Count();
            ViewBag.TodayAppointments = _context.Appointment.Where(a => a.AppointmentDate.Date == DateTime.Today).Count();
            ViewBag.TotalDoctors = _context.Doctor.Count();
            ViewBag.TotalDepartments=_context.Department.Count();
            ViewBag.TotalUsers= _context.User.Count();
            ViewBag.TotalDoctorDepartments=_context.DoctorDepartment.Count();
            ViewBag.TotalAppointments=_context.Appointment.Count();
            ViewBag.MonthlyEarnings = _context.Appointment
                .Where(b => b.AppointmentDate.Month == DateTime.Now.Month)
                .Sum(b => (decimal?)b.TotalConsultedAmount) ?? 0;

            ViewBag.PendingAppointments = _context.Appointment.Where(a => a.AppointmentStatus == "Pending").Count();
            ViewBag.CompletedAppointments = _context.Appointment.Where(a => a.AppointmentStatus == "Completed").Count();
            ViewBag.CancelledAppointments = _context.Appointment.Where(a => a.AppointmentStatus == "Cancelled").Count();
            ViewBag.ConfirmedAppointments = _context.Appointment.Where(a => a.AppointmentStatus == "Confirmed").Count();

            return View(); // It will load Views/Home/Index.cshtml
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public IActionResult GetDoctorSpecialization()
        {
            var data = _context.Doctor
                .GroupBy(d => d.Specialization)
                .Select(g => new
                {
                    Specialization = g.Key,
                    Count = g.Count()
                })
                .ToList();

            return Json(data);
        }

    }
}


