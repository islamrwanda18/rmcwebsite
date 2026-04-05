import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DEFAULT_HEADER = {
  navLinks: [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Programs", path: "/program" },
    { name: "News", path: "/news" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" }
  ],
  logoUrl: "/android-chrome-192x192.png",
  orgName: "RMC",
  orgSubtitle: "Rwanda Muslim Community"
};

export default function HeaderCMS() {
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addingNew, setAddingNew] = useState(false);
  const [newItemForm, setNewItemForm] = useState({ name: "", path: "" });
  const [editingBranding, setEditingBranding] = useState(false);
  const [brandingForm, setBrandingForm] = useState({});

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const fetchHeaderData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "siteConfig", "header");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHeaderData(docSnap.data());
      } else {
        setHeaderData(DEFAULT_HEADER);
      }
    } catch (err) {
      console.error("Error fetching header data:", err);
      setHeaderData(DEFAULT_HEADER);
    } finally {
      setLoading(false);
    }
  };

  const saveHeaderData = async (updatedData) => {
    setSaving(true);
    try {
      const docRef = doc(db, "siteConfig", "header");
      await setDoc(docRef, updatedData);
      setHeaderData(updatedData);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditForm({ ...headerData.navLinks[index] });
    setAddingNew(false);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    const updated = { ...headerData };
    updated.navLinks = [...updated.navLinks];
    updated.navLinks[editingIndex] = { ...editForm };
    await saveHeaderData(updated);
    setEditingIndex(null);
    setEditForm({});
  };

  const startAdd = () => {
    setAddingNew(true);
    setEditingIndex(null);
    setNewItemForm({ name: "", path: "" });
  };

  const cancelAdd = () => {
    setAddingNew(false);
    setNewItemForm({});
  };

  const saveNewItem = async () => {
    if (!newItemForm.name || !newItemForm.path) {
      alert("Please fill in both Name and Path.");
      return;
    }
    const updated = { ...headerData };
    updated.navLinks = [...updated.navLinks, { ...newItemForm }];
    await saveHeaderData(updated);
    setAddingNew(false);
    setNewItemForm({});
  };

  const deleteItem = async (index) => {
    if (!window.confirm("Are you sure you want to delete this nav link?")) return;
    const updated = { ...headerData };
    updated.navLinks = updated.navLinks.filter((_, i) => i !== index);
    await saveHeaderData(updated);
  };

  const moveItem = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= headerData.navLinks.length) return;
    const updated = { ...headerData };
    const links = [...updated.navLinks];
    [links[index], links[newIndex]] = [links[newIndex], links[index]];
    updated.navLinks = links;
    await saveHeaderData(updated);
  };

  // Branding
  const startEditBranding = () => {
    setBrandingForm({
      logoUrl: headerData.logoUrl || "",
      orgName: headerData.orgName || "",
      orgSubtitle: headerData.orgSubtitle || ""
    });
    setEditingBranding(true);
  };

  const saveBranding = async () => {
    const updated = { ...headerData, ...brandingForm };
    await saveHeaderData(updated);
    setEditingBranding(false);
  };

  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl"></i></div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Header / Navigation Configuration</h3>
        {saving && <span className="text-sm text-rmc-green font-semibold"><i className="fas fa-spinner fa-spin mr-1"></i>Saving...</span>}
      </div>

      {/* Branding Section */}
      <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg text-gray-800"><i className="fas fa-palette mr-2 text-rmc-green"></i>Branding</h4>
          {!editingBranding && (
            <button onClick={startEditBranding} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition text-sm">
              <i className="fas fa-edit mr-1"></i> Edit
            </button>
          )}
        </div>
        {editingBranding ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
                <input type="url" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={brandingForm.logoUrl} onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Org Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={brandingForm.orgName} onChange={(e) => setBrandingForm({ ...brandingForm, orgName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={brandingForm.orgSubtitle} onChange={(e) => setBrandingForm({ ...brandingForm, orgSubtitle: e.target.value })} />
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button onClick={saveBranding} className="px-4 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition text-sm">Save</button>
              <button onClick={() => setEditingBranding(false)} className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <img src={headerData.logoUrl} alt="Logo" className="h-12 w-12 rounded-full border border-gray-300 object-cover" />
            <div>
              <p className="font-bold text-gray-800">{headerData.orgName}</p>
              <p className="text-sm text-gray-500">{headerData.orgSubtitle}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links Section */}
      <div className="mb-4 flex justify-between items-center">
        <h4 className="font-bold text-lg text-gray-800"><i className="fas fa-bars mr-2 text-rmc-green"></i>Navigation Links</h4>
        {!addingNew && editingIndex === null && (
          <button onClick={startAdd} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition text-sm">
            <i className="fas fa-plus mr-1"></i> Add Link
          </button>
        )}
      </div>

      {/* Add New Form */}
      {addingNew && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-blue-800 mb-3"><i className="fas fa-plus-circle mr-1"></i> Add Navigation Link</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={newItemForm.name} onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })} placeholder="e.g. Gallery" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Path</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={newItemForm.path} onChange={(e) => setNewItemForm({ ...newItemForm, path: e.target.value })} placeholder="e.g. /gallery" />
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <button onClick={saveNewItem} className="px-4 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition text-sm">Save</button>
            <button onClick={cancelAdd} className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Nav Links Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-3 border-b w-12">#</th>
              <th className="p-3 border-b">Display Name</th>
              <th className="p-3 border-b">Path</th>
              <th className="p-3 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(headerData.navLinks || []).map((link, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {editingIndex === idx ? (
                  <>
                    <td className="p-3 text-gray-400 font-mono text-sm">{idx + 1}</td>
                    <td className="p-3">
                      <input type="text" className="w-full p-1.5 border border-gray-300 rounded text-sm" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    </td>
                    <td className="p-3">
                      <input type="text" className="w-full p-1.5 border border-gray-300 rounded text-sm" value={editForm.path || ""} onChange={(e) => setEditForm({ ...editForm, path: e.target.value })} />
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button onClick={saveEdit} className="text-green-600 hover:text-green-800 mr-3 font-semibold text-sm"><i className="fas fa-check mr-1"></i>Save</button>
                      <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 font-semibold text-sm"><i className="fas fa-times mr-1"></i>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 text-gray-400 font-mono text-sm">{idx + 1}</td>
                    <td className="p-3 font-medium text-gray-800">{link.name}</td>
                    <td className="p-3 text-sm text-blue-600 font-mono">{link.path}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className={`mr-2 text-sm ${idx === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}><i className="fas fa-arrow-up"></i></button>
                      <button onClick={() => moveItem(idx, 1)} disabled={idx === headerData.navLinks.length - 1} className={`mr-3 text-sm ${idx === headerData.navLinks.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}><i className="fas fa-arrow-down"></i></button>
                      <button onClick={() => startEdit(idx)} className="text-blue-500 hover:text-blue-700 mr-3 font-semibold text-sm"><i className="fas fa-edit mr-1"></i>Edit</button>
                      <button onClick={() => deleteItem(idx)} className="text-red-500 hover:text-red-700 font-semibold text-sm"><i className="fas fa-trash mr-1"></i>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {(!headerData.navLinks || headerData.navLinks.length === 0) && (
              <tr><td colSpan="4" className="p-6 text-center text-gray-500">No navigation links. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
