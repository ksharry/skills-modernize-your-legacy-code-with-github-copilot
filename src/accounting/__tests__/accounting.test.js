const fs = require('fs');
const path = require('path');

const ACCOUNT_FILE = path.resolve(__dirname, '..', 'account-data.json');
const { loadBalance, saveBalance } = require('../index');

describe('Accounting functions (load/save)', () => {
  let backup = null;

  beforeAll(() => {
    if (fs.existsSync(ACCOUNT_FILE)) {
      backup = fs.readFileSync(ACCOUNT_FILE, 'utf8');
    }
    fs.writeFileSync(ACCOUNT_FILE, JSON.stringify({ balance: 1000.00 }, null, 2));
  });

  afterAll(() => {
    if (backup !== null) {
      fs.writeFileSync(ACCOUNT_FILE, backup);
    } else if (fs.existsSync(ACCOUNT_FILE)) {
      fs.unlinkSync(ACCOUNT_FILE);
    }
  });

  test('loadBalance returns initial 1000.00', () => {
    const bal = loadBalance();
    expect(typeof bal).toBe('number');
    expect(bal).toBeCloseTo(1000.0, 2);
  });

  test('saveBalance updates value and loadBalance reads it', () => {
    saveBalance(123.45);
    const bal = loadBalance();
    expect(bal).toBeCloseTo(123.45, 2);
  });
});
