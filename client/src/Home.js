import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { EXERCISES } from "./exerciseList"; // Assuming EXERCISES is your array of exercises
import ExerciseInfoForm from "./ExerciseInfoForm";
import WorkoutsTable from "./WorkoutsTable";

function Home() {
  const [workouts, setWorkouts] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(EXERCISES);
  const [selectedExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      axios
        .get(`http://localhost:5000/api/users/${username}`)
        .then((response) => {
          setSelectedUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    if (selectedUser && selectedExercise) {
      const fetchWorkouts = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/api/workouts/${selectedUser.username}/${exercise}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setWorkouts(response.data);
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      };

      fetchWorkouts();
    }
  }, [selectedUser, selectedExercise]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = EXERCISES.filter((exercise) =>
      exercise.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredExercises(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    // Redirect to login page or handle logout
  };

  return (
    <div className="Home">
      <div className="upper-menu">
        Welcome, {selectedUser ? selectedUser.username : "Loading..."}
        <Link to="/edit">Edit Profile</Link>
        <Link to="/login" onClick={handleLogout}>
          Log Out
        </Link>
      </div>

      <div className="content-container">
        <div className="side-nav">
          <input
            className="search-exercise"
            placeholder="Search exercise"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {filteredExercises.map((exercise, index) => (
            <button
              key={index}
              className="button"
              onClick={() => setSelectedExercise(exercise)}
            >
              {exercise}
            </button>
          ))}
        </div>

        <div className="exercise-info-container">
          {selectedExercise && (
            <ExerciseInfoForm
              exercise={selectedExercise}
              selectedUser={selectedUser}
            />
          )}
          <WorkoutsTable workouts={workouts} />
        </div>
      </div>
    </div>
  );
}

export default Home;
