import { chromium } from '@playwright/test';
import fs from 'fs';

if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000); // wait for data to load
  await page.screenshot({ path: 'screenshots/dashboard_full.png', fullPage: true });
  await browser.close();
})();
