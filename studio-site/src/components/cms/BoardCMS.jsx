import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function BoardCMS() {
  const { userData } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const isMasterAdmin = userData?.email === "islamrwanda18@gmail.com";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = await getDocs(collection(db, "board"));
      const list = [];
      q.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setItems(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMasterAdmin) return alert("Unauthorized.");
    try {
      if (editingId) {
        await updateDoc(doc(db, "board", editingId), formData);
      } else {
        await addDoc(collection(db, "board"), formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({});
      fetchItems();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!isMasterAdmin) return alert("Unauthorized.");
    if (window.confirm("Delete this board member?")) {
      await deleteDoc(doc(db, "board", id));
      fetchItems();
    }
  };

  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i></div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Board Members Database</h3>
          <p className="text-sm text-gray-500">Only islamrwanda18@gmail.com can manage these records.</p>
        </div>
        {isMasterAdmin && !showForm && (
          <button onClick={() => { setShowForm(true); setFormData({}); setEditingId(null); }} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition">
            + Add New Member
          </button>
        )}
      </div>

      {!isMasterAdmin && (
         <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-semibold border border-red-200">
           <i className="fas fa-lock mr-2"></i> You do not have permission to modify this collection. Contact the master administrator.
         </div>
      )}

      {showForm && isMasterAdmin ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
               <input type="text" name="name" required value={formData.name || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
               <input type="text" name="role" required value={formData.role || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Image Link (Direct URL)</label>
               <input type="url" name="imageLink" required value={formData.imageLink || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
             <button type="submit" className="px-6 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition">Save Member</button>
             <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center bg-gray-50">
              <img src={item.imageLink || ""} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow mb-3" />
              <h4 className="font-bold text-gray-900">{item.name}</h4>
              <p className="text-sm text-rmc-green font-semibold mb-4">{item.role}</p>
              
              {isMasterAdmin && (
                <div className="w-full flex border-t border-gray-200 pt-3">
                  <button onClick={() => { setFormData(item); setEditingId(item.id); setShowForm(true); }} className="flex-1 text-blue-500 hover:text-blue-700 text-sm font-bold border-r border-gray-200">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
