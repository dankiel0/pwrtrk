import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExerciseInfo from "./ExerciseInfo";
import "./Home.css";
import axios from "axios";

function Home() {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises from the server when the component mounts
    axios
      .get("http://localhost:5000/api/exercises")
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch selected user data here (you need to get the username from localStorage or wherever you store it)
    const username = localStorage.getItem("username");
    if (username) {
      axios
        .get(`http://localhost:5000/api/users/${username}`)
        .then((response) => {
          setSelectedUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedExercise(""); // Clear selected exercise when searching
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="Home">
      {/* Upper Menu */}
      <div className="menu">
        <div className="upper-menu">
          Welcome, {localStorage.getItem("username")}
          <Link to="/edit">Edit Profile</Link>
          <Link to="/help">Help</Link>
          <Link to="/login">Log Out</Link>
        </div>
      </div>

      <div className="content-container">
        {/* Side Navigation Menu */}
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
              className={`button ${
                selectedExercise === exercise ? "highlighted" : ""
              }`}
              onClick={() => setSelectedExercise(exercise)}
            >
              {exercise}
            </button>
          ))}
        </div>

        {/* Exercise Information */}
        <div className="exercise-info-container">
          {selectedExercise && (
            <ExerciseInfo
              exercise={selectedExercise}
              selectedUser={selectedUser}
            />
          )}
          {!selectedExercise && (
            <p>Please select an exercise to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
