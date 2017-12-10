import {
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
  NODE_ADDITIONAL_MARGIN_X_RATE
} from '@/constants'

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
    let top =
      parentPosition.y - familySize.height / 2 + sizes[parentKey].height / 2
    // let top = parentPosition.y - familySize.height / 2
    parentNode.children.forEach(childKey => {
      positions[childKey] = {
        x: left,
        y: top + familySizes[childKey].height / 2 - sizes[childKey].height / 2
      }
      top += familySizes[childKey].height + NODE_MARGIN_Y
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
        const childSize = familySizes[c]
        return {
          width: Math.max(p.width, childSize.width),
          height: p.height + childSize.height
        }
      },
      {
        width: 0,
        height: 0
      }
    )
    size.height += NODE_MARGIN_Y * (parentNode.children.length - 1)
    const familyHeight = Math.max(sizes[parentKey].height, size.height)
    familySizes[parentKey] = {
      width: sizes[parentKey].width + size.width + NODE_MARGIN_X,
      height: familyHeight
    }
  } else {
    // this node does not have children
    familySizes[parentKey] = sizes[parentKey]
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
