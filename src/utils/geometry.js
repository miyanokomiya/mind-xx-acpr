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

export function getRelationBetweenRectangleAndPoint ({ rectangle, point }) {
  if (point.x < rectangle.x) {
    if (point.y < rectangle.y) {
      return 1
    } else if (point.y > rectangle.y + rectangle.height) {
      return 7
    } else {
      return 4
    }
  } else if (point.x > rectangle.x + rectangle.width) {
    if (point.y < rectangle.y) {
      return 3
    } else if (point.y > rectangle.y + rectangle.height) {
      return 9
    } else {
      return 6
    }
  } else {
    if (point.y < rectangle.y) {
      return 2
    } else if (point.y > rectangle.y + rectangle.height) {
      return 8
    } else {
      return 5
    }
  }
}

export function getDistanceBetweenRectangleAndPoint ({ rectangle, point }) {
  const relation = getRelationBetweenRectangleAndPoint({ rectangle, point })
  switch (relation) {
    case 1:
      return getDistance(point, { x: rectangle.x, y: rectangle.y })
    case 2:
      return rectangle.y - point.y
    case 3:
      return getDistance(point, {
        x: rectangle.x + rectangle.width,
        y: rectangle.y
      })
    case 4:
      return rectangle.x - point.x
    case 5:
      return 0
    case 6:
      return point.x - (rectangle.x + rectangle.width)
    case 7:
      return getDistance(point, {
        x: rectangle.x,
        y: rectangle.y + rectangle.height
      })
    case 8:
      return point.y - (rectangle.y + rectangle.height)
    case 9:
      return getDistance(point, {
        x: rectangle.x + rectangle.width,
        y: rectangle.y + rectangle.height
      })
  }
}

export function getClosestRectangleByPoint ({ rectangles, point }) {
  const keys = Object.keys(rectangles)
  if (keys.length === 0) {
    return null
  }
  let ret = null
  let minD = Number.POSITIVE_INFINITY
  keys.forEach(key => {
    const d = getDistanceBetweenRectangleAndPoint({
      rectangle: rectangles[key],
      point
    })
    if (d < minD) {
      ret = key
      minD = d
    }
  })
  return ret
}
