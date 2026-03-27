# Coding Standards

## Page Object Pattern

### Purpose
Page Objects encapsulate UI interactions for a single page or component. Tests call Page Object methods to act on the UI; they do not reach into the DOM directly.

---

### Rules

#### 1. No assertions inside Page Objects
Page Objects must not contain `expect()` calls or any form of verification. Their sole responsibility is to interact with the UI.

```typescript
// ✅ Correct — action only
async register(email: string, displayName: string, password: string): Promise<void> {
  await this.page.getByTestId('email-input').fill(email);
  await this.page.getByTestId('display-name-input').fill(displayName);
  await this.page.getByTestId('password-input').fill(password);
  await this.page.getByRole('button', { name: 'Create Account' }).click();
}

// ❌ Wrong — assertion inside a Page Object
async register(email: string, displayName: string, password: string): Promise<void> {
  await this.page.getByTestId('email-input').fill(email);
  // ...
  await expect(this.page).toHaveURL('/login.html'); // ← not allowed here
}
```

#### 2. Keep all verifications in test files
Every `expect()` call belongs in the test file, not in a Page Object.

```typescript
// ✅ Correct — test file owns all assertions
test('Successful registration redirects to login page', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.register(email, 'Test User', 'Test1234');

  await expect(page).toHaveURL('/login.html');       // ← assertion in the test
  await expect(page).toHaveTitle('Login - Rolnopol');
});
```

#### 3. One class per page or component
Create a dedicated Page Object class for each distinct page or reusable component. Do not merge unrelated pages into a single class.

**File naming:** `<page-name>.page.ts`  
**Location:** `tests/page-objects/`

```
tests/
  page-objects/
    register.page.ts
    login.page.ts
```

#### 4. Expose meaningful action methods
Method names should describe user intent, not implementation details.

```typescript
// ✅ Correct
await registerPage.register(email, name, password);

// ❌ Too low-level — leaks implementation
await registerPage.fillEmailInput(email);
await registerPage.fillDisplayNameInput(name);
await registerPage.fillPasswordInput(password);
await registerPage.clickCreateAccountButton();
```

#### 5. Use the constructor to receive `page`
Accept `Page` from Playwright in the constructor. Mark it `private readonly` to prevent external mutation.

```typescript
export class RegisterPage {
  constructor(private readonly page: Page) {}
}
```

---

### Quick Reference

| Rule | Where |
|---|---|
| UI interactions (fill, click, navigate) | Page Object |
| Assertions (`expect`) | Test file only |
| One class per page | Page Object |
| Meaningful method names | Page Object |
| `page` injected via constructor | Page Object |
