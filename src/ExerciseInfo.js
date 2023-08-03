import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import axios from "axios";
import "chartjs-adapter-moment";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function ExerciseInfo({ exercise, selectedUser }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState("");
  const [rpe, setRPE] = useState("");
  const [notes, setNotes] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const chartRef = useRef();

  useEffect(() => {
    if (selectedUser && exercise) {
      // Fetch workouts for the selected user and exercise
      axios
        .get(`http://localhost:5000/api/workouts/${selectedUser.username}/${exercise}`)
        .then((response) => {
          setWorkouts(response.data);
        })
        .catch((error) => {
          console.log("Error fetching workouts:", error);
        });
    }
  }, [selectedUser, exercise]);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!selectedUser || !exercise) {
      console.error("Invalid: error");
    }

    console.log("Selected date:", date); // Add this line
    // Create a new workout object
    const newWorkout = {
      user: selectedUser.username,
      exercise: exercise, // Add the exercise to the workout object
      weight: parseFloat(weight),
      reps: parseInt(reps),
      date: moment(date).format("YYYY-MM-DD"),
      rpe: parseInt(rpe),
      notes: notes,
    };

    // Send the new workout data to the server to be saved
    axios
      .post("http://localhost:5000/api/workouts", newWorkout)
      .then((response) => {
        console.log(response.data.message);
        // Add the new workout to the workouts state
        setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);

        // Clear the form fields
        setWeight("");
        setReps("");
        setDate("");
        setRPE("");
        setNotes("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Prepare data for the chart
  const sortedWorkouts = workouts.sort((a, b) => a.date - b.date);

  const chartData = {
    labels: sortedWorkouts.map((workout) => workout.date), // Use the date field directly
    datasets: [
      {
        label: "Weight Lifted (lbs)",
        data: sortedWorkouts.map((workout) => workout.weight),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const handleChartClick = (event) => {
    console.log("here");
    const chart = chartRef.current;
    if (chart) {
      const activePoints = chart.getElementsAtEventForMode(event, "nearest", {
        intersect: true,
      });
      if (activePoints.length > 0) {
        const firstPoint = activePoints[0];
        // eslint-disable-next-line
        const { datasetIndex, index } = firstPoint;
        const selectedWorkout = sortedWorkouts[index];
        setSelectedWorkout(selectedWorkout);
      }
    }
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM D, YYYY",
          displayFormats: {
            day: "MMM D, YYYY",
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="exercise-info">
      {exercise}
      <form onSubmit={handleSubmitForm}>
        <label>
          Weight (lbs):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </label>
        <label>
          Reps:
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          RPE:
          <input
            type="number"
            value={rpe}
            onChange={(e) => setRPE(e.target.value)}
            required
          />
        </label>
        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>

      <div className="chart-container">
      <Line
          data={chartData}
          options={chartOptions}
          ref={chartRef}
          onClick={handleChartClick}
        />
      </div>

      {selectedWorkout && (
        <div className="selected-data">
          <h2>Selected Data:</h2>
          <p>Exercise: {selectedWorkout.exercise}</p>
          <p>Date: {moment(selectedWorkout.date).format("MMM D, YYYY")}</p>
          <p>Weight: {selectedWorkout.weight}</p>
          <p>Reps: {selectedWorkout.reps}</p>
          <p>RPE: {selectedWorkout.rpe}</p>
          <p>Notes: {selectedWorkout.notes}</p>
        </div>
      )}



    </div>
  );
}

export default ExerciseInfo;