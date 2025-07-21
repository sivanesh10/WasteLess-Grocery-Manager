import { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { db, auth } from './firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// Animated number component
const AnimatedNumber = ({ number }) => {
  const { value } = useSpring({
    from: { value: 0 },
    to: { value: number },
    config: { duration: 800 },
  });

  return (
    <animated.h3 className="text-5xl font-extrabold">
      {value.to((val) => Math.floor(val))}
    </animated.h3>
  );
};

const DashboardStats = () => {
  const [stats, setStats] = useState({ total: 0, expiringSoon: 0, expired: 0 });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'groceries'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data());
      const today = new Date();
      let expiringSoon = 0;
      let expired = 0;

      items.forEach((item) => {
        const expDate = new Date(item.expiryDate);
        const diff = (expDate - today) / (1000 * 3600 * 24);
        if (diff < 0) expired++;
        else if (diff <= 2) expiringSoon++;
      });

      setStats({
        total: items.length,
        expiringSoon,
        expired,
      });
    });

    return () => unsubscribe();
  }, []);

  // Improved card style
  const cardStyle =
    'flex-1 min-w-[220px] max-w-sm flex flex-col justify-center items-center rounded-2xl p-6 text-white shadow-xl transition duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl';

  return (
    <div className="w-full px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-10">
        📊 Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {/* Total Items */}
        <div className={`${cardStyle} bg-gradient-to-br from-blue-500 to-indigo-600`}>
          <p className="text-lg font-medium mb-2">📦 Total Items</p>
          <AnimatedNumber number={stats.total} />
        </div>

        {/* Expiring Soon */}
        <div className={`${cardStyle} bg-gradient-to-br from-yellow-400 to-amber-500`}>
          <p className="text-lg font-medium mb-2">⏳ Expiring Soon</p>
          <AnimatedNumber number={stats.expiringSoon} />
        </div>

        {/* Expired Items */}
        <div className={`${cardStyle} bg-gradient-to-br from-rose-500 to-pink-600`}>
          <p className="text-lg font-medium mb-2">❌ Expired Items</p>
          <AnimatedNumber number={stats.expired} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
