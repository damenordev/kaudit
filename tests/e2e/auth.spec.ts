import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show sign in page', async ({ page }) => {
    await page.goto('/signin')
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible()
  })

  test('should show sign up page', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: /crear cuenta/i })).toBeVisible()
  })

  test('should redirect to signin when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/signin/)
  })
})
