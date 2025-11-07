#!/usr/bin/env node
// Simple Node.js port of the COBOL account system
// Preserves menu and business logic: view balance, credit, debit, exit

const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });

const DATA_FILE = path.resolve(__dirname, 'account-data.json');

function loadBalance() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const obj = JSON.parse(raw);
    return Number(obj.balance);
  } catch (err) {
    // If file missing or corrupt, initialize with default 1000.00
    return 1000.0;
  }
}

function saveBalance(value) {
  const obj = { balance: Number(value) };
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function readNumber(promptText) {
  const input = prompt(promptText);
  const num = Number(input);
  if (Number.isNaN(num)) return null;
  return num;
}

function main() {
  let cont = true;

  while (cont) {
    displayMenu();
    const choice = prompt('Enter your choice (1-4): ');

    switch (choice) {
      case '1':
        // TOTAL
        {
          const bal = loadBalance();
          console.log('Current balance: ' + bal.toFixed(2));
        }
        break;
      case '2':
        // CREDIT
        {
          const amount = readNumber('Enter credit amount: ');
          if (amount === null || amount <= 0) {
            console.log('Invalid amount');
            break;
          }
          const bal = loadBalance();
          const newBal = bal + amount;
          saveBalance(newBal);
          console.log('Amount credited. New balance: ' + newBal.toFixed(2));
        }
        break;
      case '3':
        // DEBIT
        {
          const amount = readNumber('Enter debit amount: ');
          if (amount === null || amount <= 0) {
            console.log('Invalid amount');
            break;
          }
          const bal = loadBalance();
          if (bal >= amount) {
            const newBal = bal - amount;
            saveBalance(newBal);
            console.log('Amount debited. New balance: ' + newBal.toFixed(2));
          } else {
            console.log('Insufficient funds for this debit.');
          }
        }
        break;
      case '4':
        cont = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
}

// Ensure data file exists with default if missing
(function ensureData() {
  if (!fs.existsSync(DATA_FILE)) {
    saveBalance(1000.0);
  }
})();

if (require.main === module) {
  main();
}

module.exports = { loadBalance, saveBalance };
