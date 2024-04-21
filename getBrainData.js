// Import the file system module
const fs = require('fs');

// Define the handler function for the serverless function
module.exports = (req, res) => {
  // Read the contents of the JSON file
  fs.readFile('C:/Users/srihari/Desktop/js_car_proj_more_edits/bestBrain.json', 'utf8', (err, data) => {
    if (err) {
      // If an error occurs, send a 500 Internal Server Error response
      res.status(500).json({ error: 'Error reading brain data' });
      return;
    }
    
    // If successful, send the JSON data as the response
    res.status(200).json(JSON.parse(data));
  });
};
