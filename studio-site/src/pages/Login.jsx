import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for AuthContext redirect logic in App.jsx to handle approval routing
      navigate("/");
    } catch (err) {
      setError("Failed to sign in. " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-rmc-dark-green">RMC Studio</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage portal content
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rmc-green focus:border-rmc-green outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rmc-green focus:border-rmc-green outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-rmc-green hover:bg-rmc-dark-green focus:outline-none transition">
              Sign in
            </button>
          </div>
          
          <div className="text-center text-sm">
            <Link to="/signup" className="font-medium text-rmc-blue hover:text-blue-500">
              Don't have an account? Apply for access.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
