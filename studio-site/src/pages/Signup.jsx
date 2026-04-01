import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function Signup() {
  const [formData, setFormData] = useState({
    fname: "", lname: "", gender: "", email: "", phone: "",
    province: "", district: "", sector: "", password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // 1. Create Auth Profile
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Save document to Firestore
      const userDoc = {
        uid: user.uid,
        email: formData.email,
        firstName: formData.fname,
        lastName: formData.lname,
        gender: formData.gender,
        phone: formData.phone,
        province: formData.province,
        district: formData.district,
        sector: formData.sector,
        approved: false,
        role: "admin",
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", user.uid), userDoc);

      // 3. Trigger Email to islamrwanda18@gmail.com using EmailJS
      // NOTE: Because you need an actual EmailJS Service ID, Template ID, and Public Key,
      // you will need to replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'YOUR_PUBLIC_KEY'.
      // For this implementation, we simulate the structure sending to the template correctly.
      
      const emailParams = {
        to_email: "islamrwanda18@gmail.com",
        user_name: `${formData.fname} ${formData.lname}`,
        user_gender: formData.gender,
        user_email: formData.email,
        user_phone: formData.phone,
        user_province: formData.province,
        user_district: formData.district,
        user_sector: formData.sector,
        approval_link: `${window.location.origin}/admin/approve?uid=${user.uid}`
      };

      try {
        await emailjs.send(
          'service_vtvh3vw', // User's Service ID
          'template_bzmjyxt', // User's Template ID
          emailParams,
          'CozSfVKC6Fo2jiDti' // Injected Public Key from User
        );
      } catch (emailErr) {
        console.warn("EmailJS not fully configured yet. Approval email failed to send, but user is registered.", emailErr);
      }

      setLoading(false);
      navigate("/pending");

    } catch (err) {
      setLoading(false);
      setError("Failed to create account: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-rmc-dark-green">Request Studio Access</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Requires manual verification</p>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</div>}
        
        <form className="mt-8 space-y-4" onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="fname" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lname" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telephone</label>
              <input type="tel" name="phone" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <input type="text" name="province" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <input type="text" name="district" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sector</label>
              <input type="text" name="sector" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input type="email" name="email" required className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required minLength={6} className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-rmc-green focus:border-rmc-green" onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-rmc-green hover:bg-rmc-dark-green transition disabled:opacity-50">
            {loading ? "Submitting Request..." : "Submit Registration"}
          </button>

          <div className="text-center text-sm mt-4">
            <Link to="/login" className="font-medium text-rmc-blue hover:text-blue-500">
              Already verified? Sign in here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
