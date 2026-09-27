// Playwright check of the scene flow (run via Playwright MCP browser_run_code_unsafe with filename).
// hero → t12 → scrub → t23 → beach → back to scrub → back to hero; screenshots into tools/shots/.
async (page) => {
  const S = 'C:/nextweb/Miramare/tools/shots/'
  const scene = () => page.evaluate(() => document.querySelector('main').className.replace('app scene-', ''))
  const until = (name, ms = 12000) => page.waitForFunction((n) => document.querySelector('main').className.endsWith(n), name, { timeout: ms })
  const wheel = async (n, dy, gap = 50) => { for (let i = 0; i < n; i++) { await page.mouse.wheel(0, dy); await page.waitForTimeout(gap) } }
  const fails = []
  const expect = async (name, label) => { const s = await scene(); if (s !== name) fails.push(`${label}: expected ${name}, got ${s}`) }

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://localhost:5178')
  await until('hero', 30000); await page.waitForTimeout(1600)
  await page.screenshot({ path: S + '1_hero.png' })
  await page.mouse.move(700, 450)

  await wheel(1, 120); await until('scrub'); await page.waitForTimeout(1000)
  await page.screenshot({ path: S + '2_scrub_start.png' })
  await wheel(12, 100); await page.waitForTimeout(1500)
  await page.screenshot({ path: S + '3_scrub_mid.png' })
  await wheel(30, 100); await page.waitForTimeout(1500)       // reaches the end in one gesture…
  await expect('scrub', 'same gesture must stop at scrub end')
  await page.screenshot({ path: S + '4_scrub_end.png' })
  await wheel(4, 100); await until('beach'); await page.waitForTimeout(1600) // …a new push leaves
  await page.screenshot({ path: S + '5_beach.png' })

  await wheel(1, -120); await until('scrub'); await page.waitForTimeout(900)
  await wheel(45, -100); await page.waitForTimeout(1500)
  await expect('scrub', 'reverse gesture must stop at scrub start')
  await wheel(4, -100); await until('hero')
  await expect('hero', 'back to hero')
  return fails.length ? fails : 'OK: full flow forward and back'
}
