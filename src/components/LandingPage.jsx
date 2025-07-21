import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import {
  FaPlusCircle,
  FaListAlt,
  FaChartPie,
  FaBars,
  FaUtensils,
  FaMoon,
  FaSun,
  FaSignOutAlt
} from 'react-icons/fa';

import AddItemPage from './AddItemForm';
import GroceryListPage from './GroceryList';
import DashboardPage from './DashboardStats';
import RecipeGeneratorPage from './RecipeGeneratorPage';

const Sidebar = ({ selected, setSelected, isOpen, toggle, darkMode, toggleDarkMode, handleLogout, userEmail }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <FaChartPie /> },
    { name: 'Add Item', icon: <FaPlusCircle /> },
    { name: 'Groceries List', icon: <FaListAlt /> },
    { name: 'Recipe Generator', icon: <FaUtensils /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b z-50
      ${darkMode ? 'from-gray-900 via-gray-800 to-gray-700' : 'from-orange-700 via-orange-600 to-orange-500'} 
      text-white shadow-lg p-6 transition-transform duration-300 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >

      {/* User Info */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-2">
          <img
            src="https://img.icons8.com/?size=100&id=21441&format=png&color=000000"
            alt= "Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm text-gray-300">{userEmail || 'guest@email.com'}</span>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setSelected(item.name);
              if (window.innerWidth < 768) toggle();
            }}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg w-full text-left transition 
              ${selected === item.name ? 'bg-white text-gray-800 font-semibold' : 'hover:bg-gray-600'}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-6 left-6 flex flex-col space-y-3">
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
        >
          <FaSignOutAlt />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

const Content = ({ selected }) => {
  switch (selected) {
    case 'Add Item':
      return <AddItemPage />;
    case 'Groceries List':
      return <GroceryListPage />;
    case 'Dashboard':
      return <DashboardPage />;
    case 'Recipe Generator':
      return <RecipeGeneratorPage />;
    default:
      return <AddItemPage />;
  }
};

export default function LandingPage({ setUser }) {
  const [selected, setSelected] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email || '');
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/login');
  };

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email || '');
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
        userEmail={userEmail}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Mobile Topbar */}
        <div className="md:hidden bg-white dark:bg-gray-800 shadow px-4 py-3 flex justify-between items-center sticky top-0 z-30">
          <button onClick={toggleSidebar} className="text-gray-800 dark:text-gray-200 text-2xl">
            <FaBars />
          </button>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{selected}</h2>
        </div>

        {/* Main Page Content */}
        <div className="flex-grow w-full h-full px-4 sm:px-6 md:px-8 py-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
          <Content selected={selected} />
        </div>
      </div>
    </div>
  );
}
