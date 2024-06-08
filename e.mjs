import fetch from "node-fetch";
import fs from "fs/promises";

// Function to check URL validity
async function checkURL(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log(`Working URL found: ${url}`);
      // Return the response if URL is valid
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
  for (let year = 19; year <= 19; year++) {
    for (let sem = 1; sem <= 8; sem++) {
      let links = [];
      // Loop through all months
      for (let m = 1; m <= 13; m++) {
        // If links are found, break the loop
        if (links.length > 0) break;

        // Get the correct month format
        const monthString = m < 10 ? `0${m}` : `${m}`;
        
        // Determine URL based on semester
        let url;
        if (sem % 2 === 0) {
          url = `http://210.212.119.171/exam/results/20${year}/${monthString}/BTechCSE_${sem}Sem_May-${year}_${monthString}${year}.TXT`;
        } else {
          url = `http://210.212.119.171/exam/results/20${year}/${monthString}/BTechCSE_${sem}Sem_Dec-${year - 1}_${monthString}${year}.TXT`;
        }

        // Check the URL
        const response = await checkURL(url);
        if (response) {
          links.push(url);
        }
      }
      workingLinks[year] = links;
      await saveLinksToFile(links, year);
    }
  }
}

// Run the scraping and saving function
scrapeAndSaveLinks();
