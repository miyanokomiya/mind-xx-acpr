import {
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
  NODE_ADDITIONAL_MARGIN_X_RATE
} from '@/constants'

import * as geometry from './geometry'

export const createNode = obj =>
  Object.assign(
    {},
    {
      text: '',
      children: []
    },
    obj
  )

export const calcPositions = ({ nodes, sizes, parentKey }) => {
  const positions = {}
  positions[parentKey] = { x: 0, y: 0 }
  const familySizes = {}
  calcFamilySizes({ nodes, sizes, familySizes, parentKey })
  calcFamilyPositions({ nodes, sizes, familySizes, parentKey, positions })
  return positions
}

export function calcFamilyPositions ({
  nodes,
  sizes,
  familySizes,
  parentKey,
  positions
}) {
  const parentNode = nodes[parentKey]
  const parentPosition = positions[parentKey]
  if (parentNode.children.length > 0) {
    const familySize = familySizes[parentKey]
    const left =
      parentPosition.x +
      sizes[parentKey].width +
      NODE_MARGIN_X +
      familySize.height * NODE_ADDITIONAL_MARGIN_X_RATE
    let top
    if (familySize.othersHeight <= sizes[parentKey].height) {
      top =
        parentPosition.y -
        familySize.othersHeight / 2 +
        sizes[parentKey].height / 2
    } else {
      top =
        parentPosition.y -
        familySize.othersHeight / 2 +
        sizes[parentKey].height / 2
    }
    parentNode.children.forEach(childKey => {
      const childSize = sizes[childKey]
      const childFamilySize = familySizes[childKey]
      positions[childKey] = {
        x: left,
        y: top + childFamilySize.height / 2 - childSize.height / 2
      }
      top += childFamilySize.height
      top += NODE_MARGIN_Y
      calcFamilyPositions({
        nodes,
        sizes,
        familySizes,
        parentKey: childKey,
        positions
      })
    })
  }
}

export function calcFamilySizes ({ nodes, sizes, familySizes, parentKey }) {
  const parentNode = nodes[parentKey]
  if (parentNode.children.length > 0) {
    parentNode.children.forEach(childKey => {
      calcFamilySizes({ nodes, sizes, familySizes, parentKey: childKey })
    })
    const size = parentNode.children.reduce(
      (p, c) => {
        const childWidth = familySizes[c].width
        const childHeight = Math.max(familySizes[c].height, sizes[c].height)
        return {
          width: Math.max(p.width, childWidth),
          height: p.height + childHeight
        }
      },
      {
        width: 0,
        height: 0
      }
    )
    size.height += NODE_MARGIN_Y * (parentNode.children.length - 1)
    familySizes[parentKey] = {
      width: sizes[parentKey].width + size.width + NODE_MARGIN_X,
      height: Math.max(sizes[parentKey].height, size.height),
      othersHeight: size.height
    }
  } else {
    // this node does not have children
    familySizes[parentKey] = Object.assign({}, sizes[parentKey], {
      othersHeight: 0
    })
  }
}

export function getParentKey ({ nodes, childKey }) {
  const ret = Object.keys(nodes).find(key => {
    const node = nodes[key]
    return node.children.indexOf(childKey) !== -1
  })
  return ret || null
}

export function getFamilyKeys ({ nodes, parentKey }) {
  let familyKeys = []
  const parent = nodes[parentKey]
  parent.children.forEach(childKey => {
    familyKeys.push(childKey)
    const childFamilyKeys = getFamilyKeys({ nodes, parentKey: childKey })
    familyKeys = familyKeys.concat(childFamilyKeys)
  })
  return familyKeys
}

export function getUpdatedNodesWhenCreateChildNode ({
  nodes,
  parentKey,
  newKey = `key_${Math.random()}`
}) {
  const node = createNode()
  const key = newKey
  const parent = nodes[parentKey]
  const nextChildren = parent.children.concat()
  nextChildren.push(key)
  const updatedNodes = {
    [key]: node,
    [parentKey]: Object.assign({}, parent, {
      children: nextChildren
    })
  }
  return updatedNodes
}

export function getUpdatedNodesWhenCreateBrotherdNode ({
  nodes,
  brotherKey,
  newKey = `key_${Math.random()}`
}) {
  const parentKey = getParentKey({ nodes, childKey: brotherKey })
  const updatedNodes = getUpdatedNodesWhenCreateChildNode({
    nodes,
    parentKey,
    newKey
  })
  // replace newKey after brotherKey
  const parent = updatedNodes[parentKey]
  parent.children.pop()
  const brotherIndex = parent.children.indexOf(brotherKey)
  parent.children.splice(brotherIndex + 1, 0, newKey)
  return updatedNodes
}

export function getUpdatedNodesWhenDeleteNode ({ nodes, deleteKey }) {
  const familyKeys = getFamilyKeys({ nodes: nodes, parentKey: deleteKey })
  const updatedNodes = {
    [deleteKey]: null
  }
  familyKeys.forEach(key => {
    updatedNodes[key] = null
  })
  const parentKey = getParentKey({ nodes: nodes, childKey: deleteKey })
  if (parentKey) {
    const parentNode = nodes[parentKey]
    const nextParentNode = Object.assign({}, parentNode)
    nextParentNode.children = nextParentNode.children.filter(
      key => key !== deleteKey
    )
    updatedNodes[parentKey] = nextParentNode
  }
  return updatedNodes
}

export function copyNode (node) {
  return Object.assign({}, node, {
    children: node.children.concat()
  })
}

export function getUpdatedNodesWhenChangeParent ({
  nodes,
  targetKey,
  newParentKey,
  order = 0
}) {
  // exit current familly
  const currentParentKey = getParentKey({ nodes, childKey: targetKey })
  const updatedCurrentParent = copyNode(nodes[currentParentKey])
  const currentChildIndex = updatedCurrentParent.children.indexOf(targetKey)
  updatedCurrentParent.children.splice(currentChildIndex, 1)
  if (currentParentKey === newParentKey) {
    if (order <= currentChildIndex) {
      updatedCurrentParent.children.splice(order, 0, targetKey)
    } else {
      updatedCurrentParent.children.splice(order - 1, 0, targetKey)
    }
    return Object.assign({}, nodes, {
      [currentParentKey]: updatedCurrentParent
    })
  } else {
    const updatedParent = copyNode(nodes[newParentKey])
    updatedParent.children.splice(order, 0, targetKey)
    return Object.assign({}, nodes, {
      [currentParentKey]: updatedCurrentParent,
      [newParentKey]: updatedParent
    })
  }
}

export function getUpdatedNodesWhenFitClosestParent ({
  nodes,
  sizes,
  positions,
  targetKey,
  movingPositions
}) {
  const rectangles = {}
  const familyKeys = getFamilyKeys({ nodes, parentKey: targetKey })
  const keys = Object.keys(nodes)
  keys.forEach(key => {
    // remove root
    if (!getParentKey({ nodes, childKey: key })) {
      return
    }
    // remove family
    if (familyKeys.indexOf(key) > -1) {
      return
    }
    rectangles[key] = {
      x: positions[key].x,
      y: positions[key].y,
      width: sizes[key].width,
      height: sizes[key].height
    }
  })
  const targetRectangle = {
    x: movingPositions[targetKey].x,
    y: movingPositions[targetKey].y,
    width: sizes[targetKey].width,
    height: sizes[targetKey].height
  }
  const targetCenter = geometry.getCenterOfRectangle(targetRectangle)
  const originalTargetCenter = geometry.getCenterOfRectangle(
    rectangles[targetKey]
  )
  if (geometry.getDistance(targetCenter, originalTargetCenter) < 15) {
    return nodes
  }

  delete rectangles[targetKey]
  const closestKey = geometry.getClosestRectangleByPoint({
    rectangles,
    point: {
      x: targetRectangle.x + targetRectangle.width / 4,
      y: targetRectangle.y + targetRectangle.height / 2
    }
  })

  const closestNode = nodes[closestKey]
  const closestRectangle = rectangles[closestKey]

  const closestHasNoChildOrHasTarget =
    closestNode.children.length === 0 ||
    (closestNode.children.length === 1 &&
      closestNode.children.indexOf(targetCenter) === -1)
  if (
    closestHasNoChildOrHasTarget &&
    closestRectangle.x + closestRectangle.width / 2 < targetRectangle.x
  ) {
    // add child to closest node
    return getUpdatedNodesWhenChangeParent({
      nodes,
      targetKey,
      newParentKey: closestKey,
      order: 0
    })
  } else {
    const isElder =
      targetCenter.y < closestRectangle.y + closestRectangle.height
    const closestParentKey = getParentKey({ nodes, childKey: closestKey })
    const childIndex = nodes[closestParentKey].children.indexOf(closestKey)
    return getUpdatedNodesWhenChangeParent({
      nodes,
      targetKey,
      newParentKey: closestParentKey,
      order: childIndex + (isElder ? 0 : 1)
    })
  }
}

export function getNodeFrom ({ nodes, to, targetKey }) {
  let ret = null
  const baseKey = targetKey
  const baseNode = nodes[baseKey]
  if (baseNode) {
    if (to === 'right') {
      if (baseNode.children.length > 0) {
        ret = baseNode.children[0]
      }
    } else {
      const parentKey = getParentKey({ nodes, childKey: baseKey })
      if (parentKey) {
        const parentNode = nodes[parentKey]
        if (to === 'left') {
          ret = parentKey
        }
        if (to === 'down') {
          const index =
            (parentNode.children.indexOf(baseKey) + 1) %
            parentNode.children.length
          ret = parentNode.children[index]
        }
        if (to === 'up') {
          let index = parentNode.children.indexOf(baseKey) - 1
          index = index < 0 ? parentNode.children.length - 1 : index
          ret = parentNode.children[index]
        }
      }
    }
  }
  return ret
}
