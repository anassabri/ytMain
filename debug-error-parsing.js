#!/usr/bin/env node

const { execSync } = require('child_process');

// Debug script to test error parsing
function testErrorParsing() {
  console.log('Testing TypeScript error parsing...');
  
  try {
    execSync('npx tsc --noEmit', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('No errors found');
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || '';
    console.log('Error output length:', errorOutput.length);
    console.log('First 500 chars:', errorOutput.slice(0, 500));
    
    const lines = errorOutput.split('\n');
    console.log('Total lines:', lines.length);
    
    const errorLines = lines.filter(line => line.includes(': error TS'));
    console.log('Error lines found:', errorLines.length);
    
    if (errorLines.length > 0) {
      console.log('First few error lines:');
      errorLines.slice(0, 5).forEach((line, i) => console.log(`${i}: ${line}`));
    }
    
    // Test regex
    const testLine = "components/CategoryChips.tsx(1,17): error TS6133: 'FC' is declared but its value is never read.";
    const regex = /^(.+)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)$/;
    const match = testLine.match(regex);
    console.log('Test regex match:', match ? 'SUCCESS' : 'FAILED');
    if (match) {
      console.log('Match groups:', match.slice(1));
    }
  }
}

testErrorParsing();