// Import the fs module
const fs = require("fs");

// Use dynamic import for node-fetch
import("node-fetch")
  .then(({ default: fetch }) => {
    // Function to extract 12-digit numbers from text
    function extractNumbers(text) {
      const regex = /\b\d{12}\b/g;
      return (text.match(regex))[0];
    }

    // Read the text file containing URLs
    fs.readFile("a.txt", "utf8", async (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }

      
      // Split the data into an array of lines (assuming each line contains a URL)
      const urls = data.split("\n");

      // Create an object to store unique mappings of 12-digit numbers to 6-letter words
      const mappings = {};

      // Iterate through each URL
      for (const url of urls) {
        // Split the URL by '/' and '_'
        const parts = url.split(/[\/_]/);
        // Extract the 8th item
        const eighthItem = parts[8];

        try {
          // Fetch the content of the URL
          const response = await fetch(url);
          const text = await response.text();
          const numbers = extractNumbers(text);
            const sixLetterWord = numbers.substring(2, 8);
            if (!(sixLetterWord in mappings)) {
                mappings[sixLetterWord] = eighthItem;
            }
            if ((sixLetterWord in mappings)&&!(mappings[sixLetterWord] == eighthItem)) {
                mappings[`${sixLetterWord}-${eighthItem}`] = eighthItem;

            }
        
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      // Convert the mappings object to an array of strings
      const output = Object.entries(mappings).map(
        ([number, word]) => `${number} = ${word}`
      );

      // Write the unique mappings to a new text file
      fs.writeFile("8thtext.txt", output.join("\n"), (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log("Output saved to output.txt");
      });
    });
  })
  .catch((error) => {
    console.error("Error importing node-fetch:", error);
  });
