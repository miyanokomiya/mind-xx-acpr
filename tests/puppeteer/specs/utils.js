import * as fs from 'fs'

const SCREENSHOT_DIR_ROOT = 'tests/puppeteer/screenshots/'
const DEFAULT_SCREENSHOT_DIR = 'tmp'

export const getScreenshotFn = (dir = DEFAULT_SCREENSHOT_DIR) => {
  if (process.env.CI) {
    return () => {
      return Promise.resolve()
    }
  }

  const fullPath = SCREENSHOT_DIR_ROOT + dir
  // delete the directory
  if (fs.existsSync(fullPath)) {
    const targetRemoveFiles = fs.readdirSync(fullPath)
    for (let file in targetRemoveFiles) {
      fs.unlinkSync(fullPath + targetRemoveFiles[file])
    }
    fs.rmdirSync(fullPath)
  }
  // create directory
  fs.mkdirSync(fullPath, { recursive: true })
  // return the function to take a screenshot
  return async ({ page, title }) => {
    await page.screenshot({
      path: `${fullPath}${title}.png`,
      fullPage: true,
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
