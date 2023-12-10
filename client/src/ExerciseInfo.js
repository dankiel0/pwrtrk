import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

function ExerciseInfo({ exercise, selectedUser }) {
  // State for existing workouts
  const [workouts, setWorkouts] = useState([]);

  // State for form inputs
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [rpe, setRPE] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch workouts when the selected user or exercise changes
  useEffect(() => {
    if (selectedUser && exercise) {
      const fetchWorkouts = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/workouts/${selectedUser.username}/${exercise}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWorkouts(response.data);
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      };

      fetchWorkouts();
    }
  }, [selectedUser, exercise]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutData = {
      username: selectedUser.username,
      exercise,
      weight,
      reps,
      date,
      rpe,
      notes,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/workouts", workoutData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle successful submission (e.g., clear form, show message)
    } catch (error) {
      // Handle errors (e.g., show error message)
      console.error("Error submitting workout:", error);
    }
  };
  
  return (
    <div className="exercise-info">
      <h2>Log Workout for {exercise}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Weight (lbs):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <label>
          Reps:
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          RPE:
          <input
            type="number"
            value={rpe}
            onChange={(e) => setRPE(e.target.value)}
          />
        </label>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </label>
        <button type="submit">Submit Workout</button>
      </form>

      {workouts.length > 0 && (
        <div className="workouts-list">
          {workouts[0].weight}
          {workouts[0].reps}
          {workouts[0].date}
          {workouts[0].rpe}
          {workouts[0].notes}
        </div>
      )}
    </div>
  );
}

export default ExerciseInfo;
