const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message, '\n', error.stack));
  
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
