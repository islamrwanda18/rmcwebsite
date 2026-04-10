import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import UserManagement from "../components/UserManagement";
import BasicCMS from "../components/cms/BasicCMS";
import NewsCMS from "../components/cms/NewsCMS";
import BoardCMS from "../components/cms/BoardCMS";
import SingletonCMS from "../components/cms/SingletonCMS";
import SocialsCMS from "../components/cms/SocialsCMS";
import FooterCMS from "../components/cms/FooterCMS";
import HeaderCMS from "../components/cms/HeaderCMS";
import StatisticsCMS from "../components/cms/StatisticsCMS";

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
    { id: "statistics", label: "Statistics", icon: "fa-chart-bar" },
    { id: "socials", label: "Social Accounts", icon: "fa-hashtag" }
  ];

  if (userData?.email === "islamrwanda18@gmail.com") {
    menuItems.push(
      { id: "footer", label: "Edit Footer", icon: "fa-shoe-prints" },
      { id: "header", label: "Edit Header", icon: "fa-heading" },
      { id: "users", label: "Manage Users", icon: "fa-user-shield" }
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 fade-in">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-rmc-dark-green text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700 flex items-center">
            <img src="/admin/android-chrome-192x192.png" alt="RMC Logo" className="h-10 w-10 mr-3 rounded-full bg-white p-0.5" />
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
          {activeTab === "users" && <UserManagement />}
          
          {activeTab === "services" && (
            <BasicCMS collectionName="services" titleLabel="Services" fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "imageLink", label: "Thumbnail Link (Direct Image URL)", type: "url", optional: true },
              { name: "desc", label: "Description", type: "textarea", wordLimit: 50 },
              { name: "icon", label: "FontAwesome Icon Class (Fallback)", type: "text", optional: true }
            ]} />
          )}

          {activeTab === "programs" && (
            <BasicCMS collectionName="programs" titleLabel="Programs" fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "imageLink", label: "Thumbnail Link (Direct Image URL)", type: "url", optional: true },
              { name: "desc", label: "Description", type: "textarea", wordLimit: 50 },
              { name: "icon", label: "FontAwesome Icon Class (Fallback)", type: "text", optional: true }
            ]} />
          )}

          {activeTab === "news" && <NewsCMS />}
          
          {activeTab === "board" && <BoardCMS />}

          {activeTab === "partners" && (
            <BasicCMS collectionName="partners" titleLabel="Partners" fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "logoLink", label: "Logo Image Link (Direct URL)", type: "url" },
              { name: "sector", label: "Sector", type: "text" }
            ]} />
          )}

          {activeTab === "mission" && <SingletonCMS titleLabel="Mission and Vision" fields={[
            { key: "mission", label: "Mission Statement" },
            { key: "vision", label: "Vision Statement" }
          ]} />}
          
          {activeTab === "history" && <SingletonCMS titleLabel="History" fields={[
            { key: "history", label: "RMC History" }
          ]} />}

          {activeTab === "socials" && <SocialsCMS />}

          {activeTab === "footer" && <FooterCMS />}
          {activeTab === "header" && <HeaderCMS />}
          {activeTab === "statistics" && <StatisticsCMS />}
        </main>
      </div>

    </div>
  );
}
