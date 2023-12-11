import React from "react";
import moment from "moment";
import "./WorkoutsTable.css"

const WorkoutsTable = ({ workouts }) => {
  if (!workouts.length) {
    return <p>No workouts recorded for this exercise.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight (lbs)</th>
          <th>Reps</th>
          <th>RPE</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((workout, index) => (
          <tr key={index}>
            <td>{moment(workout.date).format("YYYY-MM-DD")}</td>
            <td>{workout.weight}</td>
            <td>{workout.reps}</td>
            <td>{workout.rpe}</td>
            <td>{workout.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkoutsTable;
