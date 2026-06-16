import { useState, useMemo } from 'react';
import { MEAL_DATABASE } from '../data/meals';
import { useStore } from '../store/useStore';
import type { Meal, FoodLogEntry } from '../types';

const CATEGORIES = [
  { val: 'all', label: 'All', icon: '🍽️' },
  { val: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { val: 'lunch', label: 'Lunch', icon: '☀️' },
  { val: 'dinner', label: 'Dinner', icon: '🌙' },
  { val: 'snack', label: 'Snack', icon: '🍎' },
  { val: 'shake', label: 'Shakes', icon: '🥤' },
  { val: 'zero_cal', label: 'Zero Cal', icon: '💧' },
];

export default function Meals() {
  const { favoriteMealIds, toggleFavoriteMeal, addFoodEntry, profile } = useStore();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [addedMeal, setAddedMeal] = useState<string | null>(null);
  const [showCustomAdd, setShowCustomAdd] = useState(false);
  const [customMeal, setCustomMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', mealTime: 'lunch' as FoodLogEntry['mealTime'] });
  const [filterTag, setFilterTag] = useState('');
  const [showFavsOnly, setShowFavsOnly] = useState(false);


  const allMeals = [...MEAL_DATABASE];

  const filtered = useMemo(() => {
    return allMeals.filter(m => {
      if (category !== 'all' && m.category !== category) return false;
      if (showFavsOnly && !favoriteMealIds.includes(m.id)) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTag && !m.tags.includes(filterTag)) return false;
      return true;
    });
  }, [category, search, filterTag, showFavsOnly, favoriteMealIds]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allMeals.forEach(m => m.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, []);

  const handleAddToLog = (meal: Meal, mealTime: FoodLogEntry['mealTime']) => {
    addFoodEntry({
      mealId: meal.id,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      mealTime,
    });
    setAddedMeal(meal.id);
    setTimeout(() => setAddedMeal(null), 1500);
  };

  const handleAddCustom = () => {
    if (!customMeal.name || !customMeal.calories) return;
    addFoodEntry({
      name: customMeal.name,
      calories: parseInt(customMeal.calories),
      protein: parseInt(customMeal.protein) || 0,
      carbs: parseInt(customMeal.carbs) || 0,
      fat: parseInt(customMeal.fat) || 0,
      mealTime: customMeal.mealTime,
    });
    setCustomMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', mealTime: 'lunch' });
    setShowCustomAdd(false);
  };

  const generateRandomDay = () => {
    const breakfast = allMeals.filter(m => m.category === 'breakfast');
    const lunch = allMeals.filter(m => m.category === 'lunch');
    const dinner = allMeals.filter(m => m.category === 'dinner');
    const snacks = allMeals.filter(m => m.category === 'snack');
    const target = profile?.dailyCalorieTarget || 1400;

    const pick = (arr: Meal[]) => arr[Math.floor(Math.random() * arr.length)];
    let attempts = 0;
    let b: Meal, l: Meal, d: Meal, s: Meal;
    do {
      b = pick(breakfast);
      l = pick(lunch);
      d = pick(dinner);
      s = pick(snacks);
      attempts++;
    } while (b.calories + l.calories + d.calories + s.calories > target + 200 && attempts < 50);

    [{ m: b, t: 'breakfast' }, { m: l, t: 'lunch' }, { m: d, t: 'dinner' }, { m: s, t: 'snack' }].forEach(({ m, t }) => {
      addFoodEntry({
        mealId: m.id, name: m.name, calories: m.calories,
        protein: m.protein, carbs: m.carbs, fat: m.fat,
        mealTime: t as FoodLogEntry['mealTime'],
      });
    });
  };

  return (
    <div className="pb-24 px-4 space-y-4">
      <div className="pt-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">MEAL PLAN</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFavsOnly(!showFavsOnly)}
            className={`text-xl px-2 py-1 rounded-lg ${showFavsOnly ? 'bg-red-500/20 text-red-400' : 'text-gray-600'}`}
          >❤️</button>
          <button
            onClick={() => setShowCustomAdd(!showCustomAdd)}
            className="text-cyan-400 text-sm font-bold"
          >+ Custom</button>
        </div>
      </div>

      {/* Quick add custom */}
      {showCustomAdd && (
        <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
          <h3 className="text-white font-bold">Quick Add Food</h3>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
            placeholder="Food name..."
            value={customMeal.name}
            onChange={e => setCustomMeal(f => ({ ...f, name: e.target.value }))}
          />
          <div className="grid grid-cols-4 gap-2">
            {['calories', 'protein', 'carbs', 'fat'].map(field => (
              <div key={field}>
                <label className="text-gray-500 text-xs capitalize">{field}</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm outline-none focus:border-cyan-500"
                  placeholder="0"
                  value={customMeal[field as keyof typeof customMeal]}
                  onChange={e => setCustomMeal(f => ({ ...f, [field]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none"
            value={customMeal.mealTime}
            onChange={e => setCustomMeal(f => ({ ...f, mealTime: e.target.value as FoodLogEntry['mealTime'] }))}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setShowCustomAdd(false)} className="flex-1 py-2 bg-gray-800 rounded-xl text-gray-300">Cancel</button>
            <button onClick={handleAddCustom} className="flex-1 py-2 bg-cyan-500 rounded-xl text-black font-bold">Add to Log</button>
          </div>
        </div>
      )}

      {/* Random Day Generator */}
      <button
        onClick={generateRandomDay}
        className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white font-black text-base active:scale-95 transition-transform"
      >
        🎲 GENERATE RANDOM DAY
      </button>

      {/* Search */}
      <input
        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
        placeholder="🔍 Search meals..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button
            key={c.val}
            onClick={() => setCategory(c.val)}
            className={`flex-none px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              category === c.val ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-400 border border-gray-800'
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setFilterTag('')}
          className={`flex-none px-2 py-1 rounded-lg text-xs font-bold ${filterTag === '' ? 'bg-gray-500 text-white' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
        >
          All Tags
        </button>
        {allTags.slice(0, 8).map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
            className={`flex-none px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${filterTag === tag ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="text-gray-500 text-sm">{filtered.length} meals</div>

      {/* Meal cards */}
      <div className="space-y-3">
        {filtered.map(meal => (
          <div
            key={meal.id}
            className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setSelectedMeal(selectedMeal?.id === meal.id ? null : meal)}
              className="w-full px-4 py-4 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{meal.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-cyan-400 font-black">{meal.calories} cal</span>
                    <span className="text-gray-500 text-sm">{meal.protein}g protein</span>
                    <span className="text-gray-600 text-xs">⏱ {meal.prepTime}min</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {meal.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavoriteMeal(meal.id); }}
                    className="text-xl"
                  >
                    {favoriteMealIds.includes(meal.id) ? '❤️' : '🤍'}
                  </button>
                  <div className="text-gray-600 text-xs">{selectedMeal?.id === meal.id ? '▲' : '▼'}</div>
                </div>
              </div>

              {/* Macro bar */}
              <div className="flex gap-1 mt-3 h-1.5 rounded-full overflow-hidden bg-gray-800">
                <div className="bg-blue-500" style={{ width: `${(meal.protein * 4 / meal.calories) * 100}%` }} />
                <div className="bg-yellow-500" style={{ width: `${(meal.carbs * 4 / meal.calories) * 100}%` }} />
                <div className="bg-red-500" style={{ width: `${(meal.fat * 9 / meal.calories) * 100}%` }} />
              </div>
              <div className="flex gap-3 mt-1">
                <span className="text-blue-400 text-xs">P: {meal.protein}g</span>
                <span className="text-yellow-400 text-xs">C: {meal.carbs}g</span>
                <span className="text-red-400 text-xs">F: {meal.fat}g</span>
                <span className="text-green-400 text-xs">Fiber: {meal.fiber}g</span>
              </div>
            </button>

            {/* Expanded view */}
            {selectedMeal?.id === meal.id && (
              <div className="border-t border-gray-800 px-4 py-4 space-y-4">
                <div>
                  <h4 className="text-gray-400 text-xs font-bold mb-2">INGREDIENTS</h4>
                  <ul className="space-y-1">
                    {meal.ingredients.map((ing, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-cyan-500 mt-0.5">•</span> {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-bold mb-2">INSTRUCTIONS</h4>
                  <ol className="space-y-2">
                    {meal.instructions.map((step, i) => (
                      <li key={i} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-cyan-500 font-bold shrink-0">{i + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-bold mb-2">ADD TO LOG</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mt => (
                      <button
                        key={mt}
                        onClick={() => handleAddToLog(meal, mt)}
                        className={`py-2.5 rounded-xl font-bold text-sm capitalize transition-all ${
                          addedMeal === meal.id ? 'bg-green-500 text-white' : 'bg-cyan-500 text-black'
                        }`}
                      >
                        {addedMeal === meal.id ? '✓ Added!' : `+ ${mt}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
