import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function BasicCMS({ collectionName, fields, titleLabel }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = await getDocs(collection(db, collectionName));
      const list = [];
      q.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setItems(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    const val = e.target.value;
    if (field.type === "textarea" && field.wordLimit) {
      const wordCount = val.trim().split(/\s+/).length;
      if (wordCount > field.wordLimit && val.trim() !== "") {
        return; // prevent typing beyond word limit roughly
      }
    }
    setFormData({ ...formData, [field.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), formData);
      } else {
        await addDoc(collection(db, collectionName), { ...formData, createdAt: Date.now() });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({});
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
      await deleteDoc(doc(db, collectionName, id));
      fetchItems();
    }
  };

  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i></div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">{titleLabel} Database</h3>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setFormData({}); setEditingId(null); }} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition">
            + Add New {titleLabel}
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h4 className="font-bold text-lg mb-4 border-b pb-2">{editingId ? "Edit" : "Create"} {titleLabel}</h4>
          <div className="grid grid-cols-1 gap-4">
            {fields.map(f => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                {f.type === "textarea" ? (
                  <>
                    <textarea 
                      required={!f.optional}
                      rows="4" 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green"
                      value={formData[f.name] || ""}
                      onChange={(e) => handleInputChange(e, f)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum ~{f.wordLimit} words allowed.</p>
                  </>
                ) : (
                  <input 
                    type={f.type || "text"} 
                    required={!f.optional}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green"
                    value={formData[f.name] || ""}
                    onChange={(e) => handleInputChange(e, f)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex space-x-3">
             <button type="submit" className="px-6 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition">Save</button>
             <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3 border-b">Preview</th>
                <th className="p-3 border-b">Information</th>
                <th className="p-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const imgLink = item.imageLink || item.logoLink;
                const param1 = item.title || item.name;
                const param2 = item.desc || item.sector;
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {imgLink ? (
                        <img src={imgLink} alt="Thumb" className="w-16 h-16 object-cover rounded bg-gray-200" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">No Img</div>
                      )}
                    </td>
                    <td className="p-3">
                       <h4 className="font-bold text-gray-800">{param1}</h4>
                       <p className="text-sm text-gray-500 line-clamp-2 max-w-sm">{param2}</p>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 mr-4 font-semibold"><i className="fas fa-edit mr-1"></i>Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-semibold"><i className="fas fa-trash mr-1"></i>Delete</button>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && <tr><td colSpan="3" className="p-6 text-center text-gray-500">No {titleLabel}s found. Add one above.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
