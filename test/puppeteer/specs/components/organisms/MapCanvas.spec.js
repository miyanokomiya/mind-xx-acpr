import puppeteer from 'puppeteer'
import { getScreenshotFn, inputForm, getContent } from '@/specs/utils'

jest.setTimeout(100000)
const screenshot = getScreenshotFn(
  'test/puppeteer/screenshots/components/organisms/MapCanvas/'
)

const url =
  'http://localhost:9001/iframe.html?selectedKind=organisms%2FMapCanvas&selectedStory=some%20nodes'

const selectNode = async ({ page, $node, clear = false }) => {
  await page.keyboard.press('Escape')

  const box = await page.evaluate($node => {
    const box = $node.getBoundingClientRect()
    return {
      top: box.top,
      left: box.left
    }
  }, $node)
  // clear select
  await page.mouse.move(box.left - 3, box.top + 3)
  await page.mouse.down()
  await page.mouse.up()

  // select
  if (!clear) {
    await page.mouse.move(box.left + 2, box.top + 2)
    await page.mouse.down()
    await page.mouse.up()
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

const getComments = async ({ page }) => {
  const $doms = await page.$$('.comment-list > ul > li')
  return $doms
}

const inputAndSubmit = async ({ page, text }) => {
  await inputForm({ page, text, query: '.float-text-input-wrapper textarea' })
  await page.click('.float-text-input-wrapper .submit')
}

const inputAndSubmitComment = async ({ page, text }) => {
  await inputForm({ page, text, query: '.comment-list form textarea' })
  await page.click('.comment-list form button')
}

const inputComment = async ({ page, text }) => {
  await inputForm({ page, text, query: '.comment-list form textarea' })
}

const editComment = async ({ page }) => {
  const $buttons = await page.$$('.comment-list form button')
  await $buttons[2].click()
}

const cancelEditComment = async ({ page }) => {
  const $buttons = await page.$$('.comment-list form button')
  await $buttons[1].click()
}

const deleteComment = async ({ page }) => {
  const $buttons = await page.$$('.comment-list form button')
  await $buttons[0].click()

  await $buttons[0].click()
}

const clearNodes = async ({ page }) => {
  let $nodes = await getNodes({ page })
  await selectNode({ page, $node: $nodes[0] })
  let $buttons = await getButtons({ page })
  await $buttons[0].click()
  await $buttons[0].click()
  await selectNode({ page, $node: $nodes[0], clear: true })
}

describe('Edit nodes', async () => {
  let browser, page
  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 20 })
    page = await browser.newPage()
    await page.setViewport({ width: 800, height: 800 })
    await page.goto(url, { waitUntil: 'networkidle2' })
    // clear nodes
    await clearNodes({ page })
  })
  afterEach(async () => {
    await browser.close()
  })

  test('Edit text of the root node, then try to delete it.', async () => {
    let $nodes = await getNodes({ page })
    expect($nodes.length).toBe(1)
    await selectNode({ page, $node: $nodes[0] })
    let $buttons = await getButtons({ page })
    await screenshot({ page, title: '1.1 show_menus' })
    expect($buttons.length).toBe(4)
    await $buttons[1].click()

    // edit text

    await inputAndSubmit({ page, text: 'E2E test' })
    $nodes = await getNodes({ page })
    let $text = await $nodes[0].$('text')
    let textContent = await getContent({ page, $dom: $text })
    await screenshot({ page, title: '1.2 edit_text' })
    expect(textContent).toBe('E2E test')

    // try to delete the root but cannot delete it

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

    await createChildButton.click()

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

    await deleteButton.click()

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

    await createChildButton.click()

    $nodes = await getNodes({ page })
    expect($nodes.length).toBe(2)

    // create brother node

    $nodes = await getNodes({ page })
    await selectNode({ page, $node: $nodes[1] })
    $buttons = await getButtons({ page })
    const createBrotherButton = $buttons[$buttons.length - 2]

    await screenshot({ page, title: '3.1 buttons' })
    expect($buttons.length).toBe(5)
    await createBrotherButton.click()

    await screenshot({ page, title: '3.2 create_brother' })
    $nodes = await getNodes({ page })
    expect($nodes.length).toBe(3)

    // create child node

    $nodes = await getNodes({ page })
    await selectNode({ page, $node: $nodes[2] })

    $buttons = await getButtons({ page })
    createChildButton = $buttons[$buttons.length - 1]
    expect($buttons.length).toBe(5)
    await createChildButton.click()

    await screenshot({ page, title: '3.3 create_child' })
    $nodes = await getNodes({ page })
    expect($nodes.length).toBe(4)

    // close children

    $nodes = await getNodes({ page })
    await selectNode({ page, $node: $nodes[2] })

    let toggleCloseButton = await getToggleCloseButton({ page })
    await toggleCloseButton.click()

    await screenshot({ page, title: '3.4 close_children' })
    $nodes = await getNodes({ page })
    expect($nodes.length).toBe(3)

    // open children

    $nodes = await getNodes({ page })
    await selectNode({ page, $node: $nodes[2] })

    toggleCloseButton = await getToggleCloseButton({ page })
    await toggleCloseButton.click()

    await screenshot({ page, title: '3.5 open_children' })
    $nodes = await getNodes({ page })
    expect($nodes.length).toBe(4)
  })

  test('Add a comment', async () => {
    // select a node

    let $nodes = await getNodes({ page })
    await selectNode({ page, $node: $nodes[0] })

    // add a comment
    await inputAndSubmitComment({ page, text: 'new comment' })
    let $comments = await getComments({ page })
    await screenshot({ page, title: '4.1 new_comment' })
    expect($comments.length).toBe(1)
    let $pre = await $comments[0].$('pre')
    let content = await getContent({ page, $dom: $pre })
    expect(content).toBe('new comment')

    // add second comment
    await inputAndSubmitComment({ page, text: 'second comment' })
    $comments = await getComments({ page })
    await screenshot({ page, title: '4.2 second_comment' })
    expect($comments.length).toBe(2)
    $pre = await $comments[1].$('pre')
    content = await getContent({ page, $dom: $pre })
    expect(content).toBe('second comment')

    // edit first comment
    $comments = await getComments({ page })
    await $comments[0].click()
    await inputComment({ page, text: 'edit first comment' })
    await screenshot({ page, title: '4.3 editing_comment' })
    await editComment({ page })
    await screenshot({ page, title: '4.4 edit_comment' })
    $comments = await getComments({ page })
    expect($comments.length).toBe(2)
    $pre = await $comments[0].$('pre')
    content = await getContent({ page, $dom: $pre })
    expect(content).toBe('edit first comment')

    // cancel edit comment
    $comments = await getComments({ page })
    await $comments[0].click()
    await inputComment({ page, text: 'cancel first comment' })
    await cancelEditComment({ page })
    await screenshot({ page, title: '4.5 cancel_edit_comment' })
    $comments = await getComments({ page })
    $pre = await $comments[0].$('pre')
    content = await getContent({ page, $dom: $pre })
    expect(content).toBe('edit first comment')

    // delete comment
    $comments = await getComments({ page })
    await $comments[0].click()
    await deleteComment({ page })
    await screenshot({ page, title: '4.6 delete_comment' })
    $comments = await getComments({ page })
    expect($comments.length).toBe(1)
    $pre = await $comments[0].$('pre')
    content = await getContent({ page, $dom: $pre })
    expect(content).toBe('second comment')
  })
})
