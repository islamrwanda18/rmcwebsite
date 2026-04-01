import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Approve() {
  const [searchParams] = useSearchParams();
  const targetUid = searchParams.get("uid");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("Loading...");
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    // Only islamrwanda18@gmail.com can approve users
    if (currentUser?.email !== "islamrwanda18@gmail.com") {
      setStatus("Unauthorized: Only the master administrator can approve access.");
      return;
    }

    if (!targetUid) {
      setStatus("Invalid Request: No User ID provided.");
      return;
    }

    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", targetUid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTargetUser(docSnap.data());
          setStatus("Ready to Approve");
        } else {
          setStatus("User not found.");
        }
      } catch (err) {
        setStatus("Error fetching user: " + err.message);
      }
    };

    fetchUser();
  }, [currentUser, targetUid]);

  const handleApprove = async () => {
    try {
      setStatus("Approving...");
      const docRef = doc(db, "users", targetUid);
      await updateDoc(docRef, { approved: true });
      setStatus("User successfully approved!");
    } catch (err) {
      setStatus("Failed to approve user: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 fade-in">
      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100 text-center">
        <h2 className="text-3xl font-extrabold text-rmc-dark-green mb-6">Review Access Request</h2>
        
        {targetUser ? (
          <div className="bg-gray-50 p-6 rounded-lg text-left mb-6 border border-gray-200">
            <h3 className="font-bold text-lg border-b pb-2 mb-4">Applicant Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Name:</strong> {targetUser.firstName} {targetUser.lastName}</p>
              <p><strong>Email:</strong> {targetUser.email}</p>
              <p><strong>Gender:</strong> {targetUser.gender}</p>
              <p><strong>Telephone:</strong> {targetUser.phone}</p>
              <p><strong>Province:</strong> {targetUser.province}</p>
              <p><strong>District:</strong> {targetUser.district}</p>
              <p><strong>Sector:</strong> {targetUser.sector}</p>
              <p><strong>Currently Approved:</strong> {targetUser.approved ? "Yes" : "No"}</p>
            </div>
          </div>
        ) : (
          <div className="mb-6 py-4 px-6 bg-red-50 text-red-600 rounded-lg">{status}</div>
        )}

        {targetUser && !targetUser.approved && (
          <button 
            onClick={handleApprove}
            className="w-full py-3 px-4 bg-rmc-green text-white font-bold rounded-lg hover:bg-rmc-dark-green transition mb-4"
          >
            Approve User Access
          </button>
        )}

        {targetUser && targetUser.approved && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg font-bold mb-4">
            This user has been approved. They can now access the localized Studio Dashboard.
          </div>
        )}

        <button onClick={() => navigate("/")} className="text-sm font-semibold text-gray-500 hover:text-rmc-blue">
          &larr; Return to Dashboard
        </button>
      </div>
    </div>
  );
}
