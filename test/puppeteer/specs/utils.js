const DEFAULT_SCREENSHOT_DIR = 'test/puppeteer/screenshots/tmp/'
// const INTERVAL = 50

export const getScreenshotFn = (SCREENSHOT_DIR = DEFAULT_SCREENSHOT_DIR) => {
  return async ({ page, title }) => {
    await page.screenshot({
      path: `${SCREENSHOT_DIR}${title}.png`,
      fullPage: true
    })
  }
}

export const getContent = async ({ page, $dom }) => {
  const content = await page.evaluate($dom => {
    return $dom.textContent.trim()
  }, $dom)
  return content
}

export const inputForm = async ({ page, text, query }) => {
  // await page.waitFor(INTERVAL)
  await page.focus(query)
  // await page.waitFor(INTERVAL)
  await page.evaluate(query => {
    document.querySelector(query).value = ''
  }, query)
  // await page.waitFor(INTERVAL)
  await page.type(query, text)
  // await page.waitFor(INTERVAL)
}
