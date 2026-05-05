using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HMS.Controllers
{
    [CheckAccess]
    public class DepartmentController : Controller
    {
        private IConfiguration configuration;
        public DepartmentController(IConfiguration _configuration)
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
            command.CommandText = "PR_Department_SELECTALL";
            SqlDataReader reader = command.ExecuteReader();



            DataTable table = new DataTable();
            table.Load(reader);
            return View("DepartmentList", table);
        }
        #region Add department
        public IActionResult DepartmentAddEdit(DepartmentModel departmentModel)
        {
            ViewBag.UserList = getUserDropdown();
            if (ModelState.IsValid)
            {
                string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
                SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;

                if (departmentModel.DepartmentID == null || departmentModel.DepartmentID == 0)
                {
                    command.CommandText = "PR_Department_INSERT";
                }
                else
                {
                    command.CommandText = "PR_Department_UPDATE";
                    command.Parameters.Add("@DepartmentID", SqlDbType.Int).Value = departmentModel.DepartmentID;
                }

                command.Parameters.Add("@DepartmentName", SqlDbType.NVarChar).Value = departmentModel.DepartmentName;
                command.Parameters.Add("@Description", SqlDbType.NVarChar).Value = departmentModel.Description;
                command.Parameters.Add("@IsActive ", SqlDbType.Bit).Value = departmentModel.IsActive;
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = departmentModel.UserID;
               

                //command.Parameters.AddWithValue("@PatientID", appointmentModel.PatientID);
                command.ExecuteNonQuery();

                ViewBag.Message = "Data Inserted Successfully";
                return RedirectToAction("Index");

            }

            //return View();
            return View("DepartmentAddEdit", departmentModel);

        }
        #endregion

        #region select by id
        public IActionResult DepartmentEdit(int DepartmentID)
        {
            ViewBag.UserList = getUserDropdown();

            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;

            command.CommandText = "PR_Department_SELECTBYPK";
            command.Parameters.Add("@DepartmentID", SqlDbType.Int).Value = DepartmentID;
            SqlDataReader reader = command.ExecuteReader();

            DataTable table = new DataTable();
            table.Load(reader);
            DepartmentModel departmentModel = new DepartmentModel();

            foreach (DataRow dr in table.Rows)
            {
                departmentModel.DepartmentID = Convert.ToInt32(dr["DepartmentID"]);
                departmentModel.DepartmentName = dr["DepartmentName"].ToString();
                departmentModel.Description = dr["Description"].ToString();
                departmentModel.IsActive = Convert.ToInt32(dr["IsActive"]);
                departmentModel.UserID = Convert.ToInt32(dr["UserID"]);

            }
            return View("DepartmentAddEdit", departmentModel);
        }
        #endregion
        public IActionResult DepartmentDelete(int DepartmentID)
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Department_DELETE";
            command.Parameters.Add("@DepartmentID", SqlDbType.Int).Value = DepartmentID;
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
