using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;


namespace HMS.Controllers
{
    public class UserController : Controller
    {
        //Connection String appsettings.json
        private IConfiguration configuration;
        public UserController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }
        public IActionResult Index()
        {
            //DB Connectivity
            //step-1 connection string
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection= new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_User_SELECTALL";
            SqlDataReader reader = command.ExecuteReader();

            //ExecuteReader()
            //ExecuteNonQuery()
            //ExecuteScalar()

            DataTable table = new DataTable();
            table.Load(reader);


            return View("UserList",table);
        }
        public IActionResult UserAddEdit(UserModel userModel)
        {
            //DB Connectivity
            //step-1 connection string
            if (ModelState.IsValid)
            {
                string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
                SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;

                if (userModel.UserID == null || userModel.UserID == 0)
                {
                    command.CommandText = "PR_User_INSERT";
                }
                else
                {
                    command.CommandText = "PR_User_UPDATE";
                    command.Parameters.Add("@UserID", SqlDbType.Int).Value = userModel.UserID;
                }

                command.Parameters.Add("@UserName", SqlDbType.NVarChar).Value = userModel.UserName;
                command.Parameters.Add("@Password", SqlDbType.NVarChar).Value = userModel.Password;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = userModel.Email;
                command.Parameters.Add("@MobileNo", SqlDbType.NVarChar).Value = userModel.MobileNo;
                command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = userModel.IsActive;
                
           

                //command.Parameters.AddWithValue("@PatientID", appointmentModel.PatientID);
                command.ExecuteNonQuery();

                ViewBag.Message = "Data Inserted Successfully";
                return RedirectToAction("Index");

            }

            //return View();
            return View("UserAddEdit", userModel);
        }


        #region select by id
        public IActionResult UserEdit(int UserID)
        {

            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;

            command.CommandText = "PR_User_SELECTBYPK";
            command.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
            SqlDataReader reader = command.ExecuteReader();

            DataTable table = new DataTable();
            table.Load(reader);
            UserModel userModel = new UserModel();

            foreach (DataRow dr in table.Rows)
            {
                userModel.UserID = Convert.ToInt32(dr["UserID"]);

                userModel.UserName = dr["UserName"].ToString();
                userModel.Password = dr["Password"].ToString();
                userModel.Email = dr["Email"].ToString();
                userModel.MobileNo = dr["MobileNo"].ToString();
                userModel.IsActive = Convert.ToBoolean(dr["IsActive"]);

            }
            return View("UserAddEdit", userModel);
        }
        #endregion

        public IActionResult UserDelete(int UserID)
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_User_DELETE";
            command.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
            command.ExecuteNonQuery();

            return RedirectToAction("Index");
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult UserLogin(UserLoginModel userLoginModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    string connectionString = this.configuration.GetConnectionString("ConnectionString");
                    SqlConnection sqlConnection = new SqlConnection(connectionString);
                    sqlConnection.Open();
                    SqlCommand sqlCommand = sqlConnection.CreateCommand();
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    sqlCommand.CommandText = "PR_User_Login";
                    sqlCommand.Parameters.Add("@UserName", SqlDbType.VarChar).Value = userLoginModel.UserName;
                    sqlCommand.Parameters.Add("@Password", SqlDbType.VarChar).Value = userLoginModel.Password;
                    SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                    DataTable dataTable = new DataTable();
                    dataTable.Load(sqlDataReader);
                    if (dataTable.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dataTable.Rows)
                        {
                            HttpContext.Session.SetString("UserID", dr["UserID"].ToString());
                            HttpContext.Session.SetString("UserName", dr["UserName"].ToString());
                        }

                        return RedirectToAction("Index", "User");
                    }
                    else
                    {
                        return RedirectToAction("Login", "User");
                    }

                }
            }
            catch (Exception e)
            {
                TempData["ErrorMessage"] = e.Message;
            }

            return RedirectToAction("Login");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "User");
        }
    }
}
