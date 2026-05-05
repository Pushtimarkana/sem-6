using ClosedXML.Excel;
using HMS.Helper;
using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HMS.Controllers
{
    [CheckAccess]
    public class AppointmentController : Controller
    {
        #region confi
        private IConfiguration configuration;
        private object sqlDbType;

        public AppointmentController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }
        #endregion

        #region Get All Appointment
        public IActionResult Index()
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Appointment_SELECTALL";
            SqlDataReader reader = command.ExecuteReader();



            DataTable table = new DataTable();
            table.Load(reader);
            return View("AppointmentList", table);
        }

        #endregion
        [HttpGet]
        public IActionResult AppointmentAddEdit()
        {
            ViewBag.UserList = getUserDropdown();
            ViewBag.PatientList = getPatientDropdown();
            ViewBag.DoctorList = getDoctorDropdown();
            return View();
        }

        #region Add Appointment
        [HttpPost]
        public IActionResult AppointmentAddEdit(AppointmentModel appointmentModel)
        {
            ViewBag.UserList = getUserDropdown();
            ViewBag.PatientList=getPatientDropdown();
            ViewBag.DoctorList = getDoctorDropdown();
            if (ModelState.IsValid)
            {
                string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
                SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;

                if (appointmentModel.AppointmentID == null || appointmentModel.AppointmentID == 0)
                {
                    command.CommandText = "PR_Appointment_INSERT";
                }
                else
                {
                    command.CommandText = "PR_Appointment_UPDATE";
                    command.Parameters.Add("@AppointmentID", SqlDbType.Int).Value = appointmentModel.AppointmentID;
                }

                command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = appointmentModel.DoctorID;
                command.Parameters.Add("@PatientID", SqlDbType.Int).Value = appointmentModel.PatientID;
                command.Parameters.Add("@AppointmentDate", SqlDbType.DateTime).Value = appointmentModel.AppointmentDate;
                command.Parameters.Add("@AppointmentStatus", SqlDbType.NVarChar).Value = appointmentModel.AppointmentStatus;
                command.Parameters.Add("@Description", SqlDbType.NVarChar).Value = appointmentModel.Description;
                command.Parameters.Add("@SpecialRemarks", SqlDbType.NVarChar).Value = appointmentModel.SpecialRemarks;
               
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = appointmentModel.UserID;
                command.Parameters.Add("@TotalConsultedAmount", SqlDbType.Decimal).Value = appointmentModel.TotalConsultedAmount;

                //command.Parameters.AddWithValue("@PatientID", appointmentModel.PatientID);
                command.ExecuteNonQuery();

                ViewBag.InsertMessage = "Data Inserted Successfully";
                return RedirectToAction("Index");
                
            }

            //return View();
            return View();

        }
        #endregion

        #region select by id
        public IActionResult AppointmentEdit(string? DecAppointmentID)
        {
            int decryptedAppointmentID = Convert.ToInt32(UrlEncryptor.Decrypt(DecAppointmentID));
            // Use decryptedProductID for database operations
            ViewBag.UserList = getUserDropdown();
            ViewBag.PatientList=getPatientDropdown();
            ViewBag.DoctorList=getDoctorDropdown();
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
                SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                
                    command.CommandText = "PR_Appointment_SELECTBYPK";
                    command.Parameters.Add("@AppointmentID", SqlDbType.Int).Value = decryptedAppointmentID;
                    SqlDataReader reader = command.ExecuteReader();

                    DataTable table = new DataTable();
                    table.Load(reader);
                    AppointmentModel appointmentModel = new AppointmentModel();

                foreach (DataRow dr in table.Rows)
                {
                    appointmentModel.AppointmentID = Convert.ToInt32(dr["AppointmentID"]);
                    appointmentModel.DoctorID = Convert.ToInt32(dr["DoctorID"]);
                    appointmentModel.PatientID = Convert.ToInt32(dr["PatientID"]);
                    appointmentModel.AppointmentDate = Convert.ToDateTime(dr["AppointmentDate"]);
                    appointmentModel.AppointmentStatus = dr["AppointmentStatus"].ToString();
                    appointmentModel.Description = dr["Description"].ToString();
                    appointmentModel.SpecialRemarks = dr["SpecialRemarks"].ToString();
                    appointmentModel.Created = Convert.ToDateTime(dr["Created"]);
                    appointmentModel.UserID = Convert.ToInt32(dr["UserID"]);
                    appointmentModel.TotalConsultedAmount = Convert.ToDecimal(dr["TotalConsultedAmount"]);

                }
            return View("AppointmentAddEdit", appointmentModel);
        }
        #endregion

        #region Delete Appointment
        public IActionResult AppointmentDelete(string AppointmentID)
        {
            int decryptedAppointmentID = Convert.ToInt32(UrlEncryptor.Decrypt(AppointmentID));
            // Use decryptedProductID for database operations
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Appointment_DELETE";
            command.Parameters.Add("@AppointmentID",SqlDbType.Int).Value = decryptedAppointmentID;
            command.ExecuteNonQuery();

            TempData["Message"] = "Data Deleted Successfully";
            return RedirectToAction("Index");
            
        }

        #endregion

        #region DeleteAll
        [HttpPost]
        public IActionResult DeleteSelectedAppointments(List<int> selectedAppointments)
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            if (selectedAppointments != null && selectedAppointments.Any())
            {
                foreach (int AppointmentID in selectedAppointments)
                {
                    // Call your delete logic, e.g.:
                    command.Parameters.Clear(); 
                    command.CommandText = "PR_Appointment_DELETE";
                    command.Parameters.Add("@AppointmentID", SqlDbType.Int).Value = AppointmentID;
                    command.ExecuteNonQuery();
                }

                TempData["Message"] = "Selected appointments deleted successfully.";
            }
            else
            {
                TempData["Message"] = "No appointments selected for deletion.";
            }
           
            return RedirectToAction("Index");

        }


        #endregion

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

        public List<PatientDropDownModel> getPatientDropdown()
        {
            string ConnectionString = this.configuration.GetConnectionString("ConnectionString");
            using SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Patient_SelectForDropDown";

            SqlDataReader reader = command.ExecuteReader();
            DataTable dataTable = new DataTable();
            dataTable.Load(reader);

            List<PatientDropDownModel> patientList = new List<PatientDropDownModel>();
            foreach (DataRow data in dataTable.Rows)
            {
                PatientDropDownModel model = new PatientDropDownModel();
                model.PatientID = Convert.ToInt32(data["PatientID"]);
                model.Name = data["Name"].ToString();
                patientList.Add(model);
            }
            connection.Close();
            return patientList;
        }

        public List<DoctorDropDownModel> getDoctorDropdown()
        {
            string ConnectionString = this.configuration.GetConnectionString("ConnectionString");
            using SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Doctor_SelectForDropDown";

            SqlDataReader reader = command.ExecuteReader();
            DataTable dataTable = new DataTable();
            dataTable.Load(reader);

            List<DoctorDropDownModel> doctorList = new List<DoctorDropDownModel>();
            foreach (DataRow data in dataTable.Rows)
            {
                DoctorDropDownModel model = new DoctorDropDownModel();
                model.DoctorID = Convert.ToInt32(data["DoctorID"]);
                model.Name = data["Name"].ToString();
                doctorList.Add(model);
            }
            connection.Close();
            return doctorList;
        }

        [Route("ExportToExcel")]
        public IActionResult ExportToExcel()
        {
            string ConnectionString = this.configuration.GetConnectionString(name: "ConnectionString");
            SqlConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Appointment_SELECTALL";
            SqlDataReader reader = command.ExecuteReader();



            DataTable table = new DataTable();
            table.Load(reader); 
            


            using (var workbook = new XLWorkbook())
            {
                // Add the DataTable to a worksheet
                workbook.Worksheets.Add(table, "Appointments");

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "States.xlsx"
                    );
                }
            }
        }

      

        public IActionResult Search(string SearchData = null, string SearchDoctor = null, string SearchDate = null)
        {
            DataTable dt = new DataTable();
            try
            {
                string ConnectionString = this.configuration.GetConnectionString("ConnectionString");
                using SqlConnection connection = new SqlConnection(ConnectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "PR_Appointment_Filter";

                // Status, Description, Remarks
                command.Parameters.AddWithValue("@search_Status", string.IsNullOrEmpty(SearchData) ? DBNull.Value : SearchData);

                // Doctor
                command.Parameters.AddWithValue("@search_Doctor", string.IsNullOrEmpty(SearchDoctor) ? DBNull.Value : SearchDoctor);

                // Date (convert properly)
                if (DateTime.TryParse(SearchDate, out DateTime parsedDate))
                    command.Parameters.AddWithValue("@search_Date", parsedDate.Date);
                else
                    command.Parameters.AddWithValue("@search_Date", DBNull.Value);

                SqlDataReader reader = command.ExecuteReader();
                dt.Load(reader);
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = ex.Message;
            }

            ViewBag.SearchData = SearchData;
            ViewBag.SearchDoctor = SearchDoctor;
            ViewBag.SearchDate = SearchDate;

            return View("AppointmentList", dt);
        }

    }
}
