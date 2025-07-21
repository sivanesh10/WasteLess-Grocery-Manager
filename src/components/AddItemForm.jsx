import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { auth, db } from './firebase';

const AddItemForm = () => {
  const [item, setItem] = useState({ name: '', quantity: '', expiryDate: '' });
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([
    'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Snacks', 'Beverages', 'Others'
  ]);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const userRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setCategory(docSnap.data().category || '');
      }
    };
    fetchCategory();
  }, []);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return alert("⚠️ You must be logged in.");
    if (!category) return alert("⚠️ Please select a category first.");

    const groceryData = {
      ...item,
      category,
      quantity: Number(item.quantity),
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "groceries"), groceryData);
      setItem({ name: '', quantity: '', expiryDate: '' });
      toast.success("✅ Item added!");
    } catch (err) {
      toast.error("❌ Failed to add item.");
      console.error(err.message);
    }
  };

  const handleCustomCategory = () => {
    if (!customCategory.trim()) return toast.error('Enter a category name.');
    if (categories.includes(customCategory)) {
      setCategory(customCategory);
      setShowCustomInput(false);
      setCustomCategory('');
      return;
    }
    setCategories((prev) => [...prev, customCategory]);
    setCategory(customCategory);
    setShowCustomInput(false);
    setCustomCategory('');
    toast.success(`➕ "${customCategory}" added`);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start px-4 py-8 sm:py-12 bg-orange-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-orange-600 dark:text-orange-400">Add Item</h2>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border font-medium transition ${
                category === cat
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-300 border-orange-400 hover:bg-orange-100 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowCustomInput((prev) => !prev)}
            className="px-4 py-2 rounded-full border border-dashed border-orange-500 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-gray-600 transition"
          >
            + Add Custom
          </button>
        </div>

        {/* Custom Category Input */}
        {showCustomInput && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="flex-grow px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={handleCustomCategory}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        )}

        {/* Add Item Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Item Name"
            value={item.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-200"
            required
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={item.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-200"
            required
          />
          <input
            name="expiryDate"
            type="date"
            value={item.expiryDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-200"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            ➕ Add Manually
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
