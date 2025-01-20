const fs = require('fs');
const cheerio = require('cheerio');
const { writeToPath } = require('fast-csv');

// Took the table from this website: https://gamerant.com/marvel-rivals-all-heroic-journey-achievements-rewards-skins/ and put it in a file called test.html
const inputHTML = 'test.html';
const outputCSV = 'achievements.csv';

const parseAchievements = (htmlFile) => {
    const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
    const $ = cheerio.load(htmlContent);
  
    const achievements = [];
  
    $('table tbody tr').each((index, row) => {
        // Skip the header row
        if (index === 0) return;
      
        const cells = $(row).find('td p');
        if (cells.length === 3) {
          const title = $(cells[0]).text().trim();
          const objective = $(cells[1]).text().trim();
          const points = parseInt($(cells[2]).text().trim(), 10);
      
          achievements.push({ title, objective, points });
        }
      });
  
    return achievements;
  };
  
  const achievements = parseAchievements(inputHTML);
  
  // Write achievements to CSV
  writeToPath(outputCSV, achievements, { headers: true, quote: true })
    .on('finish', () => console.log(`CSV written to ${outputCSV}`))
    .on('error', (error) => console.error(`Error writing CSV: ${error}`));