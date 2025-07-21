// sr
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';

const DownloadCSV = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchGroceries = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "groceries"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => doc.data());
      setItems(data);
    };

    fetchGroceries();
  }, []);

  const convertToCSV = (data) => {
    const headers = ["Name", "Quantity", "Category", "Expiry Date"];
    const rows = data.map(item =>
      [item.name, item.quantity, item.category, item.expiryDate]
    );
    return [headers, ...rows].map(e => e.join(",")).join("\n");
  };

  const downloadCSV = () => {
    const csv = convertToCSV(items);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "grocery_list.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={downloadCSV}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        📥 Download Grocery List (CSV)
      </button>
    </div>
  );
};

export default DownloadCSV;
