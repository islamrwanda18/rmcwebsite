import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function NewsCMS() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ type: "news" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = await getDocs(collection(db, "news"));
      const list = [];
      q.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      list.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0));
      setItems(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "desc") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 50 && value.trim() !== "") return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "news", editingId), formData);
      } else {
        await addDoc(collection(db, "news"), { ...formData, createdAt: Date.now() });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ type: "news" });
      fetchItems();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this item?")) {
      await deleteDoc(doc(db, "news", id));
      fetchItems();
    }
  };

  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i></div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">News & Events Database</h3>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setFormData({ type: "news" }); setEditingId(null); }} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition">
            + Add New Entry
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <select name="type" required value={formData.type} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green">
                <option value="news">News Record</option>
                <option value="event">Upcoming Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input type="date" name="date" required value={formData.date || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
               <input type="text" name="title" required value={formData.title || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail Link (Direct Image URL)</label>
               <input type="url" name="imageLink" required value={formData.imageLink || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Drive Link for PDF file (Required for News)</label>
               <input type="url" name="driveLink" required={formData.type === "news"} value={formData.driveLink || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Max 50 Words)</label>
               <textarea rows="4" name="desc" required value={formData.desc || ""} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green" />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
             <button type="submit" className="px-6 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition">Save Entry</button>
             <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3 border-b">Preview</th>
                <th className="p-3 border-b">Details</th>
                <th className="p-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img src={item.imageLink || ""} alt="Thumb" className="w-16 h-16 object-cover rounded bg-gray-200" />
                  </td>
                  <td className="p-3">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.type==='event' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>{item.type}</span>
                     <h4 className="font-bold text-gray-800 mt-1">{item.title}</h4>
                     <p className="text-xs text-gray-500 font-bold mt-1"><i className="fas fa-calendar mr-1"></i> {item.date}</p>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 mr-4 font-semibold"><i className="fas fa-edit mr-1"></i>Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-semibold"><i className="fas fa-trash mr-1"></i>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
