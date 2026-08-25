const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  // Log in using mocked credentials (any credentials work in mock mode)
  await page.goto('http://localhost:5173/login');
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'test@test.com');
  await page.type('input[type="password"]', 'password');
  await page.click('button[type="submit"]');

  await page.waitForNavigation();
  
  // Go to a monitor detail page. The mock might have a monitor with ID 1
  await page.goto('http://localhost:5173/monitors/1');
  
  // Wait for the graph toggle buttons
  await page.waitForSelector('button[value="anomaly"]', { timeout: 10000 });
  console.log("Found anomaly toggle");
  
  await page.click('button[value="anomaly"]');
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("Clicked anomaly. Now clicking breakdown.");
  await page.click('button[value="breakdown"]');
  await new Promise(r => setTimeout(r, 1000));
  
  await browser.close();
})();
