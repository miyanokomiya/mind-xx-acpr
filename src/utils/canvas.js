export const getPoint = e => {
  let x, y
  let rect = e.currentTarget.getBoundingClientRect()
  let dx = rect.left + window.pageXOffset
  let dy = rect.top + window.pageYOffset

  if (isTouch(e)) {
    let touch = e.touches[0]
    x = touch.pageX - dx
    y = touch.pageY - dy
  } else {
    x = e.pageX - dx
    y = e.pageY - dy
  }
  return {
    x: x,
    y: y
  }
}

export const isTouch = e => {
  return e.touches
}

export const isMulitTouch = e => {
  return isTouch(e) && e.touches.length > 1
}

export const isTouchExist = e => {
  return isTouch(e) && e.touches.length > 0
}

export const getPoints = e => {
  let ret = []
  let rect = e.currentTarget.getBoundingClientRect()
  let dx = rect.left + window.pageXOffset
  let dy = rect.top + window.pageYOffset

  for (let i = 0; i < e.touches.length; i++) {
    let touch = e.touches[i]
    ret.push({
      x: touch.pageX - dx,
      y: touch.pageY - dy
    })
  }

  return ret
}
