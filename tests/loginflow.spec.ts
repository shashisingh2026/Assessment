/* Exercise 1: Automating a Login Flow
Objective:
Validate the login functionality of a sample web application.
Requirements:
1.Open a browser and navigate to  https://www.saucedemo.com/
2.Enter the username as "standard_user" and password as "secret_sauce".
3.Click the Login button.
4.Verify that the user has successfully logged in by checking for the presence of the products page.
5.Take a screenshot after a successful login. 
user name - standard_user, Password-secret_sauce
Assessment Criteria:
Correct usage of Playwright’s selectors and assertions.
Handling navigation and synchronization effectively.
Usage of Playwright’s built-in test runner and reporting features.
Code readability and maintainability.
*/

import { test, expect } from '@playwright/test'
test('Locators', async ({ page }) => {
    //Navigate to the login page 
    await page.goto("https://www.saucedemo.com/")
     //click on user name check box 
    await page.click('id=user-name')
    await page.fill('#user-name', 'standard_user')
    //provide password
    await page.fill('id=password', 'secret_sauce')
    //click on login button
    await page.click('id=login-button')
    //Verufy the header title presence on home page
    //await page.locator(':text("Swag Labs")')
    const headerTitle=await page.locator(':text("Swag Labs")')
    //const headerTitle = await page.locator("//div[@class='app_logo']")
    // verify header title presence
    await expect(headerTitle).toBeVisible();
    //Verify Inventory title url inventory and presence of products
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
    // Validate all 6 products are displayed
    const products = page.locator('.inventory_item');

    // Assertion for product counts
    await expect(products).toHaveCount(6);

    // Validate each product is visible
    for (let i = 0; i < await products.count(); i++) {
        //index-based assertions and products.nth(i) is a Playwright method to target the i-th element in a locator set.
        await expect(products.nth(i)).toBeVisible(); 
    }
   // Screenshot on successful login
    await page.screenshot({
        path: 'screenshots/login-success.png',
        fullPage: true
    });
    
})