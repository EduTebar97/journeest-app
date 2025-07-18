const fs = require('fs');
const path = require('path');

const run = async () => {
  try {
    console.log('--- Running All Tests ---');
    const testFiles = fs.readdirSync('./tests').filter(f => f.endsWith('.test.js')).sort();

    for (const file of testFiles) {
        console.log(''); // Simple newline
        console.log(`--- Running test file: ${file} ---`);
        const testModule = require(path.join(__dirname, 'tests', file));
        if (typeof testModule === 'function') {
            await testModule();
        }
    }
    
    console.log(''); // Simple newline
    console.log('All tests completed successfully!');

  } catch (error) {
    console.log(''); // Simple newline
    console.error('An error occurred during testing:', error);
    process.exit(1);
  }
};

run();
