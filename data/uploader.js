const { readFileSync } = require('fs');

async function readCSVData(filePath) {
  console.log('Starting read');
  const data = [];

  const fileContents = readFileSync(filePath, 'utf-8');
  const rows = fileContents.split('\n').slice(1); // Exclude header row

  for (const row of rows) {
    const [
      year,
      jurisdiction,
      filing_status,
      lower_bound,
      upper_bound,
      tax_rate,
    ] = row.split(',');

    const bracket = {
      year: parseInt(year),
      jurisdiction,
      filing_status,
      lower_bound: parseFloat(lower_bound),
      upper_bound: parseFloat(upper_bound),
      tax_rate: parseFloat(tax_rate),
    };

    data.push(bracket);
  }

  return data;
}

const filePath = 'data/brackets_ca_2022.csv';

readCSVData(filePath)
  .then(async (data) => {
    const { default: PocketBase } = await import('pocketbase');

    const pb = new PocketBase('http://127.0.0.1:8090');

    for (const record of data) {
      await pb.collection('brackets').create(record);
    }

    console.log('Data imported successfully');
  })
  .catch((error) => {
    console.error('Error reading CSV data:', error);
  });
