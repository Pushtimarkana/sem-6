import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/layout/AuthLayout"; 
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard"
import Showcase from "./pages/Showcase"
import TaskList from "./pages/tasks/TaskList";
import AddTask from "./pages/tasks/AddTask";
import UserList from "./pages/users/UserList";
import SubTaskList from "./pages/subtasks/SubTaskList";
import UserDetails from "./pages/users/UserDetails";
import AssignTasks from "./pages/tasks/AssignTasks";
import AddEditUser from "./pages/users/AddEditUser";
import AppLayout from "./components/layout/AppLayout";
import LabelList from "./pages/labels/LabelList";
import SkillList from "./pages/skills/SkillList";
import Calendar from "./pages/calendar/Calendar";
import Performance from "./pages/calendar/Performance";
import ErrorPage from "./pages/errors/ErrorPage";
import AIChatPanel from "./components/ai/AIChatPanel";
import UserDashboard from "./pages/Dashboard/UserDashBoard";
import { NotificationProvider} from "./context/NotificationContext";

function App() {
  return (
    <BrowserRouter>
     <NotificationProvider>
      

      <Routes>
        {/* Auth pages (NO sidebar) */}
        <Route path="/" element={<Home/>} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/error" element={<ErrorPage />} />
           
        </Route>
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Dashboard />
              </ProtectedRoute>
            } />
          <Route path="/user-dashboard" element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserDashboard />
              </ProtectedRoute>
            }/>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/add" element={<AddTask />} />
          <Route path="/users" element={<UserList/> }/>
          <Route path="/tasks/edit/:id" element={<AddTask />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/users/add" element={<AddEditUser />} />
          <Route path="/users/edit/:id" element={<AddEditUser />} />
          <Route path="/subtasks" element={<SubTaskList />} />
          <Route path="/tasks/assign" element={<AssignTasks />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/skills" element={<SkillList />} />
          <Route path="/labels" element={<LabelList />} />
          <Route path="/calendar" element={<Calendar/>} />
          <Route path="/performance" element={<Performance/>} />
          <Route path="/aichat" element={<AIChatPanel/>} />
          
        </Route>
        <Route path="*" element={<ErrorPage />} />

      </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
