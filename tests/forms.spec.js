const { test, expect } = require('@playwright/test');

// ===========================================================================
// 1. TESTER REGISTRATION FORM (testers.html)
// ===========================================================================

test.describe('Tester Registration Form (testers.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/testers.html');
  });

  test('page loads and form is visible', async ({ page }) => {
    await expect(page.locator('form#testerForm')).toBeVisible();
    await expect(page.locator('input[name="first_name"]')).toBeVisible();
  });

  test('all required fields are present', async ({ page }) => {
    const requiredFields = [
      'input[name="first_name"]',
      'input[name="last_name"]',
      'input[name="email"]',
      'input[name="phone"]',
      'select[name="age_range"]',
      'select[name="country"]',
    ];
    for (const selector of requiredFields) {
      await expect(page.locator(selector)).toBeVisible();
    }
  });

  test('participation type radio buttons exist', async ({ page }) => {
    const radios = page.locator('input[name="participation_type"]');
    await expect(radios).toHaveCount(3);
  });

  test('age range dropdown has all options', async ({ page }) => {
    const options = page.locator('select[name="age_range"] option');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(6); // placeholder + 5-6 age ranges
  });

  test('form prevents submission without required fields', async ({ page }) => {
    // Try clicking submit without filling anything
    const submitBtn = page.locator('form#testerForm button[type="submit"], form#testerForm input[type="submit"]').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      // Should still be on the same page (form validation prevented submission)
      await expect(page).toHaveURL(/testers/);
    }
  });

  test('email field validates email format', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill('not-an-email');
    const validity = await emailInput.evaluate(el => el.validity.typeMismatch);
    expect(validity).toBe(true);
  });

  test('email field accepts valid email', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill('test@example.com');
    const validity = await emailInput.evaluate(el => el.validity.typeMismatch);
    expect(validity).toBe(false);
  });

  test('gender dropdown has expected options', async ({ page }) => {
    const genderSelect = page.locator('select[name="gender"]');
    if (await genderSelect.count() > 0) {
      const options = await genderSelect.locator('option').allTextContents();
      expect(options.length).toBeGreaterThanOrEqual(3);
    }
  });

  test('country dropdown has Netherlands as option', async ({ page }) => {
    const countrySelect = page.locator('select[name="country"]');
    const nlOption = countrySelect.locator('option[value="Netherlands"], option:has-text("Netherlands")');
    await expect(nlOption.first()).toBeAttached();
  });

  test('Netlify form attribute is set', async ({ page }) => {
    const form = page.locator('form#testerForm');
    // Netlify strips data-netlify at deploy time, so check form has name (required for Netlify)
    const name = await form.getAttribute('name');
    expect(name).toBeTruthy();
  });

  test('form has correct name attribute for Netlify', async ({ page }) => {
    const form = page.locator('form#testerForm');
    const name = await form.getAttribute('name');
    expect(name).toBeTruthy();
  });
});

// ===========================================================================
// 2. PROTEIN COMMUNITY PILOT FORM (request_pilot.html)
// ===========================================================================

test.describe('Protein Community Pilot Form (request_pilot.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/request_pilot.html');
  });

  test('page loads and form is visible', async ({ page }) => {
    await expect(page.locator('form#contactForm')).toBeVisible();
  });

  test('all required text fields are present', async ({ page }) => {
    for (const name of ['First_Name', 'Last_Name', 'Email', 'Company', 'City', 'Country']) {
      await expect(page.locator(`input[name="${name}"]`)).toBeVisible();
    }
  });

  test('product type checkboxes exist', async ({ page }) => {
    const checkboxes = page.locator('input[name="Product_Type"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('consumer target radio buttons exist', async ({ page }) => {
    const radios = page.locator('input[name="Consumer_Target"]');
    const count = await radios.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('launch date radio buttons exist', async ({ page }) => {
    const radios = page.locator('input[name="Launch_Date"]');
    const count = await radios.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('additional comments textarea exists', async ({ page }) => {
    await expect(page.locator('textarea[name="Additional_Comments"]')).toBeVisible();
  });

  test('email field validates format', async ({ page }) => {
    const emailInput = page.locator('input[name="Email"]');
    await emailInput.fill('bad-email');
    const validity = await emailInput.evaluate(el => el.validity.typeMismatch);
    expect(validity).toBe(true);
  });

  test('Netlify form attribute is set', async ({ page }) => {
    const form = page.locator('form#contactForm');
    // Netlify strips data-netlify at deploy time, so check form has name (required for Netlify)
    const name = await form.getAttribute('name');
    expect(name).toBeTruthy();
  });
});

// ===========================================================================
// 3. FREE TEST REQUEST FORM (request-test.html)
// ===========================================================================

test.describe('Free Test Request Form (request-test.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/request-test.html');
  });

  test('page loads and form is visible', async ({ page }) => {
    await expect(page.locator('form#contactForm')).toBeVisible();
  });

  test('all required text fields are present', async ({ page }) => {
    for (const name of ['First_Name', 'Last_Name', 'Email', 'Company', 'City', 'Country']) {
      await expect(page.locator(`input[name="${name}"]`)).toBeVisible();
    }
  });

  test('product type checkboxes exist', async ({ page }) => {
    const checkboxes = page.locator('input[name="Product_Type"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('test focus checkboxes exist', async ({ page }) => {
    const checkboxes = page.locator('input[name="Test_Focus"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('additional comments textarea exists', async ({ page }) => {
    await expect(page.locator('textarea[name="Additional_Comments"]')).toBeVisible();
  });

  test('Netlify form attribute is set', async ({ page }) => {
    const form = page.locator('form#contactForm');
    // Netlify strips data-netlify at deploy time, so check form has name (required for Netlify)
    const name = await form.getAttribute('name');
    expect(name).toBeTruthy();
  });
});

// ===========================================================================
// 4. RESEARCH CONTACT FORM (research.html)
// ===========================================================================

test.describe('Research Contact Form (research.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/research.html');
  });

  test('page loads and form is visible', async ({ page }) => {
    const form = page.locator('form[action*="formspree"]');
    await expect(form).toBeVisible();
  });

  test('name and email fields are present', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('message textarea is present', async ({ page }) => {
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('form action points to Formspree', async ({ page }) => {
    const form = page.locator('form[action*="formspree"]');
    const action = await form.getAttribute('action');
    expect(action).toContain('formspree.io');
  });

  test('hidden subject field is set', async ({ page }) => {
    const subject = page.locator('input[name="_subject"]');
    if (await subject.count() > 0) {
      const value = await subject.getAttribute('value');
      expect(value).toBeTruthy();
    }
  });

  test('honeypot field exists for spam prevention', async ({ page }) => {
    const honeypot = page.locator('input[name="_gotcha"]');
    if (await honeypot.count() > 0) {
      await expect(honeypot).toBeHidden();
    }
  });
});

// ===========================================================================
// 5. DATA DELETION REQUEST FORM (data-deletion.html)
// ===========================================================================

test.describe('Data Deletion Request Form (data-deletion.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-deletion.html');
  });

  test('page loads and form is visible', async ({ page }) => {
    const form = page.locator('form[name="data-deletion-request"]');
    await expect(form).toBeVisible();
  });

  test('required fields are present', async ({ page }) => {
    // Field names may vary - check for common patterns
    const nameField = page.locator('input[name="Full_Name"], input[name="full_name"], input[name="name"]').first();
    const emailField = page.locator('input[name="Email"], input[name="email"]').first();
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
  });

  test('deletion type checkboxes exist', async ({ page }) => {
    const deleteVideos = page.locator('input[name="Delete_Videos"]');
    const deleteAudio = page.locator('input[name="Delete_Audio"]');
    const deletePersonal = page.locator('input[name="Delete_Personal"]');
    const deleteAll = page.locator('input[name="Delete_All"]');

    // At least some of these should exist
    const total = await deleteVideos.count() + await deleteAudio.count() +
                  await deletePersonal.count() + await deleteAll.count();
    expect(total).toBeGreaterThanOrEqual(2);
  });

  test('Netlify form attribute is set', async ({ page }) => {
    const form = page.locator('form[name="data-deletion-request"]');
    // Netlify strips data-netlify at deploy time, so check form has name (required for Netlify)
    const name = await form.getAttribute('name');
    expect(name).toBeTruthy();
  });

  test('honeypot field for spam prevention', async ({ page }) => {
    const honeypot = page.locator('[data-netlify-honeypot]');
    if (await honeypot.count() > 0) {
      // Honeypot attribute should be on the form
      const form = page.locator('form[name="data-deletion-request"]');
      const hp = await form.getAttribute('data-netlify-honeypot');
      expect(hp).toBeTruthy();
    }
  });
});

// ===========================================================================
// 6. DOMUS INSTRUCTIONS FORM (domus_instructions.html)
// ===========================================================================

test.describe('Domus Instructions Registration Form (domus_instructions.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/domus_instructions.html', { timeout: 10000 });
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/domus_instructions/);
  });

  test('form fields exist in DOM (initially hidden behind registration step)', async ({ page }) => {
    // The form fields exist but are hidden until user clicks "Register" or similar
    const tokenInput = page.locator('input#studyToken');
    const nameInput = page.locator('input#participantName');
    const emailInput = page.locator('input#participantEmail');

    // Check they exist in the DOM (even if hidden)
    await expect(tokenInput).toBeAttached();
    await expect(nameInput).toBeAttached();
    await expect(emailInput).toBeAttached();
  });

  test('email field has correct type attribute', async ({ page }) => {
    const emailInput = page.locator('input#participantEmail');
    const type = await emailInput.getAttribute('type');
    expect(type).toBe('email');
  });

  test('study token field has required attribute', async ({ page }) => {
    const tokenInput = page.locator('input#studyToken');
    const required = await tokenInput.getAttribute('required');
    expect(required).not.toBeNull();
  });
});

// ===========================================================================
// 7. CROSS-FORM CONSISTENCY CHECKS
// ===========================================================================

test.describe('Cross-form consistency checks', () => {

  test('all Netlify forms have name attribute', async ({ page }) => {
    for (const path of ['/testers.html', '/request_pilot.html', '/request-test.html', '/data-deletion.html']) {
      await page.goto(path);
      const forms = page.locator('form[data-netlify="true"]');
      const count = await forms.count();
      for (let i = 0; i < count; i++) {
        const name = await forms.nth(i).getAttribute('name');
        expect(name, `Form on ${path} missing name attribute`).toBeTruthy();
      }
    }
  });

  test('all forms with email fields have correct type', async ({ page }) => {
    for (const path of ['/testers.html', '/request_pilot.html', '/request-test.html', '/research.html', '/data-deletion.html', '/domus_instructions.html']) {
      await page.goto(path);
      const emailInputs = page.locator('input[name*="mail" i], input[name*="email" i]');
      const count = await emailInputs.count();
      for (let i = 0; i < count; i++) {
        const type = await emailInputs.nth(i).getAttribute('type');
        expect(type, `Email input on ${path} should be type="email"`).toBe('email');
      }
    }
  });

  test('no form has action pointing to localhost', async ({ page }) => {
    for (const path of ['/testers.html', '/request_pilot.html', '/request-test.html', '/research.html', '/data-deletion.html']) {
      await page.goto(path);
      const forms = page.locator('form[action]');
      const count = await forms.count();
      for (let i = 0; i < count; i++) {
        const action = await forms.nth(i).getAttribute('action');
        expect(action, `Form on ${path} has localhost action`).not.toContain('localhost');
      }
    }
  });

  test('all pages load without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    for (const path of ['/testers.html', '/request_pilot.html', '/request-test.html', '/research.html', '/data-deletion.html', '/domus_instructions.html']) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
    }

    // Filter out known third-party errors (analytics, fonts, 404 resources, etc.)
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('analytics') &&
      !e.includes('google') &&
      !e.includes('net::ERR') &&
      !e.includes('404') &&
      !e.includes('Failed to load resource')
    );

    expect(criticalErrors.length, `Console errors found: ${criticalErrors.join('; ')}`).toBe(0);
  });
});

// ===========================================================================
// 8. FORM ACCESSIBILITY CHECKS
// ===========================================================================

test.describe('Form accessibility', () => {

  test('tester form inputs have labels or aria-labels', async ({ page }) => {
    await page.goto('/testers.html');
    const inputs = page.locator('form#testerForm input[required], form#testerForm select[required]');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      const name = await input.getAttribute('name');

      // Input should have at least one of: associated label, aria-label, placeholder, or be wrapped in a label
      let hasLabel = false;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = await label.count() > 0;
      }
      // Check if input is wrapped inside a <label> element
      const wrappedInLabel = await input.evaluate(el => !!el.closest('label'));

      const isAccessible = hasLabel || wrappedInLabel || !!ariaLabel || !!placeholder;
      expect(isAccessible, `Input "${name || id}" on testers.html lacks accessible label`).toBe(true);
    }
  });

  test('submit buttons have accessible text', async ({ page }) => {
    for (const path of ['/testers.html', '/request_pilot.html', '/request-test.html']) {
      await page.goto(path);
      const submitBtns = page.locator('form button[type="submit"], form input[type="submit"]');
      const count = await submitBtns.count();

      for (let i = 0; i < count; i++) {
        const btn = submitBtns.nth(i);
        const text = await btn.textContent();
        const value = await btn.getAttribute('value');
        const ariaLabel = await btn.getAttribute('aria-label');

        const hasLabel = (text && text.trim().length > 0) || !!value || !!ariaLabel;
        expect(hasLabel, `Submit button on ${path} lacks accessible text`).toBe(true);
      }
    }
  });
});
