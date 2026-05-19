/*Objective:Automate adding and removing items from the cart in an e-commerce application.

Requirements:1.Open a browser and navigate to https://www.saucedemo.com/.
2.Login using "standard_user" / "secret_sauce".
user name - standard_user, Password-secret_sauce
3.Add any two products to the cart.
4.Navigate to the cart and validate that the selected products are present.
5.Remove one product and validate that only one remains.
6.Logout of the application.
Assessment Criteria:
Ability to handle elements dynamically (product selection, cart validation).
Effective use of Playwright’s locator strategies.
Assertions to validate expected vs actual outcomes.
Proper handling of waits and navigation */

import { test, expect } from '@playwright/test';

test('Add and remove specific products using filtering logic', async ({ page }) => {
    // Navigate to login page and login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);

    // Two product names to add into cart
    const firstProduct = 'Sauce Labs Backpack';
    const secondProduct = 'Sauce Labs Bike Light';

    // Add first product to cart using filtering logic
    await page.locator('.inventory_item')
        .filter({ hasText: firstProduct })
        .getByRole('button', { name: 'Add to cart' })
        .click();

    // Add second product to cart using filtering logic
    await page.locator('.inventory_item')
        .filter({ hasText: secondProduct })
        .getByRole('button', { name: 'Add to cart' })
        .click();

    // Validate cart badge count
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Navigate to cart page
    await page.click('.shopping_cart_link');

    // Verify both selected products are present in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(page.locator('.inventory_item_name'))
        .toContainText([firstProduct, secondProduct]);

    // Remove one product from cart using filtering logic
    await page.locator('.cart_item')
        .filter({ hasText: firstProduct })
        .getByRole('button', { name: 'Remove' })
        .click();

    // Validate only one product remains
    await expect(cartItems).toHaveCount(1);
    await expect(page.locator('.inventory_item_name'))
        .toHaveText(secondProduct);

    // Validate remaining product is correct
    await expect(page.locator('.inventory_item_name'))
        .toHaveText(secondProduct);

    // Navigate back to inventory page
    await page.click('#continue-shopping');

    // Open hamburger menu
    await page.click('#react-burger-menu-btn');

    // Wait for logout link to be visible
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();

    // Logout from application
    await page.click('#logout_sidebar_link');

    // Verify user is redirected to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('#login-button')).toBeVisible();

    // Optionally, capture screenshot after logout
    await page.screenshot({
        path: 'screenshots/cart-remove-and-logout.png',
        fullPage: true
     });
})