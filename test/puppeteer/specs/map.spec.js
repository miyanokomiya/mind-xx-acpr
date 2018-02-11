const puppeteer = require('puppeteer')
jest.setTimeout(100000)
const INTERVAL = 500
const SCREENSHOT_DIR = 'test/puppeteer/screenshots/'

const screenshot = async ({ page, title }) => {
  await page.screenshot({
    path: `${SCREENSHOT_DIR}${title}.png`,
    fullPage: true
  })
  await page.waitFor(INTERVAL)
}

describe('Open map page', () => {
  const url = 'http://localhost:8080/map/-L1kwty1260tXvUgU0Bp'

  const selectNode = async ({ page, $node, clear = false }) => {
    const box = await page.evaluate($node => {
      const box = $node.getBoundingClientRect()
      return {
        top: box.top,
        left: box.left
      }
    }, $node)
    // clear select
    await page.mouse.move(box.left - 1, box.top + 1)
    await page.mouse.down()
    await page.mouse.up()
    await page.waitFor(INTERVAL)
    // select
    if (!clear) {
      await page.mouse.move(box.left + 2, box.top + 2)
      await page.mouse.down()
      await page.mouse.up()
      await page.waitFor(INTERVAL)
    }
  }

  const getNodes = async ({ page }) => {
    const $nodes = await page.$$('g.mind-node:not(.moving-copy)')
    return $nodes
  }

  const getButtons = async ({ page }) => {
    const $buttons = await page.$$('.float-button-wrapper')
    return $buttons
  }

  const getToggleCloseButton = async ({ page }) => {
    const $button = await page.$('.toggle-close-button-wrapper')
    return $button
  }

  const getContent = async ({ page, $dom }) => {
    const content = await page.evaluate($dom => {
      return $dom.textContent.trim()
    }, $dom)
    return content
  }

  const inputAndSubmit = async ({ page, text }) => {
    const textareaQ = '.float-text-input-wrapper textarea'
    await page.evaluate(textareaQ => {
      document.querySelector(textareaQ).value = ''
    }, textareaQ)
    await page.waitFor(INTERVAL)
    await page.type(textareaQ, text)
    await page.waitFor(INTERVAL)
    await page.click('.float-text-input-wrapper .submit')
    await page.waitFor(INTERVAL)
  }

  const clearNodes = async ({ page }) => {
    await page.waitFor(1000)
    let $nodes = await getNodes({ page })
    await selectNode({ page, $node: $nodes[0] })
    let $buttons = await getButtons({ page })
    await $buttons[0].click()
    await $buttons[0].click()
    await selectNode({ page, $node: $nodes[0], clear: true })
    await page.waitFor(1000)
  }

  describe('Edit nodes', async () => {
    let browser, page
    beforeEach(async () => {
      browser = await puppeteer.launch({ headless: false })
      page = await browser.newPage()
      await page.setViewport({ width: 800, height: 800 })
      await page.goto(url)
      await page.waitFor(3000)
      // clear nodes
      await clearNodes({ page })
    })
    afterEach(async () => {
      // clear nodes
      await clearNodes({ page })
      browser.close()
    })

    test('Edit text of the root node, then try to delete it.', async () => {
      let $nodes = await getNodes({ page })
      expect($nodes.length).toBe(1)
      await selectNode({ page, $node: $nodes[0] })
      let $buttons = await getButtons({ page })
      await screenshot({ page, title: '1.1 show_menus' })
      expect($buttons.length).toBe(4)
      $buttons[1].click()

      // edit text
      await page.waitFor(INTERVAL)
      await inputAndSubmit({ page, text: 'E2E test' })
      $nodes = await getNodes({ page })
      let $text = await $nodes[0].$('text')
      let textContent = await getContent({ page, $dom: $text })
      await screenshot({ page, title: '1.2 edit_text' })
      expect(textContent).toBe('E2E test')

      // try to delete the root but cannot delete it
      await page.waitFor(INTERVAL)
      await clearNodes({ page })
      $nodes = await getNodes({ page })
      expect($nodes.length).toBe(1)
      $text = await $nodes[0].$('text')
      await screenshot({ page, title: '1.3 delete_root' })
      textContent = await getContent({ page, $dom: $text })
      expect(textContent).toBe('-XXACPR-')
    })

    test('Create child node, then edit text of it, then delete it.', async () => {
      // show buttons
      let $nodes = await getNodes({ page })
      await selectNode({ page, $node: $nodes[0] })
      let $buttons = await getButtons({ page })
      expect($buttons.length).toBe(4)

      // create child node
      const createChildButton = $buttons[$buttons.length - 1]
      await page.waitFor(INTERVAL)
      await createChildButton.click()
      await page.waitFor(INTERVAL)

      // edit text
      await inputAndSubmit({ page, text: 'new child' })
      $nodes = await getNodes({ page })
      const $text = await $nodes[1].$('text')
      const textContent = await getContent({ page, $dom: $text })
      await screenshot({ page, title: '2.1 create_child' })
      expect(textContent).toBe('new child')

      // delete the new node
      $buttons = await getButtons({ page })
      const deleteButton = $buttons[0]
      await deleteButton.click()
      await page.waitFor(INTERVAL)
      await deleteButton.click()
      await page.waitFor(INTERVAL)
      $nodes = await getNodes({ page })
      await screenshot({ page, title: '2.2 delete_child' })
      expect($nodes.length).toBe(1)
    })

    test('Create child node, then create a brother of it, then create child of it.', async () => {
      // show buttons
      let $nodes = await getNodes({ page })
      await selectNode({ page, $node: $nodes[0] })

      // create child node
      let $buttons = await getButtons({ page })
      let createChildButton = $buttons[$buttons.length - 1]
      await page.waitFor(INTERVAL)
      await createChildButton.click()
      await page.waitFor(INTERVAL)
      $nodes = await getNodes({ page })
      expect($nodes.length).toBe(2)

      // create brother node
      await page.waitFor(INTERVAL)
      $nodes = await getNodes({ page })
      await selectNode({ page, $node: $nodes[1] })
      $buttons = await getButtons({ page })
      const createBrotherButton = $buttons[$buttons.length - 2]
      await page.waitFor(INTERVAL)
      await screenshot({ page, title: '3.1 buttons' })
      expect($buttons.length).toBe(5)
      await createBrotherButton.click()
      await page.waitFor(INTERVAL)
      await screenshot({ page, title: '3.2 create_brother' })
      $nodes = await getNodes({ page })
      expect($nodes.length).toBe(3)

      // create child node
      await page.waitFor(INTERVAL)
      $nodes = await getNodes({ page })
      await selectNode({ page, $node: $nodes[2] })
      $buttons = await getButtons({ page })
      createChildButton = $buttons[$buttons.length - 1]
      await page.waitFor(INTERVAL)
      expect($buttons.length).toBe(5)
      await createChildButton.click()
      await page.waitFor(INTERVAL)
      await screenshot({ page, title: '3.3 create_child' })
      $nodes = await getNodes({ page })
      expect($nodes.length).toBe(4)

      // close children
      await page.waitFor(INTERVAL)
      $nodes = await getNodes({ page })
      await selectNode({ page, $node: $nodes[2] })
      await page.waitFor(INTERVAL)
      let toggleCloseButton = await getToggleCloseButton({ page })
      await toggleCloseButton.click()
      await page.waitFor(INTERVAL)
      await screenshot({ page, title: '3.4 close_children' })
      $nodes = await getNodes({ page })
      expect($nodes.length).toBe(3)

      // open children
      await page.waitFor(INTERVAL)
      $nodes = await getNodes({ page })
      await selectNode({ page, $node: $nodes[2] })
      await page.waitFor(INTERVAL)
      toggleCloseButton = await getToggleCloseButton({ page })
      await toggleCloseButton.click()
      await page.waitFor(INTERVAL)
      await screenshot({ page, title: '3.5 open_children' })
      $nodes = await getNodes({ page })
      expect($nodes.length).toBe(4)
    })
  })
})
