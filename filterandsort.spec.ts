/*Objective:Validate the sorting functionality of the products page.
Requirements:
1.Login to https://www.saucedemo.com/   using "standard_user" and "secret_sauce".
2.Select the All sorting dropdown and select all sorting option one by one.
3.Select the sorting dropdown .product_sort_container) and sort products by Price (low to high).
4.Verify that the products are sorted correctly by checking their displayed prices.
5.Take a screenshot after sorting.
5.Logout from the application.
Assessment Criteria:
Handling dropdown selection.
Extracting and validating price values.
Using assertions to verify correct sorting.
Taking a screenshot for validation

Objective: Validate product sorting functionality
*/

import { test, expect } from '@playwright/test';

test('Validate product sorting', async ({ page }) => {

  // Login
  await page.goto('https://www.saucedemo.com/');

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Verify login
  await expect(page).toHaveURL(/inventory/);

  // Sorting dropdown
  const sortDropdown = page.locator('.product_sort_container');

  await expect(sortDropdown).toBeVisible();

  // Select all sorting options one by one
  const sortingOptions = ['az', 'za', 'lohi', 'hilo'];

  for (const option of sortingOptions) {
    await sortDropdown.selectOption(option);
    await page.waitForTimeout(500);
  }
  // LOW TO HIGH VALIDATION

  await sortDropdown.selectOption('lohi');

  const lowToHighText = await page
    .locator('.inventory_item_price')
    .allTextContents();

  const lowToHighPrices = lowToHighText.map(price =>
    parseFloat(price.replace('$', ''))
  );

  console.log('Low to High Prices:', lowToHighPrices);

  // Verify ascending order
  for (let i = 0; i < lowToHighPrices.length - 1; i++) {
    expect(lowToHighPrices[i]).toBeLessThanOrEqual(
      lowToHighPrices[i + 1]
    );
  }
  // HIGH TO LOW VALIDATION
  await sortDropdown.selectOption('hilo');

  const highToLowText = await page
    .locator('.inventory_item_price')
    .allTextContents();

  const highToLowPrices = highToLowText.map(price =>
    parseFloat(price.replace('$', ''))
  );

  // Print high to low prices
  console.log('High to Low Prices:', highToLowPrices);
 // Verify descending order
  for (let i = 0; i < highToLowPrices.length - 1; i++) {
    expect(highToLowPrices[i]).toBeGreaterThanOrEqual(
      highToLowPrices[i + 1]
    );
  }

  // Screenshot
  await page.screenshot({
     path: 'screenshots/sorting-validation.png',
   //  path: 'sorting-validation.png',
     fullPage: true
  });

  // Click on hamburger and Logout
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');

  // Verify logout
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});