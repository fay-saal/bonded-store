const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: "new" });
  const page = await browser.newPage();
  await page.setContent(`
    <script type="module">
      import { scroll } from "https://esm.sh/motion";
      scroll(info => {
        console.log('SCROLL INFO:', typeof info, Object.keys(info || {}).join(', '));
      });
    </script>
  `);
  page.on('console', msg => console.log(msg.text()));
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
