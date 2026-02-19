
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/cocktails.json');

try {
  const data = fs.readFileSync(filePath, 'utf8');
  const cocktails = JSON.parse(data);
  
  const total = cocktails.length;
  const enriched = cocktails.filter(c => c.strInstructionsPT).length;
  
  console.log(`Total Cocktails: ${total}`);
  console.log(`Enriched (PT): ${enriched}`);
  console.log(`Percentage: ${((enriched / total) * 100).toFixed(2)}%`);
} catch (error) {
  console.error("Error reading file:", error);
}
