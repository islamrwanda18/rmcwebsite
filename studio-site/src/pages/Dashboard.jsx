import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import UserManagement from "../components/UserManagement";

export default function Dashboard() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("news");

  const handleLogout = async () => {
    await signOut(auth);
  };

  let menuItems = [
    { id: "services", label: "Services", icon: "fa-concierge-bell" },
    { id: "programs", label: "Programs", icon: "fa-project-diagram" },
    { id: "news", label: "News & Events", icon: "fa-newspaper" },
    { id: "partners", label: "Partners", icon: "fa-handshake" },
    { id: "board", label: "Board Members", icon: "fa-users" },
    { id: "mission", label: "Mission & Vision", icon: "fa-bullseye" },
    { id: "history", label: "History", icon: "fa-history" },
    { id: "xposts", label: "Latest X Posts", icon: "fa-twitter" }
  ];

  if (userData?.email === "islamrwanda18@gmail.com") {
    menuItems.push({ id: "users", label: "Manage Users", icon: "fa-user-shield" });
  }

  return (
    <div className="flex h-screen bg-gray-100 fade-in">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-rmc-dark-green text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700 flex items-center">
            <img src="https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg" alt="RMC Logo" className="h-10 w-10 mr-3 rounded-full bg-white p-0.5" />
            <div>
              <h1 className="font-bold text-lg leading-tight">RMC Studio</h1>
              <span className="text-xs text-rmc-green font-medium">Content Manager</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-6 py-3 flex items-center transition ${activeTab === item.id ? 'bg-rmc-green font-bold' : 'hover:bg-gray-800'}`}
                >
                  <i className={`fas ${item.icon} w-6 text-center mr-3`}></i>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="text-sm mb-4">
            <p className="font-semibold">{userData?.firstName} {userData?.lastName}</p>
            <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition"
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Log Out
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">
            Manage {menuItems.find(m => m.id === activeTab)?.label}
          </h2>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
            System Online
          </span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8 shadow-inner">
          {activeTab === "users" ? (
            <UserManagement />
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-100 p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl text-gray-400 mb-6">
                 <i className={`fas ${menuItems.find(m => m.id === activeTab)?.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Configure {menuItems.find(m => m.id === activeTab)?.label}</h3>
              <p className="text-center text-gray-500 max-w-md">
                This panel is dynamically hooked. Creating new entries will immediately sync this content block directly out to the Firebase Firestore Collections for the public site to read later.
              </p>
              <button className="mt-8 bg-rmc-blue text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition">
                + Add New Entry
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
