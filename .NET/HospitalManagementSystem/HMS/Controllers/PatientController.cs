using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HMS.Controllers
{
    [CheckAccess]
    public class PatientController : Controller
    {
        private IConfiguration configuration;
        public PatientController(IConfiguration _configuration)
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
            command.CommandText = "PR_Patient_SELECTALL";
            SqlDataReader reader = command.ExecuteReader();

            

            DataTable table = new DataTable();
            table.Load(reader);
            return View("PatientList",table);
        }
        #region Add Patient
        public IActionResult PatientAddEdit(PatientModel patientModel)
        {
            ViewBag.UserList = getUserDropdown();
            if (ModelState.IsValid)
            {
                string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
                SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;

                if (patientModel.PatientID == null || patientModel.PatientID == 0)
                    
                {
                    command.CommandText = "PR_Patient_INSERT";
                }
                else
                {
                    command.CommandText = "PR_Patient_UPDATE";
                    command.Parameters.Add("@PatientID", SqlDbType.Int).Value = patientModel.PatientID;
                }

                command.Parameters.Add("@Name", SqlDbType.NVarChar).Value = patientModel.Name;
                command.Parameters.Add("@DateOfBirth", SqlDbType.DateTime).Value = patientModel.DateOfBirth;
                command.Parameters.Add("@Gender", SqlDbType.NVarChar).Value = patientModel.Gender;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = patientModel.Email;
                command.Parameters.Add("@Phone", SqlDbType.NVarChar).Value = patientModel.Phone;
                command.Parameters.Add("@Address", SqlDbType.NVarChar).Value = patientModel.Address;
                command.Parameters.Add("@City", SqlDbType.NVarChar).Value = patientModel.City;
                command.Parameters.Add("@State", SqlDbType.NVarChar).Value = patientModel.State;
                command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = patientModel.IsActive;
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = patientModel.UserID;
               
                command.ExecuteNonQuery();

                ViewBag.Message = "Data Inserted Successfully";
                return RedirectToAction("Index");

            }

            //return View();
            return View("PatientAddEdit", patientModel);

        }
        #endregion

        #region select by id
        public IActionResult PatientEdit(int PatientID)
        {
            ViewBag.UserList = getUserDropdown();
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;

            command.CommandText = "PR_Patient_SELECTBYPK";
            command.Parameters.Add("@PatientID", SqlDbType.Int).Value = PatientID;
            SqlDataReader reader = command.ExecuteReader();

            DataTable table = new DataTable();
            table.Load(reader);
            PatientModel patientModel = new PatientModel();

            foreach (DataRow dr in table.Rows)
            {
                patientModel.PatientID = Convert.ToInt32(dr["PatientID"]);
                patientModel.Name = dr["Name"].ToString();
                patientModel.DateOfBirth = Convert.ToDateTime(dr["DateOfBirth"]);
                patientModel.Gender = dr["Gender"].ToString();
                patientModel.Email = dr["Email"].ToString();
                patientModel.Phone = dr["Phone"].ToString();
                patientModel.Address = dr["Address"].ToString();
                patientModel.City = dr["City"].ToString();
                patientModel.State = dr["State"].ToString();
                patientModel.IsActive = Convert.ToInt32(dr["IsActive"]);
                patientModel.UserID = Convert.ToInt32(dr["UserID"]);

            }
            return View("PatientAddEdit", patientModel);
        }
        #endregion
        public IActionResult PatientDelete(int PatientID)
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Patient_DELETE";
            command.Parameters.Add("@PatientID", SqlDbType.Int).Value = PatientID;
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
