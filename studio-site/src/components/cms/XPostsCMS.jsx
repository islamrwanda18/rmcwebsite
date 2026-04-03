import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function XPostsCMS() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [embedCode, setEmbedCode] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = await getDocs(collection(db, "xposts"));
      const list = [];
      q.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      list.sort((a,b) => b.createdAt - a.createdAt);
      setItems(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create new post as 'on'
      const newPost = {
        embedCode,
        status: "on",
        createdAt: Date.now()
      };
      
      const docRef = await addDoc(collection(db, "xposts"), newPost);
      
      // Check logic: Only 3 tweets can be active.
      const activePosts = items.filter(i => i.status === "on");
      // If we just added one, we now might have 4 active.
      if (activePosts.length >= 3) {
        // Find the oldest active post(s) to turn off
        const sortedActive = activePosts.sort((a,b) => b.createdAt - a.createdAt);
        // We only want the newest 2 plus our new one (total 3). So any beyond index 1 of the old array needs to be turned off.
        const offTargets = sortedActive.slice(2);
        for (const target of offTargets) {
          await updateDoc(doc(db, "xposts", target.id), { status: "off" });
        }
      }

      setShowForm(false);
      setEmbedCode("");
      fetchItems();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = item.status === "on" ? "off" : "on";
      
      if (newStatus === "on") {
        const activeCount = items.filter(i => i.status === "on").length;
        if (activeCount >= 3) {
          return alert("Maximum of 3 posts can be active at the same time. Please hide another post first.");
        }
      }

      await updateDoc(doc(db, "xposts", item.id), { status: newStatus });
      fetchItems();
    } catch (err) {
      alert("Error updating status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this X Post?")) {
      await deleteDoc(doc(db, "xposts", id));
      fetchItems();
    }
  };

  if (loading) return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i></div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Latest from X (Twitter)</h3>
          <p className="text-sm text-gray-500">Only 3 posts can be active (ON) simultaneously.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-600 transition">
            <i className="fab fa-twitter mr-2"></i> Embed New Post
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleAddSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Paste raw X/Twitter Embed Code</label>
          <textarea 
            required 
            rows="6" 
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:ring-[#1DA1F2] focus:border-[#1DA1F2]"
            placeholder={'<blockquote class="twitter-tweet">...</blockquote>'}
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
          />
          <div className="mt-4 flex space-x-3">
             <button type="submit" className="px-6 py-2 bg-[#1DA1F2] text-white font-bold rounded shadow hover:bg-blue-600 transition">Publish Embedded Post</button>
             <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded shadow hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className={`p-4 border rounded-lg flex justify-between items-center transition ${item.status === 'on' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-4 ${item.status === 'on' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div className="max-w-xl">
                 <p className="text-xs text-gray-500 font-mono line-clamp-2 truncate border border-gray-200 bg-white p-2 rounded">{item.embedCode}</p>
                 <p className="text-xs font-bold mt-2 text-gray-600">Added: {new Date(item.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleToggleStatus(item)}
                className={`px-4 py-1.5 rounded font-bold text-sm shadow-sm transition ${item.status === 'on' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
              >
                {item.status === 'on' ? 'Hide (Turn OFF)' : 'Show (Turn ON)'}
              </button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded font-bold text-sm shadow-sm transition">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-gray-500 py-6">No embedded posts found.</div>}
      </div>
    </div>
  );
}
