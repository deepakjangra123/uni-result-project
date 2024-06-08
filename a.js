const express = require('express');

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Function to find SGPA
    async function findSGPA(rollNumber) {
        try {
            const response = await fetch('http://210.212.119.171/exam/results/2024/04/BTechCSEMain_7SemRe_Dec-23_020424.TXT');
            const data = await response.text();
            
            // Split the result text into lines
            const lines = data.split('\n');
            // Iterate through each line to find the roll number
            for (let line of lines) {
                // Check if the line contains the roll number
                if (line.includes(rollNumber)) {
                    // Check if the line contains "PCC-CSEAI30"
                    if (line.includes("P")) {
                        return "RE";
                    }
                    // Split the line by whitespace
                    const columns = line.split(/\s+/);
                    // The SGPA is the last element in the columns array
                    const sgpa = columns[columns.length - 2];
                    return sgpa;
                }
            }
            // If the roll number is not found, return an error message
            return 'Roll number not found.';
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error('Internal Server Error');
        }
    }
    

    app.get('/fetch-data', async (req, res) => {
        const rollNumber = req.query.rollNumber;
        if (!rollNumber) {
            return res.status(400).send('Roll number is required.');
        }
        
        try {
            const sgpa = await findSGPA(rollNumber);
            res.send(`SGPA for roll number ${rollNumber}: ${sgpa}`);
        } catch (error) {
            console.error('Error finding SGPA:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error importing node-fetch:', error);
});
