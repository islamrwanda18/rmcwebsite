import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function SocialsCMS() {
  const [embeds, setEmbeds] = useState({ xEmbed: "", youtubeLink: "", facebookEmbed: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "socials", "accounts");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmbeds({
          xEmbed: data.xEmbed || "",
          youtubeLink: data.youtubeLink || "",
          facebookEmbed: data.facebookEmbed || ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, "socials", "accounts");
      await setDoc(docRef, embeds, { merge: true });
      alert("Social Accounts successfully updated.");
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i></div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Latest from Social Accounts</h3>
      <p className="text-sm text-gray-500 mb-6">Update the embed codes or links for the 3 distinct blocks displayed on the Home Page.</p>

      <form onSubmit={handleSave} className="space-y-6 flex-1 flex flex-col">
        {/* X (Twitter) Block */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap"><i className="fab fa-twitter text-blue-400 mr-2"></i> X (Twitter) Embed Code</label>
          <textarea 
            rows="4" 
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:ring-[#1DA1F2] focus:border-[#1DA1F2]"
            placeholder={'<blockquote class="twitter-tweet">...</blockquote>'}
            value={embeds.xEmbed}
            onChange={(e) => setEmbeds({...embeds, xEmbed: e.target.value})}
          />
        </div>

        {/* YouTube Block */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap"><i className="fab fa-youtube text-red-600 mr-2"></i> YouTube Watch Link</label>
          <input 
            type="text"
            className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-red-500 focus:border-red-500"
            placeholder="https://www.youtube.com/watch?v=..."
            value={embeds.youtubeLink}
            onChange={(e) => setEmbeds({...embeds, youtubeLink: e.target.value})}
          />
        </div>

        {/* Facebook Block */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap"><i className="fab fa-facebook text-blue-600 mr-2"></i> Facebook Embed Code</label>
          <textarea 
            rows="4" 
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:ring-blue-600 focus:border-blue-600"
            placeholder={'<iframe src="https://www.facebook.com/plugins/video.php?href=..." ...></iframe>'}
            value={embeds.facebookEmbed}
            onChange={(e) => setEmbeds({...embeds, facebookEmbed: e.target.value})}
          />
        </div>

        <div className="mt-6 flex justify-end">
           <button type="submit" disabled={saving} className="px-8 py-3 bg-rmc-green text-white font-bold rounded shadow-lg hover:bg-rmc-dark-green transition disabled:opacity-50">
           {saving ? "Saving..." : <><i className="fas fa-save mr-2"></i> Update Social Blocks</>}
           </button>
        </div>
      </form>
    </div>
  );
}
