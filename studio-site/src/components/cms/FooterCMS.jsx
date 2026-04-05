import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const FOOTER_DOC = "siteConfig/footer";

// Default data matching the current hardcoded footer
const DEFAULT_FOOTER = {
  branding: {
    logoUrl: "/android-chrome-192x192.png",
    orgName: "Rwanda Muslim Community",
    description: "Serving the Muslim Community in Rwanda through education, social services, and community development."
  },
  socialLinks: [
    { name: "Twitter / X", link: "https://x.com/islamrwanda", icon: "fab fa-twitter" },
    { name: "Instagram", link: "https://www.instagram.com/islamrwandaofficial/", icon: "fab fa-instagram" },
    { name: "Facebook", link: "https://www.facebook.com/RMC.Islamrwanda/", icon: "fab fa-facebook-f" }
  ],
  quickLinks: [
    { name: "Education Platform", link: "https://rmc-brown.vercel.app/" },
    { name: "Scholarships", link: "https://rmc-brown.vercel.app/" },
    { name: "Sadaqat", link: "https://rmc-brown.vercel.app/" },
    { name: "Zakat", link: "https://rmc-brown.vercel.app/" },
    { name: "Jobs & Opportunities", link: "https://rmc-brown.vercel.app/" }
  ],
  services: [
    { name: "Educational Services", link: "https://rmc-brown.vercel.app/" },
    { name: "Marriage Facilitation", link: "https://rmc-brown.vercel.app/" },
    { name: "Funeral Services", link: "https://rmc-brown.vercel.app/" },
    { name: "Dawah Services", link: "https://rmc-brown.vercel.app/" },
    { name: "Hijrah Support", link: "https://rmc-brown.vercel.app/" },
    { name: "Scholarship Programs", link: "https://rmc-brown.vercel.app/" }
  ],
  contactInfo: {
    location: "Kigali, Rwanda",
    hq: "RMC Headquarters",
    email: "islamrwanda18@gmail.com",
    phone: "+250 788 565 998"
  }
};

export default function FooterCMS() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("socialLinks");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addingNew, setAddingNew] = useState(false);
  const [newItemForm, setNewItemForm] = useState({});

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "siteConfig", "footer");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFooterData(docSnap.data());
      } else {
        // Initialize with defaults
        setFooterData(DEFAULT_FOOTER);
      }
    } catch (err) {
      console.error("Error fetching footer data:", err);
      setFooterData(DEFAULT_FOOTER);
    } finally {
      setLoading(false);
    }
  };

  const saveFooterData = async (updatedData) => {
    setSaving(true);
    try {
      const docRef = doc(db, "siteConfig", "footer");
      await setDoc(docRef, updatedData);
      setFooterData(updatedData);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---- List item operations (socialLinks, quickLinks, services) ----
  const startEdit = (index) => {
    const section = footerData[activeSection];
    setEditingIndex(index);
    setEditForm({ ...section[index] });
    setAddingNew(false);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    const updated = { ...footerData };
    updated[activeSection] = [...updated[activeSection]];
    updated[activeSection][editingIndex] = { ...editForm };
    await saveFooterData(updated);
    setEditingIndex(null);
    setEditForm({});
  };

  const startAdd = () => {
    setAddingNew(true);
    setEditingIndex(null);
    if (activeSection === "socialLinks") {
      setNewItemForm({ name: "", link: "", icon: "fab fa-link" });
    } else {
      setNewItemForm({ name: "", link: "" });
    }
  };

  const cancelAdd = () => {
    setAddingNew(false);
    setNewItemForm({});
  };

  const saveNewItem = async () => {
    if (!newItemForm.name || !newItemForm.link) {
      alert("Please fill in both Name and Link.");
      return;
    }
    const updated = { ...footerData };
    updated[activeSection] = [...updated[activeSection], { ...newItemForm }];
    await saveFooterData(updated);
    setAddingNew(false);
    setNewItemForm({});
  };

  const deleteItem = async (index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const updated = { ...footerData };
    updated[activeSection] = updated[activeSection].filter((_, i) => i !== index);
    await saveFooterData(updated);
  };

  // ---- Contact Info operations ----
  const [editingContact, setEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({});

  const startEditContact = () => {
    setContactForm({ ...footerData.contactInfo });
    setEditingContact(true);
  };

  const saveContact = async () => {
    const updated = { ...footerData, contactInfo: { ...contactForm } };
    await saveFooterData(updated);
    setEditingContact(false);
  };

  // ---- Branding operations ----
  const [editingBranding, setEditingBranding] = useState(false);
  const [brandingForm, setBrandingForm] = useState({});

  const startEditBranding = () => {
    setBrandingForm({ ...(footerData.branding || DEFAULT_FOOTER.branding) });
    setEditingBranding(true);
  };

  const saveBranding = async () => {
    const updated = { ...footerData, branding: { ...brandingForm } };
    await saveFooterData(updated);
    setEditingBranding(false);
  };

  // ---- Rendering ----
  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl"></i></div>;

  const sections = [
    { id: "branding", label: "Branding", icon: "fa-palette" },
    { id: "socialLinks", label: "Social Links", icon: "fa-share-alt" },
    { id: "quickLinks", label: "Quick Links", icon: "fa-link" },
    { id: "services", label: "Services", icon: "fa-concierge-bell" },
    { id: "contactInfo", label: "Contact Info", icon: "fa-address-card" }
  ];

  const isListSection = activeSection !== "contactInfo" && activeSection !== "branding";
  const currentList = isListSection ? (footerData[activeSection] || []) : [];

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Footer Configuration</h3>
        {saving && <span className="text-sm text-rmc-green font-semibold"><i className="fas fa-spinner fa-spin mr-1"></i>Saving...</span>}
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => { setActiveSection(sec.id); cancelEdit(); cancelAdd(); setEditingContact(false); setEditingBranding(false); }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center ${
              activeSection === sec.id 
                ? "bg-rmc-green text-white shadow" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <i className={`fas ${sec.icon} mr-2`}></i>{sec.label}
          </button>
        ))}
      </div>

      {/* List Sections (Social Links, Quick Links, Services) */}
      {isListSection && (
        <div>
          {/* Add New Button */}
          {!addingNew && editingIndex === null && (
            <div className="mb-4 text-right">
              <button onClick={startAdd} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition text-sm">
                <i className="fas fa-plus mr-1"></i> Add New
              </button>
            </div>
          )}

          {/* Add New Form */}
          {addingNew && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-blue-800 mb-3"><i className="fas fa-plus-circle mr-1"></i> Add New Item</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={newItemForm.name || ""} onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Link (URL)</label>
                  <input type="url" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={newItemForm.link || ""} onChange={(e) => setNewItemForm({ ...newItemForm, link: e.target.value })} />
                </div>
                {activeSection === "socialLinks" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Icon Class (FontAwesome)</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={newItemForm.icon || ""} onChange={(e) => setNewItemForm({ ...newItemForm, icon: e.target.value })} placeholder="e.g. fab fa-youtube" />
                  </div>
                )}
              </div>
              <div className="mt-3 flex space-x-2">
                <button onClick={saveNewItem} className="px-4 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition text-sm">Save</button>
                <button onClick={cancelAdd} className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition text-sm">Cancel</button>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  {activeSection === "socialLinks" && <th className="p-3 border-b">Icon</th>}
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Link</th>
                  <th className="p-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    {editingIndex === idx ? (
                      <>
                        {activeSection === "socialLinks" && (
                          <td className="p-3">
                            <input type="text" className="w-full p-1.5 border border-gray-300 rounded text-sm" value={editForm.icon || ""} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} />
                          </td>
                        )}
                        <td className="p-3">
                          <input type="text" className="w-full p-1.5 border border-gray-300 rounded text-sm" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </td>
                        <td className="p-3">
                          <input type="url" className="w-full p-1.5 border border-gray-300 rounded text-sm" value={editForm.link || ""} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} />
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-800 mr-3 font-semibold text-sm"><i className="fas fa-check mr-1"></i>Save</button>
                          <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 font-semibold text-sm"><i className="fas fa-times mr-1"></i>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        {activeSection === "socialLinks" && (
                          <td className="p-3"><i className={`${item.icon} text-lg text-gray-600`}></i></td>
                        )}
                        <td className="p-3 font-medium text-gray-800">{item.name}</td>
                        <td className="p-3 text-sm text-blue-600 truncate max-w-xs">
                          <a href={item.link} target="_blank" rel="noreferrer" className="hover:underline">{item.link}</a>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button onClick={() => startEdit(idx)} className="text-blue-500 hover:text-blue-700 mr-3 font-semibold text-sm"><i className="fas fa-edit mr-1"></i>Edit</button>
                          <button onClick={() => deleteItem(idx)} className="text-red-500 hover:text-red-700 font-semibold text-sm"><i className="fas fa-trash mr-1"></i>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {currentList.length === 0 && (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">No items found. Add one above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Branding Section */}
      {activeSection === "branding" && (
        <div>
          {editingBranding ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 border-b pb-2">Edit Footer Branding</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL (Direct Image Link)</label>
                  <input type="url" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={brandingForm.logoUrl || ""} onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })} placeholder="e.g. /android-chrome-192x192.png" />
                  {brandingForm.logoUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <img src={brandingForm.logoUrl} alt="Logo Preview" className="h-16 w-16 rounded-full border-2 border-gray-300 object-cover bg-gray-100" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Organization Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={brandingForm.orgName || ""} onChange={(e) => setBrandingForm({ ...brandingForm, orgName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Footer Description</label>
                  <textarea rows="3" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green resize-none" value={brandingForm.description || ""} onChange={(e) => setBrandingForm({ ...brandingForm, description: e.target.value })} />
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button onClick={saveBranding} className="px-6 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition">Save</button>
                <button onClick={() => setEditingBranding(false)} className="px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-gray-800">Footer Branding</h4>
                <button onClick={startEditBranding} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition text-sm">
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
              </div>
              <div className="flex items-center space-x-5">
                <img src={footerData.branding?.logoUrl || DEFAULT_FOOTER.branding.logoUrl} alt="Footer Logo" className="h-16 w-16 rounded-full border-2 border-gray-300 object-cover bg-gray-100" />
                <div>
                  <p className="font-bold text-gray-800 text-lg">{footerData.branding?.orgName || DEFAULT_FOOTER.branding.orgName}</p>
                  <p className="text-sm text-gray-500 mt-1 max-w-md">{footerData.branding?.description || DEFAULT_FOOTER.branding.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Info Section */}
      {activeSection === "contactInfo" && (
        <div>
          {editingContact ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 border-b pb-2">Edit Contact Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={contactForm.location || ""} onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Headquarters</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={contactForm.hq || ""} onChange={(e) => setContactForm({ ...contactForm, hq: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={contactForm.email || ""} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green" value={contactForm.phone || ""} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button onClick={saveContact} className="px-6 py-2 bg-rmc-green text-white font-bold rounded shadow hover:bg-rmc-dark-green transition">Save</button>
                <button onClick={() => setEditingContact(false)} className="px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-gray-800">Current Contact Info</h4>
                <button onClick={startEditContact} className="bg-rmc-blue text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition text-sm">
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-rmc-green"></i>
                  <div>
                    <span className="font-medium text-gray-800">Location:</span>
                    <span className="ml-2 text-gray-600">{footerData.contactInfo?.location}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-building mt-1 mr-3 text-rmc-green"></i>
                  <div>
                    <span className="font-medium text-gray-800">HQ:</span>
                    <span className="ml-2 text-gray-600">{footerData.contactInfo?.hq}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-3 text-rmc-green"></i>
                  <div>
                    <span className="font-medium text-gray-800">Email:</span>
                    <span className="ml-2 text-gray-600">{footerData.contactInfo?.email}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-phone-alt mt-1 mr-3 text-rmc-green"></i>
                  <div>
                    <span className="font-medium text-gray-800">Phone:</span>
                    <span className="ml-2 text-gray-600">{footerData.contactInfo?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
