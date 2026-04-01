import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = [];
      querySnapshot.forEach((docSnap) => {
        usersList.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort to put pending first ideally, or just alphabetically
      usersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setUsers(usersList);
      setError(null);
    } catch (err) {
      setError("Failed to load users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId, updateData) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updateData);
      
      // Optimitically update UI
      setUsers(users.map(u => u.id === userId ? { ...u, ...updateData } : u));
    } catch (err) {
      alert("Failed to update user: " + err.message);
    }
  };

  const getStatus = (user) => {
    if (user.disabled) return "disabled";
    if (user.approved) return "approved";
    return "pending";
  };

  const filteredUsers = users.filter((u) => {
    if (activeFilter === "all") return true;
    return getStatus(u) === activeFilter;
  });

  if (loading) return <div className="p-8 text-center text-gray-500"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i><p>Loading Users...</p></div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg shadow-sm border border-red-200">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden fade-in">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="text-xl font-bold text-rmc-dark-green">Access Management</h3>
          <p className="text-sm text-gray-500">Approve, deny, or revoke access to the Studio CMS.</p>
        </div>
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          {["all", "pending", "approved", "disabled"].map(filter => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md capitalize transition ${activeFilter === filter ? 'bg-rmc-green text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400 font-medium">No users found matching this status.</td></tr>
            ) : filteredUsers.map((user) => {
              const status = getStatus(user);
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-rmc-dark-green text-white flex items-center justify-center rounded-full font-bold">
                        {user.firstName?.charAt(0) || "U"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email} • {user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.district}, {user.sector}</div>
                    <div className="text-sm text-gray-500">{user.province}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {status === "approved" && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200"><i className="fas fa-check-circle mr-1 mt-0.5"></i> Approved</span>}
                    {status === "pending" && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200"><i className="fas fa-hourglass-half mr-1 mt-0.5"></i> Pending</span>}
                    {status === "disabled" && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200"><i className="fas fa-ban mr-1 mt-0.5"></i> Disabled</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.email !== "islamrwanda18@gmail.com" ? (
                      <div className="flex justify-end space-x-2">
                        {status !== "approved" && (
                          <button 
                            onClick={() => handleUpdateStatus(user.id, { approved: true, disabled: false })}
                            className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 px-3 py-1 rounded shadow-sm transition"
                          >
                            Approve
                          </button>
                        )}
                        {status !== "disabled" && (
                          <button 
                            onClick={() => handleUpdateStatus(user.id, { approved: false, disabled: true })}
                            className="bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 px-3 py-1 rounded shadow-sm transition"
                          >
                            Disable
                          </button>
                        )}
                        {status === "disabled" && (
                          <button 
                            onClick={() => handleUpdateStatus(user.id, { approved: false, disabled: false })}
                            className="bg-yellow-50 text-yellow-700 hover:bg-yellow-600 hover:text-white border border-yellow-200 px-3 py-1 rounded shadow-sm transition"
                          >
                            Mark Pending
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Master Account</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
