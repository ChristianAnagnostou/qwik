import { test, expect } from '@playwright/test';

test.describe('context', () => {
  function tests() {
    test('should load', async ({ page }) => {
      const level2State1 = page.locator('.level2-state1');
      const level2State2 = page.locator('.level2-state2');
      const level2SSlot = page.locator('.level2-slot');

      const btnRootIncrement1 = page.locator('.root-increment1');
      const btnRootIncrement2 = page.locator('.root-increment2');
      const btnLevel2Increment = page.locator('.level2-increment3').nth(0);
      const btnLevel2Increment2 = page.locator('.level2-increment3').nth(1);

      expect(await level2State1.allTextContents()).toEqual([
        'ROOT / state1 = 0',
        'ROOT / state1 = 0',
      ]);
      expect(await level2State2.allTextContents()).toEqual([
        'ROOT / state2 = 0',
        'ROOT / state2 = 0',
      ]);
      expect(await level2SSlot.allTextContents()).toEqual(['bar = 0', 'bar = 0']);

      await btnRootIncrement1.click();
      await page.waitForTimeout(100);

      expect(await level2State1.allTextContents()).toEqual([
        'ROOT / state1 = 1',
        'ROOT / state1 = 1',
      ]);
      expect(await level2State2.allTextContents()).toEqual([
        'ROOT / state2 = 0',
        'ROOT / state2 = 0',
      ]);
      expect(await level2SSlot.allTextContents()).toEqual(['bar = 0', 'bar = 0']);
      await btnRootIncrement2.click();
      await page.waitForTimeout(100);

      expect(await level2State1.allTextContents()).toEqual([
        'ROOT / state1 = 1',
        'ROOT / state1 = 1',
      ]);
      expect(await level2State2.allTextContents()).toEqual([
        'ROOT / state2 = 1',
        'ROOT / state2 = 1',
      ]);
      expect(await level2SSlot.allTextContents()).toEqual(['bar = 0', 'bar = 0']);
      await btnLevel2Increment.click();
      await btnLevel2Increment.click();
      await btnLevel2Increment2.click();
      await page.waitForTimeout(100);

      const level3State1 = page.locator('.level3-state1');
      const level3State2 = page.locator('.level3-state2');
      const level3State3 = page.locator('.level3-state3');
      const level3Slot = page.locator('.level3-slot');

      expect(await level2State1.allTextContents()).toEqual([
        'ROOT / state1 = 1',
        'ROOT / state1 = 1',
      ]);
      expect(await level2State2.allTextContents()).toEqual([
        'ROOT / state2 = 1',
        'ROOT / state2 = 1',
      ]);
      expect(await level2SSlot.allTextContents()).toEqual(['bar = 0', 'bar = 0']);

      expect(await level3State1.allTextContents()).toEqual([
        'Level2 / state1 = 0',
        'Level2 / state1 = 0',
        'Level2 / state1 = 0',
      ]);
      expect(await level3State2.allTextContents()).toEqual([
        'ROOT / state2 = 1',
        'ROOT / state2 = 1',
        'ROOT / state2 = 1',
      ]);
      expect(await level3State3.allTextContents()).toEqual([
        'Level2 / state3 = 2',
        'Level2 / state3 = 2',
        'Level2 / state3 = 1',
      ]);
      expect(await level3Slot.allTextContents()).toEqual(['bar = 0', 'bar = 0', 'bar = 0']);
    });

    test('issue 1971', async ({ page }) => {
      const value = page.locator('#issue1971-value');
      await expect(value).toHaveText('Value: hello!');
    });

    test('issue 2087', async ({ page }) => {
      const btn1 = page.locator('#issue2087_btn1');
      const btn2 = page.locator('#issue2087_btn2');
      const rootA = page.locator('#issue2087_symbol_RootA');
      const rootB = page.locator('#issue2087_symbol_RootB');
      const nestedA = page.locator('#issue2087_symbol_NestedA');
      const nestedB = page.locator('#issue2087_symbol_NestedB');

      // Initial state
      await expect(rootA).toHaveText('Symbol RootA, context value: yes');
      await expect(rootB).not.toBeVisible();
      await expect(nestedA).toHaveText('Symbol NestedA, context value: yes');
      await expect(nestedB).not.toBeVisible();

      // Click a
      await btn1.click();
      await expect(rootB).toBeVisible();
      await expect(rootA).toHaveText('Symbol RootA, context value: yes');
      await expect(rootB).toHaveText('Symbol RootB, context value: yes');

      // Click b
      await btn2.click();
      await expect(nestedB).toBeVisible();
      await expect(nestedA).toHaveText('Symbol NestedA, context value: yes');
      await expect(nestedB).toHaveText('Symbol NestedB, context value: yes');
    });

    test('issue 2894', async ({ page }) => {
      const btn = page.locator('#issue2894-button');
      const value = page.locator('#issue2894-value');

      await expect(value).toHaveText('Value: bar');
      await expect(value).not.toBeVisible();

      await btn.click();

      await expect(value).toHaveText('Value: bar');
      await expect(value).toBeVisible();
    });
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/context');
    page.on('pageerror', (err) => expect(err).toEqual(undefined));
  });
  tests();

  test.describe('client rerender', () => {
    test.beforeEach(async ({ page }) => {
      const rerender = page.locator('#btn-rerender');
      await rerender.click();
      await page.waitForTimeout(100);
    });
    tests();
  });
});
