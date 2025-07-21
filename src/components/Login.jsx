import { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';

const Login = ({ setUser }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsNewUser(!isNewUser);
    setError('');
  };

  const handleEmailAuth = async () => {
    try {
      const userCredential = isNewUser
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        {isNewUser ? 'Create Account' : 'Welcome Back'}
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleEmailAuth}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {isNewUser ? 'Sign Up' : 'Login'}
        </button>

        <div className="flex items-center justify-center my-2 text-gray-500 text-sm">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
        >
          Continue with Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-700">
          {isNewUser ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={toggleMode} className="text-blue-600 font-semibold hover:underline">
            {isNewUser ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
