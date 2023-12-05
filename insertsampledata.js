const axios = require("axios");

// Function to send the POST request
async function insertRandomSampleData() {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/insert-random-sample-data"
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
}

// Call the function to send the POST request
insertRandomSampleData();
