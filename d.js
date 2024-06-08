const fs = require("fs").promises;

// Function to check URL validity
async function checkURL(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log(`Working URL found: ${url}`);
      return url; // Return the URL instead of response.text()
    }
  } catch (error) {
    console.error(error);
    return null; // Return null if there's an error
  }
}

// Function to save links to a file
async function saveLinksToFile(links, year) {
  try {
    const file = `working_links_${year}.txt`;
    let existingLinks = [];
    try {
      const data = await fs.readFile(file, 'utf8');
      existingLinks = data.trim().split('\n');
    } catch (error) {
      // Ignore file not found errors
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const uniqueLinks = new Set([...existingLinks, ...links]);
    await fs.writeFile(file, [...uniqueLinks].join("\n") + "\n");
    console.log(`Working links for year ${year} saved to file.`);
  } catch (error) {
    console.error(`Error saving links to file for year ${year}:`, error);
  }
}

// Loop through different values of year and sem
async function scrapeAndSaveLinks() {
  const year = 20;
  const workingLinks = {};

  for (let sem = 1; sem <= 8; sem++) {
    let links = [];
    let linkFound = false; // Flag to track if link is found for current semester
    let ct="BTechCSE"
    let semcode ="Sem"
    let calcYear;
    if (sem % 2 === 0) {
      calcYear = Math.floor(year + sem / 2);
    } else {
      calcYear = Math.floor(year + sem / 2 + 1);
    }

    for (let m = 1; m <= 13; m++) { // Change the upper limit of months loop
      if (linkFound) break;
      let mi = m > 9 ?  `${m}` : `0${m}`;

      for (let d = 1; d <= 31; d++) {
        let dayString = d < 10 ? `0${d}` : `${d}`;
        let url;

        if (sem % 2 === 0) {
          url = `http://210.212.119.171/exam/results/20${calcYear}/${m}/${ct}_${sem}${semcode}_May-${calcYear}_${dayString}${mi}${calcYear}.TXT`;
        } else {
          url = `http://210.212.119.171/exam/results/20${calcYear}/${m}/${ct}_${sem}${semcode}_Dec-${calcYear - 1}_${dayString}${mi}${calcYear}.TXT`;
        }
        const response = await checkURL(url);
        if (response) {
          links.push(response);
          linkFound = true;
          break;
        }
      }
    }


    workingLinks[calcYear] = links;
    await saveLinksToFile(links, year);
  }
}

// Run the scraping and saving function
scrapeAndSaveLinks();
