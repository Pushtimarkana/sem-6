using DocumentFormat.OpenXml.InkML;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Numerics;

namespace HMS.Models
{
    public class HospitalDbContext : DbContext
    {
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options)
        {
        }

        // Tables in your database
        public DbSet<PatientModel> Patient { get; set; }
        public DbSet<DoctorModel> Doctor { get; set; }
        public DbSet<AppointmentModel> Appointment { get; set; }
        public DbSet<UserModel> User { get; set; }
        public DbSet<DepartmentModel> Department { get; set; }
        public DbSet<DoctorDepartmentModel> DoctorDepartment { get; set; }

    }
}

