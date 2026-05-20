/*Objective:Automate the end-to-end checkout process.
Requirements: 1.Login to https://www.saucedemo.com
user name - standard_user, Password-secret_sauce
2.Add any two productsto the cart.
3.Navigate to the cart and proceed to checkout.
4.Enter First Name, Last Name, and Postal Codein the checkout form.
5.Continue to the next step and verify the order summary.
6.Click the Finishbutton and validate the order confirmation message.
7.Logout from the application.  */

import { test, expect } from '@playwright/test';

test('Complete purchase flow: Add products, checkout, and verify order', async ({ page }) => {
    // Navigate to login page and login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Put explicit wait for network idle to ensure page is fully loaded
    await page.waitForLoadState('networkidle');
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
    
    // Put explicit wait after navigation
    await page.waitForLoadState('networkidle');

    // Verify both selected products are present in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(page.locator('.inventory_item_name'))
        .toContainText([firstProduct, secondProduct]);
    
    // Click on checkout
    await page.click('#checkout');
    
    // Put explicit wait after navigation
    await page.waitForLoadState('networkidle');
    
    // Validate page title element
    const pageTitle = page.locator('.title');
    await expect(pageTitle).toHaveText('Checkout: Your Information');
    
    // Enter First Name, Last Name, and Postal Code in the checkout form
    await page.fill('#first-name', 'Tom');
    await page.fill('#last-name', 'Walter');
    await page.fill('#postal-code', '123321');
    
    // Click the Continue button
    await page.click('#continue');
    
    //  put explicit wait after navigation
    await page.waitForLoadState('networkidle');
    
    // Validate the order summary screen
    await expect(page.locator('.inventory_item_name'))
        .toContainText([firstProduct, secondProduct]);
    
    // Click on Finish button
    await page.click('#finish');
    
    // put explicit wait after final submission
    await page.waitForLoadState('networkidle');
    
    //Verify user is on the checkout complete page
    await expect(page).toHaveURL(/checkout-complete/);

    // Verify order completion by checking for success message
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    
    //Verify user is on the checkout complete page
    await expect(page).toHaveURL(/checkout-complete/);

    //Click on Hambeurger menu in order to view logout 
     await page.locator(':text("Open Menu")').click();
     
    //logout from the application
    await page.getByText('Logout').click();
    
});