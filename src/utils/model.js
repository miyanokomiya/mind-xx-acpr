import {
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
  NODE_ADDITIONAL_MARGIN_X_RATE,
  ROOT_NODE,
  CONNECTOR_INNTER_MARGIN_X
} from '@/constants'

import * as geometry from './geometry'

export const createNode = obj =>
  Object.assign(
    {},
    {
      text: '',
      children: [],
      backgroundColor: '#B3E5FC',
      color: '#000000',
      dependencies: {},
      closed: false,
      oppositeChildren: []
    },
    obj
  )

export const createComment = obj =>
  Object.assign(
    {},
    {
      uid: '',
      nodeId: '',
      text: '',
      created: 0,
      updated: 0
    },
    obj
  )

export const isSameNode = (n1, n2) => {
  if (n1.text !== n2.text) {
    return false
  }
  if (n1.backgroundColor !== n2.backgroundColor) {
    return false
  }
  if (n1.color !== n2.color) {
    return false
  }
  if (n1.children.join('/') !== n2.children.join('/')) {
    return false
  }
  {
    const keys1 = Object.keys(n1.dependencies)
    const keys2 = Object.keys(n2.dependencies)
    if (keys1.length !== keys2.length) {
      return false
    }
    for (let key of keys1) {
      if (n1.dependencies[key] !== n2.dependencies[key]) {
        return false
      }
    }
  }
  if (n1.closed !== n2.closed) {
    return false
  }
  return true
}

export const createDefaultNodes = () => ({
  [ROOT_NODE]: createNode()
})

export const createFile = obj =>
  Object.assign(
    {},
    {
      name: '',
      nodeCount: 0,
      created: 0,
      updated: 0
    },
    obj
  )

export const createUser = obj =>
  Object.assign(
    {},
    {
      uid: null,
      displayName: null,
      email: null,
      photoURL: null
    },
    obj
  )

export const calcPositions = ({ nodes, sizes, parentKey }) => {
  const positions = {}
  positions[parentKey] = { x: 0, y: 0 }
  const oppositeFamilySizes = {}
  calcFamilySizes({
    nodes,
    sizes,
    familySizes: oppositeFamilySizes,
    parentKey,
    opposite: true,
    root: true
  })
  calcFamilyPositions({
    nodes,
    sizes,
    familySizes: oppositeFamilySizes,
    parentKey,
    positions,
    opposite: true,
    root: true
  })
  const familySizes = {}
  calcFamilySizes({
    nodes,
    sizes,
    familySizes,
    parentKey,
    opposite: false,
    root: true
  })
  calcFamilyPositions({
    nodes,
    sizes,
    familySizes,
    parentKey,
    positions,
    opposite: false,
    root: true
  })
  return positions
}

export function calcFamilyPositions ({
  nodes,
  sizes,
  familySizes,
  parentKey,
  positions,
  opposite = false,
  root = false
}) {
  const parentNode = nodes[parentKey]
  const parentPosition = positions[parentKey]
  const children =
    opposite && root ? parentNode.oppositeChildren : parentNode.children
  if (children.length > 0) {
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
    children.forEach(childKey => {
      const childSize = sizes[childKey]
      const childFamilySize = familySizes[childKey]
      const childLeft = opposite
        ? parentPosition.x -
          childSize.width -
          NODE_MARGIN_X -
          familySize.height * NODE_ADDITIONAL_MARGIN_X_RATE
        : left
      positions[childKey] = {
        x: childLeft,
        y: top + childFamilySize.height / 2 - childSize.height / 2
      }
      top += childFamilySize.height
      top += NODE_MARGIN_Y
      calcFamilyPositions({
        nodes,
        sizes,
        familySizes,
        parentKey: childKey,
        positions,
        opposite,
        root: false
      })
    })
  }
}

export function calcFamilySizes ({
  nodes,
  sizes,
  familySizes,
  parentKey,
  opposite = false,
  root = false
}) {
  const parentNode = nodes[parentKey]
  const children =
    opposite && root ? parentNode.oppositeChildren : parentNode.children
  if (children.length > 0) {
    children.forEach(childKey => {
      calcFamilySizes({
        nodes,
        sizes,
        familySizes,
        parentKey: childKey,
        opposite,
        root: false
      })
    })
    const size = children.reduce(
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
    if (parentNode.closed) {
      size.height = sizes[parentKey].height
    } else {
      size.height += NODE_MARGIN_Y * (children.length - 1)
    }
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

export function getNearestFamilyKey ({ nodes, childKey }) {
  const parentKey = getParentKey({ nodes, childKey })
  if (!parentKey) {
    return null
  }
  const parent = nodes[parentKey]
  const index = parent.children.indexOf(childKey)
  if (index > 0) {
    return parent.children[index - 1]
  } else {
    return parentKey
  }
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
      children: nextChildren,
      closed: false
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
  Object.keys(nodes).forEach(key => {
    const node = nodes[key]
    const dependencies = { ...node.dependencies }
    if (node.dependencies[deleteKey]) {
      delete dependencies[deleteKey]
    }
    for (let familyKey of familyKeys) {
      if (dependencies[familyKey]) {
        delete dependencies[familyKey]
      }
    }
    const updated = {
      ...node,
      dependencies
    }
    if (!isSameNode(node, updated)) {
      updatedNodes[key] = updated
    }
  })
  return updatedNodes
}

export function getUpdatedNodesWhenDeleteNodes ({ nodes, deleteKeys }) {
  let currentNodes = Object.assign({}, nodes)
  return Object.keys(deleteKeys).reduce((p, deleteKey) => {
    if (deleteKey in p) {
      return p
    }
    const updatedNodes = getUpdatedNodesWhenDeleteNode({
      nodes: currentNodes,
      deleteKey
    })
    // update current nodes after deleting
    currentNodes = Object.keys(currentNodes).reduce((p, c) => {
      if (updatedNodes[c] !== null) {
        p[c] = updatedNodes[c] || currentNodes[c]
      }
      return p
    }, {})
    return Object.assign({}, p, updatedNodes)
  }, {})
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
  const hiddenNodes = getHiddenNodes({ nodes })
  const familyKeys = getFamilyKeys({ nodes, parentKey: targetKey })
  const keys = Object.keys(nodes)
  keys.forEach(key => {
    // remove root
    if (!getParentKey({ nodes, childKey: key })) {
      return
    }
    // remove hidden nodes
    if (hiddenNodes[key]) {
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

  // delete rectangles[targetKey]
  const closestKey = geometry.getClosestRectangleByPoint({
    rectangles,
    point: {
      x: targetRectangle.x,
      y: targetRectangle.y + targetRectangle.height / 2
    }
  })

  // change nothing if closest node is the target or its family
  if (familyKeys.indexOf(closestKey) > -1 || closestKey === targetKey) {
    return nodes
  }

  const closestNode = nodes[closestKey]
  const closestRectangle = rectangles[closestKey]
  const targetCenter = geometry.getCenterOfRectangle(targetRectangle)

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
      targetCenter.y < closestRectangle.y + closestRectangle.height / 2
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
  const hiddenNodes = getHiddenNodes({ nodes })
  if (hiddenNodes[ret]) {
    ret = targetKey
  }
  return ret
}

export function getUpdatedNodesWhenChangeChildOrder ({ nodes, childKey, dif }) {
  const parentKey = getParentKey({ nodes, childKey })
  if (!parentKey) {
    return null
  }
  const parentNode = nodes[parentKey]
  const currentIndex = parentNode.children.indexOf(childKey)
  let nextIndex = currentIndex + dif
  nextIndex = nextIndex < 0 ? parentNode.children.length - 1 : nextIndex
  nextIndex %= parentNode.children.length
  const updatedParent = copyNode(parentNode)
  updatedParent.children.splice(currentIndex, 1)
  updatedParent.children.splice(nextIndex, 0, childKey)
  return Object.assign({}, nodes, {
    [parentKey]: updatedParent
  })
}

export function getConnectors ({ nodes, positions, sizes }) {
  const ret = {}
  const hiddenNodes = getHiddenNodes({ nodes })
  Object.keys(nodes).forEach(parentKey => {
    const parent = nodes[parentKey]
    const parentPosition = positions[parentKey]
    const parentSize = sizes[parentKey]
    parent.children.concat(parent.oppositeChildren).forEach(childKey => {
      if (!hiddenNodes[parentKey] && !hiddenNodes[childKey]) {
        const childPosition = positions[childKey]
        const childSize = sizes[childKey]
        if (parentSize && childSize) {
          const isChildLeftFromParent = childPosition.x < parentPosition.x
          ret[`${parentKey}-${childKey}`] = {
            sx: isChildLeftFromParent
              ? parentPosition.x + CONNECTOR_INNTER_MARGIN_X
              : parentPosition.x + parentSize.width - CONNECTOR_INNTER_MARGIN_X,
            sy: parentPosition.y + parentSize.height / 2,
            ex: isChildLeftFromParent
              ? childPosition.x + childSize.width
              : childPosition.x,
            ey: childPosition.y + childSize.height / 2,
            from: parentKey,
            to: childKey
          }
        }
      }
    })
  })
  return ret
}

export function getDependencyConnectors ({ nodes, positions, sizes }) {
  const ret = {}
  const hiddenNodes = getHiddenNodes({ nodes })
  Object.keys(nodes).forEach(toKey => {
    const to = nodes[toKey]
    if (!hiddenNodes[toKey]) {
      const toPosition = positions[toKey]
      const toSize = sizes[toKey]
      Object.keys(to.dependencies).forEach(fromKey => {
        if (!hiddenNodes[fromKey]) {
          if (to) {
            const fromPosition = positions[fromKey]
            const fromSize = sizes[fromKey]
            if (fromSize && toSize) {
              ret[`depend_${fromKey}-${toKey}`] = {
                sx: fromPosition.x + fromSize.width,
                sy: fromPosition.y + fromSize.height / 2,
                ex: toPosition.x,
                ey: toPosition.y + toSize.height / 2,
                from: fromKey,
                to: toKey
              }
            }
          }
        }
      })
    }
  })
  return ret
}

export function getBetterConnector ({
  nodes,
  sizes,
  positions,
  targetKey,
  newParentKey,
  newChildOrder
}) {
  const parentNode = nodes[newParentKey]
  if (parentNode.children[newChildOrder] === targetKey) {
    return
  }
  const parentPosition = positions[newParentKey]
  const parentSize = sizes[newParentKey]
  const start = {
    sx: parentPosition.x + parentSize.width - CONNECTOR_INNTER_MARGIN_X,
    sy: parentPosition.y + parentSize.height / 2
  }
  if (parentNode.children.length === 0) {
    return Object.assign({}, start, {
      ex: start.sx + CONNECTOR_INNTER_MARGIN_X + NODE_MARGIN_X,
      ey: start.sy
    })
  }
  let order = newChildOrder
  const movingTargetIndex = parentNode.children.indexOf(targetKey)
  if (movingTargetIndex !== -1) {
    if (movingTargetIndex < order) {
      order++
    }
  }
  if (parentNode.children.length > order) {
    const youngerBrotherKey = parentNode.children[order]
    const youngerBrotherPosition = positions[youngerBrotherKey]
    if (order > 0) {
      const elderBrotherKey = parentNode.children[order - 1]
      const elderBrotherPosition = positions[elderBrotherKey]
      const elderBrotherSize = sizes[elderBrotherKey]
      const elderBrotherBottom =
        elderBrotherPosition.y + elderBrotherSize.height
      return Object.assign({}, start, {
        ex: youngerBrotherPosition.x,
        ey: (youngerBrotherPosition.y + elderBrotherBottom) / 2
      })
    } else {
      return Object.assign({}, start, {
        ex: youngerBrotherPosition.x,
        ey: youngerBrotherPosition.y - NODE_MARGIN_Y / 2
      })
    }
  } else {
    const elderBrotherKey = parentNode.children[order - 1]
    const elderBrotherPosition = positions[elderBrotherKey]
    const elderBrotherSize = sizes[elderBrotherKey]
    return Object.assign({}, start, {
      ex: elderBrotherPosition.x,
      ey: elderBrotherPosition.y + elderBrotherSize.height + NODE_MARGIN_Y / 2
    })
  }
}

export function getNodeDiff ({ nodes, updatedNodes }) {
  return Object.keys(updatedNodes).reduce((p, c) => {
    const current = nodes[c]
    const updated = updatedNodes[c]
    if (current) {
      if (updated) {
        if (!isSameNode(current, updated)) {
          p[c] = updated
        }
      } else {
        // updated is deleted
        p[c] = updated
      }
    } else {
      // current does not exist
      p[c] = updated
    }
    return p
  }, {})
}

export function isConflict ({ nodes }) {
  let isConflict = false
  Object.keys(nodes).some(key => {
    if (key !== ROOT_NODE) {
      if (!getParentKey({ nodes, childKey: key })) {
        isConflict = true
        return true
      }
    }
    const node = nodes[key]
    // check children
    node.children.some(childKey => {
      if (!nodes[childKey]) {
        isConflict = true
        return true
      }
    })
    if (!isConflict) {
      // check dependencies
      Object.keys(node.dependencies).some(childKey => {
        if (!nodes[childKey]) {
          isConflict = true
          return true
        }
      })
    }
    return isConflict
  })
  return isConflict
}

export function rescueConflict ({ nodes }) {
  return Object.keys(nodes).reduce((p, key) => {
    if (key !== ROOT_NODE) {
      if (!getParentKey({ nodes, childKey: key })) {
        return {
          ...p,
          [key]: null
        }
      }
    }
    const children = nodes[key].children.filter(childKey => {
      if (nodes[childKey]) {
        return true
      }
    })
    const dependencies = Object.keys(nodes[key].dependencies).reduce(
      (p, childKey) => {
        if (nodes[childKey]) {
          return {
            ...p,
            childKey: true
          }
        } else {
          return p
        }
      },
      {}
    )
    p[key] = Object.assign({}, nodes[key], {
      children,
      dependencies
    })
    return p
  }, {})
}

export function getHiddenNodes ({ nodes }) {
  return Object.keys(nodes).reduce((p, key) => {
    const node = nodes[key]
    // ignore if this node is hidden already
    if (!p[key] && node.closed) {
      const familyKeys = getFamilyKeys({ nodes, parentKey: key })
      for (let childKey of familyKeys) {
        p[childKey] = true
      }
    }
    return p
  }, {})
}
