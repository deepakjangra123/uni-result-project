

const fs = require('fs');
import("node-fetch")
  .then(({ default: fetch }) => {
    async function findTwelveDigitWords(x) {
        try {
          const response = await fetch(x);
          const data = await response.text();
          const regex = /\b\d{12}\b/g;
          const matches = await data.match(regex);
          const w = matches[0].substring(2, 8)
          return w;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    fs.readFile('a.txt', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
        const urls = data.split('\n');
        const uniqueParts = new Set();
        urls.forEach((url, index) => {
          const parts = url.split(/[\/_]/)[7];
          const partWithG =  findTwelveDigitWords(url)+ "="+url.split(/[\/_]/)[7];
          uniqueParts.add(partWithG);
        });
        const uniquePartsArray = Array.from(uniqueParts);
        fs.writeFile('unique_parts1.txt', uniquePartsArray.join('\n'), (err) => {
            if (err) {
              console.error('Error writing file:', err);
              return;
            }
            console.log('Unique parts saved to unique_parts.txt');
          });

   

  })})
  .catch((error) => {
    console.error("Error importing node-fetch:", error);
  });

