export function getCoveredRectangle ({ positions, sizes }) {
  const keys = Object.keys(positions).filter(key => {
    return positions[key] && sizes[key]
  })
  if (keys.length === 0) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  }
  let recP = keys.reduce(
    (p, key) => {
      return {
        x: Math.min(p.x, positions[key].x),
        y: Math.min(p.y, positions[key].y)
      }
    },
    {
      x: positions[keys[0]].x,
      y: positions[keys[0]].y
    }
  )
  const recS = keys.reduce(
    (p, key) => {
      return {
        width: Math.max(p.width, positions[key].x + sizes[key].width - recP.x),
        height: Math.max(
          p.height,
          positions[key].y + sizes[key].height - recP.y
        )
      }
    },
    {
      width: sizes[keys[0]].width,
      height: sizes[keys[0]].height
    }
  )
  return {
    x: recP.x,
    y: recP.y,
    width: recS.width,
    height: recS.height
  }
}

export function getCenterOfRectangle (rectangle) {
  return {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2
  }
}

export function getDistance (p1, p2) {
  return Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2), 1 / 2)
}

export function getClosestRectangle ({ rectangles, target }) {
  const keys = Object.keys(rectangles)
  if (keys.length === 0) {
    return null
  }
  let ret = null
  let minD = Number.POSITIVE_INFINITY
  const targetCenter = getCenterOfRectangle(target)
  keys.forEach(key => {
    const center = getCenterOfRectangle(rectangles[key])
    const d = getDistance(center, targetCenter)
    if (d < minD) {
      ret = key
      minD = d
    }
  })
  return ret
}
