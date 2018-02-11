import puppeteer from 'puppeteer'
import {
  getScreenshotFn
  // inputForm,
  // getContent
} from '@/../test/puppeteer/specs/utils'

jest.setTimeout(100000)
const screenshot = getScreenshotFn(
  'test/puppeteer/screenshots/components/organisms/WorkSpace/'
)

describe('Map page', () => {
  const url =
    'http://localhost:9001/iframe.html?selectedKind=organisms%2FWorkSpace&selectedStory=view&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel'

  const getCreateButton = async ({ page }) => {
    const $dom = await page.$('.header-buttons button')
    return $dom
  }

  const getFiles = async ({ page }) => {
    const $doms = await page.$$('.file-card')
    return $doms
  }

  const getEditButtons = async ({ $file }) => {
    const $doms = await $file.$$('.button-box button')
    return $doms
  }

  let browser, page
  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 20 })
    page = await browser.newPage()
    await page.setViewport({ width: 800, height: 800 })
    await page.goto(url, { waitUntil: 'networkidle2' })
  })
  afterEach(async () => {
    await browser.close()
  })

  test('Create new file, then delete it', async () => {
    // create new file
    let $createButton = await getCreateButton({ page })
    let $files = await getFiles({ page })
    let fileCount = $files.length
    await screenshot({ page, title: '1.1 before_create' })
    await $createButton.click()
    $files = await getFiles({ page })
    await screenshot({ page, title: '1.2 after_create' })
    expect($files.length).toBe(fileCount + 1)

    // delete the file
    $files = await getFiles({ page })
    fileCount = $files.length
    let $buttons = await getEditButtons({ $file: $files[0] })
    await $buttons[2].click()
    await $buttons[2].click()
    $files = await getFiles({ page })
    await screenshot({ page, title: '1.3 after_delete' })
    expect($files.length).toBe(fileCount - 1)
  })
})
