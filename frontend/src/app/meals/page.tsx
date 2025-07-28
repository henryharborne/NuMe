'use client';

import { useState } from 'react';

import styles from './MealsPage.module.css'; 

export default function MealsPage() {
  const [entries, setEntries] = useState<{ date: string; food: string; calories: number; mealType: string }[]>([]);
  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [maxCalories, setMaxCalories] = useState(2000); // Default daily max
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !food || !calories) return;
    setEntries([...entries, { date, food, calories: parseInt(calories), mealType }]);
    setDate('');
    setFood('');
    setCalories('');
    
  };

    // Restrict dates to current week(Monday–Sunday)
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay(); // 0 = Sunday
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() + mondayOffset);
    startOfWeek.setHours(0, 0, 0, 0);
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
  
    // Format for <input type="date">
    const minDate = startOfWeek.toISOString().split('T')[0];
    const maxDate = endOfWeek.toISOString().split('T')[0];
    
    // Get today's total calories
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
      <h1 className={styles.title}>Meal Journal</h1>

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
            style={{ width: `${caloriePercent}%`, backgroundColor: caloriePercent > 100 ? '#ff4d4d' : '#4ade80' }}
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
                  <h4 className={styles.mealTypeTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
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