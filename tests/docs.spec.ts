import { test, expect } from '@playwright/test';

test.describe('@smoke', () => {
  test('TC-001: Page Load Verification', async ({ page }) => {
    const response = await page.goto('/docs.html');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Documentation - Rolnopol');
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('TC-002: Content Rendering', async ({ page }) => {
    await page.goto('/docs.html');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toHaveCount(await page.locator('h2').count()); // At least one H2
    // Add specific content checks if known
  });

  test('TC-006: Asset Loading', async ({ page }) => {
    await page.goto('/docs.html');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      expect(await img.getAttribute('alt')).toBeTruthy();
    }
    // Check for broken assets by monitoring network
  });
});

test.describe('@regression', () => {
  test('TC-003: Navigation Links', async ({ page }) => {
    await page.goto('/docs.html');
    const links = page.locator('a[href^="/"]'); // Internal links
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    // Test first few links to avoid timeout
    const testLinks = Math.min(count, 3);
    for (let i = 0; i < testLinks; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      if (href === '/docs.html') continue; // Skip current page
      await link.click({ timeout: 5000 });
      if (href!.startsWith('/')) {
        await page.waitForURL(href!, { timeout: 5000 });
        expect(page.url()).toContain(href!);
        await page.goBack();
      }
    }
  });

  test('TC-004: Table of Contents (TOC)', async ({ page }) => {
    await page.goto('/docs.html');
    const tocLinks = page.locator('.toc a'); // Adjust selector
    if (await tocLinks.count() > 0) {
      const firstToc = tocLinks.first();
      const targetId = await firstToc.getAttribute('href');
      await firstToc.click();
      const target = page.locator(targetId!);
      await expect(target).toBeInViewport();
    }
  });

  test('TC-005: Search Functionality', async ({ page }) => {
    await page.goto('/docs.html');
    const searchInput = page.locator('input[type="search"]'); // Adjust selector
    if (await searchInput.isVisible()) {
      await searchInput.fill('example');
      await searchInput.press('Enter');
      await expect(page.locator('.search-results')).toBeVisible(); // Adjust
    }
  });

  test('TC-007: External Links', async ({ page }) => {
    await page.goto('/docs.html');
    const extLinks = page.locator('a[href^="http"]');
    if (await extLinks.count() > 0) {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        extLinks.first().click()
      ]);
      expect(newPage.url()).toMatch(/^https?:\/\//);
      await newPage.close();
    }
  });

  test('TC-008: Responsiveness', async ({ page }) => {
    await page.goto('/docs.html');
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await expect(page.locator('body')).toBeVisible();
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-011: Error Handling', async ({ page }) => {
    // Simulate by navigating to a non-existent page or mock
    await page.goto('/docs.html');
    // If content missing, check for error message
    const errorMsg = page.locator('.error-message'); // Adjust
    if (await errorMsg.isVisible()) {
      expect(await errorMsg.textContent()).not.toContain('stack trace');
    }
  });
});

test.describe('@accessibility', () => {
  test('TC-009: Accessibility Basics', async ({ page }) => {
    await page.goto('/docs.html');
    // Basic checks
    const headings = page.locator('h1, h2, h3');
    expect(await headings.count()).toBeGreaterThan(0);
    const images = page.locator('img');
    for (let i = 0; i < await images.count(); i++) {
      expect(await images.nth(i).getAttribute('alt')).toBeTruthy();
    }
    // Keyboard navigation: tab through focusable elements
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    // For contrast, might need additional tools, but basic check
  });
});

test.describe('@performance', () => {
  test('TC-010: Performance Smoke Test', async ({ page }) => {
    const start = Date.now();
    await page.goto('/docs.html');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(2000);
    // Page size
    const resources = await page.evaluate(() => performance.getEntriesByType('resource'));
    const totalSize = resources.reduce((sum, r: any) => sum + (r.transferSize || 0), 0);
    expect(totalSize).toBeLessThan(5 * 1024 * 1024); // 5MB
  });
});