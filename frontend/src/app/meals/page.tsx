'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './MealsPage.module.css'; 

export default function MealsPage() {
  const [entries, setEntries] = useState<{ date: string; food: string; calories: number; mealType: string }[]>([]);
  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [maxCalories, setMaxCalories] = useState(2000); // Default daily max
  const [userId, setUserId] = useState<string | null>(null);
  const backButtonStyle: React.CSSProperties = {
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    zIndex: 10,
  };
  
  // On mount, get userId from localStorage and fetch meals
  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
      fetchMeals(storedId);
    }
  }, []);

  const fetchMeals = async (uid: string) => {
    const res = await fetch(`http://localhost:4000/api/meals/${uid}`);
    if (!res.ok) return;
    const data = await res.json();

    // Map DB fields to state structure
    const formatted = data.map((entry: any) => ({
      date: entry.date,
      food: entry.food,
      calories: Number(entry.calories),
      mealType: entry.meal_type.toLowerCase(),
    }));
    setEntries(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !food || !calories || !userId) return;

    // Capitalize to satisfy DB CHECK constraint, annoying bug
    const formattedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    const newMeal = {
      user_id: userId,
      date,
      meal_type: formattedMealType,
      food,
      calories: Number(calories),
    };

    const res = await fetch('http://localhost:4000/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMeal),
    });

    if (res.ok) {
      const savedMeal = await res.json();
      // Add to local state, use lowercase for UI grouping
      setEntries([
        ...entries,
        {
          date: savedMeal.date,
          food: savedMeal.food,
          calories: savedMeal.calories,
          mealType: savedMeal.meal_type.toLowerCase(),
        },
      ]);
      // Reset form
      setDate('');
      setFood('');
      setCalories('');
    }
  };

  // Restrict dates to current week (Monday–Sunday)
  const todayDate = new Date();
  const dayOfWeek = todayDate.getDay(); // 0 = Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(todayDate);
  startOfWeek.setDate(todayDate.getDate() + mondayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const minDate = startOfWeek.toISOString().split('T')[0];
  const maxDate = endOfWeek.toISOString().split('T')[0];

  const today = new Date().toISOString().split('T')[0];
  const todaysCalories = entries
    .filter(entry => entry.date === today)
    .reduce((sum, entry) => sum + entry.calories, 0);

  const caloriePercent = Math.min((todaysCalories / maxCalories) * 100, 100);

  // Group entries by date and mealType
  const groupedByDate: Record<string, Record<string, typeof entries>> = {};
  entries.forEach((entry) => {
    if (!groupedByDate[entry.date]) {
      groupedByDate[entry.date] = {};
    }
    if (!groupedByDate[entry.date][entry.mealType]) {
      groupedByDate[entry.date][entry.mealType] = [];
    }
    groupedByDate[entry.date][entry.mealType].push(entry);
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          &larr;
        </Link>
        <div className={styles.spacer}></div>
        <h1 className={styles.title}>Meal Journal</h1>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Date:
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Meal Type:
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className={styles.input}
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </label>
        <label className={styles.label}>
          Food:
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Calories:
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
            min="0"
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Log Meal
        </button>
      </form>

      {/* Max Calories and Progress Bar */}
      <div className={styles.widget}>
        <h3 className={styles.sectionHeading}>Daily Calorie Progress</h3>
        <label className={styles.label}>
          Max Daily Calories:
          <input
            type="number"
            value={maxCalories}
            onChange={(e) => setMaxCalories(parseInt(e.target.value))}
            min="0"
            className={styles.input}
          />
        </label>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${caloriePercent}%`,
              backgroundColor: caloriePercent > 100 ? '#ff4d4d' : '#4ade80',
            }}
          >
            <span className={styles.progressText}>
              {todaysCalories} / {maxCalories} cal
            </span>
          </div>
        </div>
      </div>

      <h2 className={styles.sectionHeading}>Logged Meals</h2>
      {Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a)).map((date) => (
        <div key={date} className={styles.dayBlock}>
          <h3 className={styles.dayTitle}>
            {new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          {['breakfast', 'lunch', 'dinner', 'snack'].map((type) =>
            groupedByDate[date][type] ? (
              <div key={type}>
                <h4 className={styles.mealTypeTitle}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </h4>
                <ul className={styles.entries}>
                  {groupedByDate[date][type].map((entry, i) => (
                    <li key={i} className={styles.entry}>
                      {entry.food} ({entry.calories} cal)
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
}
