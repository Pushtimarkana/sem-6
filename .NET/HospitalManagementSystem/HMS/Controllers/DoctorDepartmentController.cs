using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HMS.Controllers
{
    [CheckAccess]
    public class DoctorDepartmentController : Controller
    {
        private IConfiguration configuration;
        private object sqlDbType;

        public DoctorDepartmentController(IConfiguration _configuration)
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
            command.CommandText = "PR_DoctorDepartment_SELECTALL";
            SqlDataReader reader = command.ExecuteReader();



            DataTable table = new DataTable();
            table.Load(reader);
            return View("DoctorDepartmentList",table);
        }
        #region Add Appointment
        public IActionResult DoctorDepartmentAddEdit(DoctorDepartmentModel doctorDepartmentModel)
        {
            ViewBag.UserList = getUserDropdown();
            if (ModelState.IsValid)
            {
                string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
                SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;

                if (doctorDepartmentModel.DoctorDepartmentID == null || doctorDepartmentModel.DoctorDepartmentID == 0)
                {
                    command.CommandText = "PR_DoctorDepartment_INSERT";
                }
                else
                {
                    command.CommandText = "PR_DoctorDepartment_UPDATE";
                    command.Parameters.Add("@DoctorDepartmentID", SqlDbType.Int).Value = doctorDepartmentModel.DoctorDepartmentID;
                }

                command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = doctorDepartmentModel.DoctorID;
                command.Parameters.Add("@DepartmentID", SqlDbType.Int).Value = doctorDepartmentModel.DepartmentID;
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = doctorDepartmentModel.UserID;


                //command.Parameters.AddWithValue("@PatientID", appointmentModel.PatientID);
                command.ExecuteNonQuery();

                ViewBag.Message = "Data Inserted Successfully";
                return RedirectToAction("Index");

            }
            return View("DoctorDepartmentAddEdit", doctorDepartmentModel);

        }
        #endregion

        #region select by id
        public IActionResult DoctorDepartmentEdit(int DoctorDepartmentID)
        {
            ViewBag.UserList = getUserDropdown();
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;

            command.CommandText = "PR_DoctorDepartment_SELECTBYPK";
            command.Parameters.Add("@DoctorDepartmentID", SqlDbType.Int).Value = DoctorDepartmentID;
            SqlDataReader reader = command.ExecuteReader();

            DataTable table = new DataTable();
            table.Load(reader);
            DoctorDepartmentModel doctorDepartmentModel = new DoctorDepartmentModel();

            foreach (DataRow dr in table.Rows)
            {
                doctorDepartmentModel.DoctorDepartmentID = Convert.ToInt32(dr["DoctorDepartmentID"]);
                doctorDepartmentModel.DoctorID = Convert.ToInt32(dr["DoctorID"]);
                doctorDepartmentModel.DepartmentID = Convert.ToInt32(dr["DepartmentID"]);
                doctorDepartmentModel.UserID = Convert.ToInt32(dr["UserID"]);

            }
            return View("DoctorDepartmentAddEdit", doctorDepartmentModel);
        }
        #endregion
        public IActionResult DoctorDepartmentDelete(int DoctorDepartmentID)
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_DoctorDepartment_DELETE";
            command.Parameters.Add("@DoctorDepartmentID", SqlDbType.Int).Value = DoctorDepartmentID;
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
