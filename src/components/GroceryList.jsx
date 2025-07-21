import { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import DownloadCSV from './DownloadCSV';

const GroceryList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'groceries'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(list);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'groceries', id));
    } catch (err) {
      console.error("❌ Failed to delete:", err.message);
      alert("Error deleting item.");
    }
  };

  const getStatusColor = (expiryDate) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    const diff = (exp - today) / (1000 * 3600 * 24);

    if (diff < 0) return 'bg-red-100 border-red-300';       
    if (diff <= 2) return 'bg-yellow-100 border-yellow-300'; 
    return 'bg-green-100 border-green-300';                  
  };

  return (
    <div className="mt-6 w-full max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">
        🛒 Your Groceries
      </h2>

      {items.length === 0 && (
        <p className="text-gray-500 text-center">No items found.</p>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border shadow-sm ${getStatusColor(item.expiryDate)} transition-all`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="text-sm text-gray-600">Expiry: {item.expiryDate}</p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-sm text-red-600 hover:underline hover:text-red-800 transition"
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <DownloadCSV/>
    </div>
  );
};

export default GroceryList;
