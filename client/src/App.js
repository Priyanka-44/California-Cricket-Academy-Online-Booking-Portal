import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import Booking from "./pages/Booking";
import CoachDashboard from "./coach/pages/CoachDashboard";
import CoachStudents from "./coach/pages/Students";
import BatchDetails from "./pages/BatchDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ManageBatches from "./admin/pages/ManageBatches";
import ManageCoaches from "./admin/pages/ManageCoaches";
import ViewBookings from "./admin/pages/ViewBookings";
import Users from "./admin/pages/Users";
import Profile from "./user/pages/Profile";
import MyBatches from "./coach/pages/MyBatches";
import Attendance from "./coach/pages/Attendance";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import CoachProfile from "./coach/pages/CoachProfile";
import AdminProfile from "./admin/pages/AdminProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./user/pages/UserDashboard";
import UserAttendance from "./user/pages/Attendance";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  // Admin pages pe header hide
  const isAdminRoute = location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/coach") ||
    location.pathname.startsWith("/user");

  const hideFooter = location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/coach") ||
    location.pathname.startsWith("/user");

  return (
    <div>
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/confirmation/:id" element={<Confirmation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/program/:id" element={<BatchDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><ViewBookings /></ProtectedRoute>} />
        <Route path="/admin/coaches" element={<ProtectedRoute role="admin"><ManageCoaches /></ProtectedRoute>} />
        <Route path="/admin/batches" element={<ProtectedRoute role="admin"><ManageBatches /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />

        {/* COACH */}

        <Route path="/coach/students" element={<ProtectedRoute role="coach"><CoachStudents /></ProtectedRoute>} />
        <Route
          path="/coach/dashboard"
          element={
            <ProtectedRoute role="coach">
              <CoachDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/students"
          element={
            <ProtectedRoute>
              <CoachStudents />
            </ProtectedRoute>
          }
        />
        <Route path="/coach/profile" element={<ProtectedRoute role="coach"><CoachProfile /></ProtectedRoute>} />
        <Route path="/coach/batches" element={<ProtectedRoute role="coach"><MyBatches /></ProtectedRoute>} />
        <Route path="/coach/attendance" element={<ProtectedRoute role="coach"><Attendance /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/attendance"
          element={
            <ProtectedRoute role="user">
              <UserAttendance />
            </ProtectedRoute>
          }
        />

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      {!hideFooter && <Footer />}
    </div>
  );
}
export default App;




