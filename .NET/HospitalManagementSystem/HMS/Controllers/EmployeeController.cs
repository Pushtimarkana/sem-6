using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HMS.Controllers
{
    public class EmployeeController : Controller
    {
        private IConfiguration configuration;

        public EmployeeController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        public IActionResult EmployeeList()
        {
            //DB connectivity
            string ConnetionString = this.configuration.GetConnectionString(name: "ConnectionString");
            //need to give connectionstring to sql class
            SqlConnection connection = new SqlConnection(ConnetionString);

            //we open database 
            connection.Open();

            //we write command
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Employee_SELECTALL";

            SqlDataReader reader = command.ExecuteReader();

            //cathing value in table 
            DataTable table = new DataTable();
            table.Load(reader);
            return View(table);
        }

        public IActionResult EmployeeAddEdit(EmployeeModel employeeModel)
        {
            if (ModelState.IsValid)
            {
                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                if (employeeModel.EmployeeID == null || employeeModel.EmployeeID == 0)
                {
                    command.CommandText = "PR_Employee_INSERT";
                }
                else
                {
                    command.CommandText = "PR_Employee_UPDATE";
                    command.Parameters.Add("@EmployeeId", SqlDbType.Int).Value = employeeModel.EmployeeID;

                }
                command.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = employeeModel.FirstName;
                command.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = employeeModel.LastName;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = employeeModel.Email;
                command.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar).Value = employeeModel.PhoneNumber;
                command.Parameters.Add("@DateOfBirth", SqlDbType.DateTime).Value = employeeModel.DateOfBirth;
                command.Parameters.Add("@Gender", SqlDbType.NVarChar).Value = employeeModel.Gender;
                command.Parameters.Add("@HireDate", SqlDbType.DateTime).Value = employeeModel.HireDate;
                command.Parameters.Add("@JobTitle", SqlDbType.NVarChar).Value = employeeModel.JobTitle;
                command.Parameters.Add("@Department", SqlDbType.NVarChar).Value = employeeModel.Department;
                command.Parameters.Add("@Salary", SqlDbType.Float).Value = employeeModel.Salary;
                command.Parameters.Add("@IsActive", SqlDbType.Int).Value = employeeModel.IsActive;


                command.ExecuteNonQuery();

                return RedirectToAction("EmployeeList");
            }
            return View(employeeModel);
        }
        public IActionResult EmployeeFillData(int? EmployeeID)
        {
            if (EmployeeID == null || EmployeeID == 0)
            {
                EmployeeModel model1 = new EmployeeModel();
                return View("EmployeeAddEdit", model1);
            }

            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            SqlConnection connection = new SqlConnection(ConnetionString);

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Employee_SELECtBYPK";
            command.Parameters.Add("@EmployeeID", SqlDbType.Int).Value = EmployeeID;
            SqlDataReader reader = command.ExecuteReader();
            DataTable table = new DataTable();
            table.Load(reader);
            EmployeeModel model = new EmployeeModel();
            foreach (DataRow dr in table.Rows)
            {
                model.EmployeeID = Convert.ToInt32(dr["EmployeeID"].ToString());
                model.FirstName = dr["FirstName"].ToString();
                model.LastName = dr["LastName"].ToString();
                model.Email = dr["Email"].ToString();
                model.PhoneNumber = dr["PhoneNumber"].ToString();
                model.DateOfBirth = Convert.ToDateTime(dr["DateOfBirth"]);
                model.Gender = dr["Gender"].ToString();
                model.HireDate = Convert.ToDateTime(dr["HireDate"]);
                model.JobTitle = dr["JobTitle"].ToString();
                model.Department = dr["Department"].ToString();
                model.Salary = Convert.ToDouble(dr["Salary"]);

                model.IsActive = Convert.ToInt32(dr["IsActive"]);
            }

            return View("EmployeeAddEdit", model);
        }
        public IActionResult EmployeeDelete(int UserID)
        {
            //DB connectivity
            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            //need to give connectionstring to sql class
            SqlConnection connection = new SqlConnection(ConnetionString);

            //we open database 
            connection.Open();

            //we write command
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Employee_DELETE";
            command.Parameters.Add("@EmployeeID", SqlDbType.Int).Value = UserID;
            command.ExecuteNonQuery();
            //TempData["Message"] = "Data Deleted Succesfully";

            return RedirectToAction("EmployeeList");
           
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
