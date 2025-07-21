import { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import axios from 'axios';
import { collection, query, where, getDocs } from 'firebase/firestore';

const RecipeGeneratorPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expiredStatus, setExpiredStatus] = useState(''); // To store message for expired/all empty

  useEffect(() => {
    const fetchIngredients = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'groceries'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data());

      if (!items.length) {
        setExpiredStatus('Your groceries list is empty.');
        setIngredients([]);
        return;
      }

      const today = new Date();
      const validItems = items
        .filter(item => new Date(item.expiryDate) >= today) // Keep only non-expired
        .map(item => item.name);

      if (validItems.length === 0) {
        setExpiredStatus('All Items in Your Groceries were Expired.');
        setIngredients([]);
      } else {
        setExpiredStatus('');
        setIngredients(validItems);
      }
    };

    fetchIngredients();
  }, []);

  const getRecipes = async () => {
    if (!ingredients.length) {
      alert(expiredStatus || 'No ingredients found.');
      return;
    }
    setLoading(true);

    const queryParams = new URLSearchParams({
      ingredients: ingredients.join(','),
      number: 10,
      apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY
    });

    try {
      const res = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?${queryParams}`
      );
      const detailed = await Promise.all(
        res.data.map(recipe =>
          axios.get(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`
          )
        )
      );
      setRecipes(detailed.map(r => r.data));
    } catch (err) {
      console.error('❌ Recipe fetch error:', err);
      alert('❌ Failed to fetch recipes. Check API key or quota.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto p-6 min-h-screen space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-700 text-center">
          🍽️ Recipes from Your Groceries
        </h2>

        {/* Expired/Empty Status */}
        {expiredStatus && (
          <p className="text-center text-red-500 font-semibold">
            {expiredStatus}
          </p>
        )}

        {/* Generate Recipes Button */}
        {!expiredStatus && (
          <div className="flex justify-center">
            <button
              onClick={getRecipes}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Generate Recipes
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {recipe.title}
                  </h3>
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 mt-2 underline font-medium hover:text-orange-800"
                  >
                    View Full Recipe →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !expiredStatus && (
            <p className="text-center text-gray-600 mt-8">
              No recipes generated yet.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeGeneratorPage;
