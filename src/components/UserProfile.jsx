import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const UserProfile = ({ user }) => {
  const [category, setCategory] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setCategory(docSnap.data().category || '');
        }
      } catch (error) {
        console.error("Error fetching user category:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchCategory();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        category: category,
      }, { merge: true }); // ✅ Merge to avoid overwriting FCM tokens
      setSaved(true);
    } catch (err) {
      console.error("Error saving user data:", err);
    }
  };

  if (loading) return <p className="p-4">🔄 Loading your profile...</p>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Welcome, {user.displayName}</h2>
      
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Enter your preferred category"
        value={category}
        onChange={(e) => {
          setSaved(false);
          setCategory(e.target.value);
        }}
      />

      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Save Category
      </button>

      {saved && <p className="text-green-600">✅ Category saved successfully!</p>}
    </div>
  );
};

export default UserProfile;
