import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { getToken } from 'firebase/messaging';
import { messaging, db, auth } from './components/firebase';
import { doc, setDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const saveToken = async () => {
      if (!auth.currentUser) return;

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey:
            'BO2AeypU-5hcl5c504PhAOkGX2ROwy6vZPQqMikQqq-eTe12C9tohlVcp7yFDXNHLyWqA0xt_v_dSL47ju_r6rQ'
        });
        if (token) {
          await setDoc(
            doc(db, 'users', auth.currentUser.uid),
            { fcmToken: token },
            { merge: true }
          );
        }
      }
    };

    if (user) saveToken();
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <LandingPage setUser={setUser} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
