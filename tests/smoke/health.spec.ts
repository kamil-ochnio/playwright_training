import { test, expect } from '@playwright/test';

test.describe('Smoke: Health', () => {
  test('health endpoint returns success', async ({ request }) => {
    const response = await request.get('/docs.html');
    expect(response.status()).toBeLessThan(400);
  });
});
