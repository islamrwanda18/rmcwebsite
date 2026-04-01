import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PendingApproval from "./pages/PendingApproval";
import Dashboard from "./pages/Dashboard";
import Approve from "./pages/Approve";
import "./index.css";

// Protection Wrapper ensuring user is logged in
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Application...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  return <Outlet />;
};

// Approval Wrapper ensuring user is BOTH logged in and explicitly approved
const CMSRoute = () => {
  const { currentUser, userData, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading User Data...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  
  // Natively check if approved flag exists and is true
  if (userData && userData.approved === true) {
    return <Outlet />;
  }
  
  // If not approved, redirect to pending screen
  return <Navigate to="/pending" />;
};

function AppRoutes() {
  return (
    <Router basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Must be authed, but doesn't need approval to see pending or approve page */}
        <Route element={<ProtectedRoute />}>
          <Route path="/pending" element={<PendingApproval />} />
          <Route path="/approve" element={<Approve />} />
        </Route>

        {/* Must be Authed AND Approved to see Dashboard */}
        <Route element={<CMSRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
