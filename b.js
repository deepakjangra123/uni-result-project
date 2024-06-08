const fs = require("fs").promises;

// Function to check URL validity
async function checkURL(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log(`Working URL found: ${url}`);
      return response.text();
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to save links to a file
async function saveLinksToFile(links, year) {
  try {
    await fs.writeFile(`working_links_${year}.txt`, links.join("\n"));
    console.log(`Working links for year ${year} saved to file.`);
  } catch (error) {
    console.error(`Error saving links to file for year ${year}:`, error);
  }
}

// Loop through different values of year and sem
async function scrapeAndSaveLinks() {
  const workingLinks = {};


    const year = 19;
    for (let sem = 1; sem <= 8; sem++) {
      let links = [];
      let linkFound = false; // Flag to track if link is found for current semester
      
      // Calculate year based on semester
      let calcYear;
      if (sem % 2 === 0) {
        calcYear = Math.floor(year + sem / 2);
      } else {
        calcYear = Math.floor(year + sem / 2 + 1);
      }
      
      // Loop for months 1 to 7
      for (let m = 1; m <= 7; m++) {
        if (linkFound) break; // If link is found, exit the loop
        // Loop for days 1 to 31
        for (let d = 1; d <= 31; d++) {
          let dayString = d < 10 ? `0${d}` : `${d}`;
          let url;
          if (sem % 2 === 0) {
            url = `http://210.212.119.171/exam/results/20${calcYear}/${m}/BTechCSE_${sem}Sem_May-${calcYear}_${dayString}0${m}${calcYear}.TXT`;
          } else {
            url = `http://210.212.119.171/exam/results/20${calcYear}/${m}/BTechCSE_${sem}Sem_Dec-${calcYear - 1}_${dayString}0${m}${calcYear}.TXT`;
          }
          const response = await checkURL(url);
          if (response) {
            links.push(url);
            linkFound = true; // Set flag to true if link is found
            break; // Exit the inner loop
          }
        }
      }
      
      // Loop for months 7 to 13
      for (let m = 7; m <= 13; m++) {
        if (linkFound) break; // If link is found, exit the loop
        // Loop for days 1 to 31
        for (let d = 1; d <= 31; d++) {
          let dayString = d < 10 ? `0${d}` : `${d}`;
          let url;
          if (sem % 2 === 0) {
            url = `http://210.212.119.171/exam/results/20${calcYear}/${m}/_${sem}Sem_May-${calcYear}_${dayString}${m}${calcYear}.TXT`;
          } else {
            url = `http://210.212.119.171/exam/results/20${calcYear}/${m}/BTechCSE_${sem}Sem_Dec-${calcYear - 1}_${dayString}${m}${calcYear}.TXT`;
          }
          const response = await checkURL(url);
          if (response) {
            links.push(url);
            linkFound = true; // Set flag to true if link is found
            break; // Exit the inner loop
          }
        }
      }
      
      workingLinks[calcYear] = links;
      await saveLinksToFile(links, year);
    }
  }


// Run the scraping and saving function
scrapeAndSaveLinks();