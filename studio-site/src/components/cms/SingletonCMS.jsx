import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function SingletonCMS({ fields, titleLabel }) {
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [fields]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "globals", "content");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const initialMap = {};
        fields.forEach(f => {
           initialMap[f.key] = data[f.key] || "";
        });
        setContentMap(initialMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "globals", "content");
      // Update all keys in the contentMap
      await setDoc(docRef, contentMap, { merge: true });
      alert("Successfully saved " + titleLabel);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i></div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in flex flex-col h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{titleLabel} Editor</h3>
      <p className="text-gray-500 text-sm mb-6">Modify the text describing the {titleLabel.toLowerCase()} below. Use ENTER/Return for new lines. Changes reflect instantly.</p>
      
      <div className="flex-1 flex flex-col space-y-6">
        {fields.map(f => (
          <div key={f.key} className="flex flex-col flex-1 min-h-[150px]">
            <label className="block text-sm font-bold text-gray-700 mb-2">{f.label}</label>
            <textarea 
              className="w-full flex-1 p-4 border border-gray-300 rounded focus:ring-rmc-green focus:border-rmc-green resize-none text-sm leading-relaxed"
              value={contentMap[f.key] || ""}
              onChange={(e) => setContentMap({...contentMap, [f.key]: e.target.value})}
              placeholder={`Enter the plain text for ${f.label} here...`}
            />
          </div>
        ))}
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-8 py-3 bg-rmc-green text-white font-bold rounded shadow-lg hover:bg-rmc-dark-green transition disabled:opacity-50"
          >
            {saving ? "Saving..." : <><i className="fas fa-save mr-2"></i> Publish Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
