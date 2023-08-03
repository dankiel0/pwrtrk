
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import axios from "axios";
import "chartjs-adapter-moment";
import { Chart, registerables } from "chart.js";
import ChartZoom from "chartjs-plugin-zoom";
import regression from "regression";

Chart.register(...registerables);
Chart.register(ChartZoom);

function ExerciseInfo({ exercise, selectedUser }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState("");
  const [rpe, setRPE] = useState("");
  const [notes, setNotes] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [predictedData, setPredictedData] = useState([]);

  const chartRef = useRef();

  useEffect(() => {
    if (selectedUser && exercise) {
      // Fetch workouts for the selected user and exercise
      axios
        .get(`http://localhost:5000/api/workouts/${selectedUser.username}/${exercise}`)
        .then((response) => {
          // Sort the workouts by date
          const sortedWorkouts = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setWorkouts(sortedWorkouts);
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

  const predictNextWorkout = () => {
    if (!selectedUser || !exercise || workouts.length === 0) {
      console.error("Invalid: error");
      return;
    }

    // Assuming you have an array of workout data in the state, workoutData
    const workoutData = workouts.map((workout) => ({
      x: new Date(workout.date).getTime(), // Convert the date to milliseconds
      y: workout.weight,
    }));

    // Implement your prediction logic here
    const regressionModel = regression.linear(workoutData.map((point) => [point.x, point.y]));

    // Predict the next workout dates and weights
    const lastDate = new Date(workoutData[workoutData.length - 1].x);
    const nextDates = [];
    for (let i = 1; i <= 12; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + i * 2);
      nextDates.push(nextDate);
    }

    const predictedData = nextDates.map((nextDate) => {
      const predictedWeight = regressionModel.predict(nextDate.getTime())[1];
      return {
        x: nextDate,
        y: Math.max(predictedWeight, 0), // Ensure the predicted weight is not negative
      };
    });

    // Extend the regression line
    const lastPoint = workoutData[workoutData.length - 1];
    const lastX = lastPoint.x;
    const lastY = lastPoint.y;
    const nextYear = new Date(lastX);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearX = nextYear.getTime();
    const regressionExtension = regressionModel.predict(nextYearX)[1];
    predictedData.unshift({ x: nextYear, y: Math.max(regressionExtension, lastY) });

    setPredictedData(predictedData);
  };

  const [zoomOptions, setZoomOptions] = useState({
    start: 0,
    end: 100,
  });

  const handleZoomChange = (event) => {
    const newZoomOptions = {
      start: event.target.value,
      end: 100 - event.target.value,
    };
    setZoomOptions(newZoomOptions);
  };

  const chartData = {
    labels: workouts.map((workout) => workout.date),
    datasets: [
      {
        label: "Weight Lifted (lbs)",
        data: workouts.map((workout) => workout.weight),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: "Predicted Weight (lbs)",
        data: predictedData,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.4)",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  // Modify the chartData based on the zoom options
  const dataLength = chartData.labels.length;
  const startIndex = Math.floor((zoomOptions.start / 100) * dataLength);
  const endIndex = Math.floor((1 - zoomOptions.end / 100) * dataLength);
  const visibleChartData =
    zoomOptions.start === 0 && zoomOptions.end === 100
      ? chartData
      : {
          labels: chartData.labels.slice(startIndex, endIndex),
          datasets: chartData.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.slice(startIndex, endIndex),
          })),
        };

  const handleChartClick = (event) => {
    const chart = chartRef.current;
    if (chart) {
      const activePoints = chart.getElementsAtEventForMode(event, "nearest", { intersect: true });
      if (activePoints.length > 0) {
        const firstPoint = activePoints[0];
        const { datasetIndex, index } = firstPoint;
        const selectedWorkout = workouts[index];
        setSelectedWorkout(selectedWorkout);
      }
    }
  };

  const chartOptions = {
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
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
          data={visibleChartData} // Use the visibleChartData instead of chartData
          options={chartOptions}
          ref={chartRef}
          onClick={handleChartClick}
        />
      </div>
      <button onClick={predictNextWorkout}>Predict Next Workout</button>

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