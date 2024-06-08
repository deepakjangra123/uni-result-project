import("node-fetch")
  .then(async ({ default: fetch }) => {
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

    // Loop through different values of x and m
    for (let d = 1; d <= 32; d++) {
      for (let m = 1; m <= 7; m++) {
        let dayString = d < 10 ? `0${d}` : `${d}`;
        let url;
        if (sem % 2 === 0) {
          url = `http://210.212.119.171/exam/results/20/${m}/BTechCSE_1Sem_May-${year}_${dayString}0${m}${year}.TXT`;
        } else {
          url = `http://210.212.119.171/exam/results/20${year}/${m}/BTechCSE_1Sem_Dec-${
            year - 1
          }_${dayString}0${m}${year}.TXT`;
        }
        await checkURL(url);
        // If response is received, send it as the final response
      }
    }
    for (let d = 1; d <= 32; d++) {
      for (let m = 7; m <= 13; m++) {
        let dayString = d < 10 ? `0${d}` : `${d}`;
        let url;
        if (sem % 2 === 0) {
          url = `http://210.212.119.171/exam/results/20${year}/${m}/BTechCSE_${sem}Sem_May-${year}_${dayString}${m}${year}.TXT`;
        } else {
          url = `http://210.212.119.171/exam/results/20${year}/${m}/BTechCSE_${sem}Sem_Dec-${
            year - 1
          }_${dayString}${m}${year}.TXT`;
        }
        await checkURL(url);
      }
    }
  })
  .catch((error) => console.error(error));
