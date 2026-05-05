using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace HMS.Controllers
{
    [CheckAccess]
    public class DoctorController : Controller
    {
        private IConfiguration configuration;
        private object sqlDbType;
        public DoctorController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }
        public IActionResult Index()
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Doctor_SELECTALL";
            SqlDataReader reader = command.ExecuteReader();



            DataTable table = new DataTable();
            table.Load(reader);
            return View("DoctorList",table);
        }

        public IActionResult DoctorForm()
        {
            ViewBag.UserList = getUserDropdown();
            return View("DoctorAddEdit");
        }

        public IActionResult DoctorAddEdit(DoctorModel doctorModel)
        {
            ViewBag.UserList = getUserDropdown();
            if (ModelState.IsValid)
            {
                string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
                SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;

                if (doctorModel.DoctorID == null|| doctorModel.DoctorID==0)
                {
                    command.CommandText = "PR_Doctor_INSERT";
                }
                else
                {
                    command.CommandText = "PR_Doctor_UPDATE";
                    command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = doctorModel.DoctorID;
                }

                command.Parameters.Add("@Name", SqlDbType.NVarChar).Value = doctorModel.Name;
                command.Parameters.Add("@Phone", SqlDbType.NVarChar).Value = doctorModel.Phone;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = doctorModel.Email;
                command.Parameters.Add("@Qualification", SqlDbType.NVarChar).Value = doctorModel.Qualification;
                command.Parameters.Add("@Specialization", SqlDbType.NVarChar).Value = doctorModel.Specialization;
                command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = doctorModel.IsActive;
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = doctorModel.UserID;
               

                //command.Parameters.AddWithValue("@PatientID", appointmentModel.PatientID);
                command.ExecuteNonQuery();

                ViewBag.Message = "Data Inserted Successfully";
                return RedirectToAction("Index");

            }

            //return View();
            return View("DoctorAddEdit", doctorModel);

        }
        public IActionResult DoctorEdit(int DoctorID)
        {
            ViewBag.UserList = getUserDropdown();
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;

            command.CommandText = "PR_Doctor_SELECTBYPK";
            command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = DoctorID;
            SqlDataReader reader = command.ExecuteReader();

            DataTable table = new DataTable();
            table.Load(reader);
            DoctorModel doctorModel= new DoctorModel();

            foreach (DataRow dr in table.Rows)
            {
                doctorModel.DoctorID = Convert.ToInt32(dr["DoctorID"]);
                doctorModel.Name = dr["Name"].ToString();
                doctorModel.Phone = dr["Phone"].ToString();
                doctorModel.Email = dr["Email"].ToString();
                doctorModel.Qualification = dr["Qualification"].ToString();
                doctorModel.Specialization = dr["Specialization"].ToString();
                doctorModel.IsActive = Convert.ToBoolean(dr["IsActive"]);
                doctorModel.UserID = Convert.ToInt32(dr["UserID"]);
      

            }
            return View("DoctorAddEdit", doctorModel);
        }

        public IActionResult DoctorDelete(int DoctorID)
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Doctor_DELETE";
            command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = DoctorID;
            command.ExecuteNonQuery();

            return RedirectToAction("Index");
        }

        public List<UserDropDownModel> getUserDropdown()
        {
            string ConnectionString = this.configuration.GetConnectionString("ConnectionString");
            using SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_User_SelectForDropDown";

            SqlDataReader reader = command.ExecuteReader();
            DataTable dataTable = new DataTable();
            dataTable.Load(reader);

            List<UserDropDownModel> userList = new List<UserDropDownModel>();
            foreach (DataRow data in dataTable.Rows)
            {
                UserDropDownModel model = new UserDropDownModel();
                model.UserID = Convert.ToInt32(data["UserID"]);
                model.UserName = data["UserName"].ToString();
                userList.Add(model);
            }
            connection.Close();
            return userList;
        }
    }
}
