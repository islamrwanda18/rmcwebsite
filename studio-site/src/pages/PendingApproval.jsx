import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PendingApproval() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // If the user happens to load this page but is actually approved, redirect them to dashboard
  if (userData && userData.approved) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
          <i className="fas fa-hourglass-half text-2xl text-yellow-600"></i>
        </div>
        <h2 className="text-3xl font-extrabold text-rmc-dark-green mb-2">Pending Approval</h2>
        <p className="text-gray-600 mb-6">
          Thank you for registering. Your account is currently under review by the administrator. You will be notified once you are granted access.
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 border border-rmc-green text-sm font-bold rounded-lg text-rmc-green hover:bg-gray-50 focus:outline-none transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
