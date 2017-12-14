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
