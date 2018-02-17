import * as modelUtils from '@/utils/model'
import {
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
  NODE_ADDITIONAL_MARGIN_X_RATE,
  ROOT_NODE,
  CONNECTOR_INNTER_MARGIN_X
} from '@/constants'

describe('utils/model', () => {
  describe('isSameNode', () => {
    const n1 = modelUtils.createNode({
      text: '11',
      children: ['a', 'b'],
      backgroundColor: '#B3E5FC',
      color: '#000000',
      dependencies: { a: true },
      closed: false
    })
    it('should return true if two nodes are same', () => {
      const n2 = modelUtils.createNode({
        text: '11',
        children: ['a', 'b'],
        backgroundColor: '#B3E5FC',
        color: '#000000',
        dependencies: { a: true },
        closed: false
      })
      const res = modelUtils.isSameNode(n1, n2)
      expect(res).toBe(true)
    })
    it('should return true if two nodes, have no children, are same', () => {
      const n1 = modelUtils.createNode({
        text: '11',
        children: [],
        backgroundColor: '#B3E5FC',
        color: '#000000',
        dependencies: { a: true }
      })
      const n2 = modelUtils.createNode({
        text: '11',
        children: [],
        backgroundColor: '#B3E5FC',
        color: '#000000',
        dependencies: { a: true }
      })
      const res = modelUtils.isSameNode(n1, n2)
      expect(res).toBe(true)
    })
    it('should return true if two nodes are different', () => {
      const n2 = modelUtils.createNode({
        text: '11',
        children: ['a', 'b', 'c'],
        backgroundColor: '#B3E5FC',
        color: '#000000',
        dependencies: { a: true }
      })
      const res = modelUtils.isSameNode(n1, n2)
      expect(res).toBe(false)
    })
    it('should return true if dependencies of two nodes are different', () => {
      const n2 = modelUtils.createNode({
        text: '11',
        children: ['a', 'b'],
        backgroundColor: '#B3E5FC',
        color: '#000000',
        dependencies: { b: true }
      })
      const res = modelUtils.isSameNode(n1, n2)
      expect(res).toBe(false)
    })
  })
  describe('calcFamilyPositions', () => {
    it('should calc correct position of a node that has grandson', () => {
      const a = modelUtils.createNode({
        children: ['b']
      })
      const b = modelUtils.createNode({
        children: ['c', 'd']
      })
      const c = modelUtils.createNode()
      const d = modelUtils.createNode()
      const nodes = { a, b, c, d }
      const sizes = {
        a: {
          width: 10,
          height: 100
        },
        b: {
          width: 20,
          height: 200
        },
        c: {
          width: 50,
          height: 500
        },
        d: {
          width: 40,
          height: 400
        }
      }
      const familySizes = {
        a: {
          width: 10 + 20 + 50,
          height: 500 + 400,
          othersHeight: 500 + 400
        },
        b: {
          width: 20 + 50,
          height: 500 + 400,
          othersHeight: 500 + 400
        },
        c: {
          width: 50,
          height: 500,
          othersHeight: 0
        },
        d: {
          width: 40,
          height: 400,
          othersHeight: 0
        }
      }
      const positions = {
        a: { x: 0, y: 0 }
      }
      modelUtils.calcFamilyPositions({
        nodes,
        sizes,
        familySizes,
        parentKey: 'a',
        positions
      })
      expect(positions.a).toEqual({
        x: 0,
        y: 0
      })
      expect(positions.b).toEqual({
        x: 10 + NODE_MARGIN_X + (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE,
        y: -200 / 2 + 100 / 2
      })
      expect(positions.c).toEqual({
        x:
          10 +
          20 +
          NODE_MARGIN_X * 2 +
          (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE * 2,
        y: -200 / 2 + 100 / 2 - (500 + 400) / 2 + 200 / 2
      })
      expect(positions.d).toEqual({
        x:
          10 +
          20 +
          NODE_MARGIN_X * 2 +
          (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE * 2,
        y: -200 / 2 + 100 / 2 - (500 + 400) / 2 + 200 / 2 + 500 + NODE_MARGIN_Y
      })
    })
    it('should calc correct position of a node that is the highest in the family', () => {
      const a = modelUtils.createNode({
        children: ['b']
      })
      const b = modelUtils.createNode({
        children: ['c', 'd']
      })
      const c = modelUtils.createNode()
      const d = modelUtils.createNode()
      const nodes = { a, b, c, d }
      const sizes = {
        a: {
          width: 10,
          height: 1000
        },
        b: {
          width: 20,
          height: 200
        },
        c: {
          width: 50,
          height: 500
        },
        d: {
          width: 40,
          height: 400
        }
      }
      const familySizes = {
        a: {
          width: 10 + 20 + 50,
          height: 1000,
          othersHeight: 900
        },
        b: {
          width: 20 + 50,
          height: 500 + 400,
          othersHeight: 500 + 400
        },
        c: {
          width: 50,
          height: 500,
          othersHeight: 0
        },
        d: {
          width: 40,
          height: 400,
          othersHeight: 0
        }
      }
      const positions = {
        a: { x: 0, y: 0 }
      }
      modelUtils.calcFamilyPositions({
        nodes,
        sizes,
        familySizes,
        parentKey: 'a',
        positions
      })
      expect(positions.a).toEqual({
        x: 0,
        y: 0
      })
      expect(positions.b).toEqual({
        x: 10 + NODE_MARGIN_X + 1000 * NODE_ADDITIONAL_MARGIN_X_RATE,
        y: 500 - 200 / 2
      })
      expect(positions.c).toEqual({
        x:
          10 +
          20 +
          NODE_MARGIN_X * 2 +
          (1000 + 500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE,
        y: 500 - (500 + 400) / 2
      })
      expect(positions.d).toEqual({
        x:
          10 +
          20 +
          NODE_MARGIN_X * 2 +
          (1000 + 500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE,
        y: 500 - (500 + 400) / 2 + 500 + NODE_MARGIN_Y
      })
    })
    it('should calc correct position of a node that has grandson, oppsite option', () => {
      const a = modelUtils.createNode({
        oppositeChildren: ['b']
      })
      const b = modelUtils.createNode({
        children: ['c', 'd']
      })
      const c = modelUtils.createNode()
      const d = modelUtils.createNode()
      const nodes = { a, b, c, d }
      const sizes = {
        a: {
          width: 10,
          height: 100
        },
        b: {
          width: 20,
          height: 200
        },
        c: {
          width: 50,
          height: 500
        },
        d: {
          width: 40,
          height: 400
        }
      }
      const familySizes = {
        a: {
          width: 10 + 20 + 50,
          height: 500 + 400,
          othersHeight: 500 + 400
        },
        b: {
          width: 20 + 50,
          height: 500 + 400,
          othersHeight: 500 + 400
        },
        c: {
          width: 50,
          height: 500,
          othersHeight: 0
        },
        d: {
          width: 40,
          height: 400,
          othersHeight: 0
        }
      }
      const positions = {
        a: { x: 0, y: 0 }
      }
      modelUtils.calcFamilyPositions({
        nodes,
        sizes,
        familySizes,
        parentKey: 'a',
        positions,
        opposite: true,
        root: true
      })
      expect(positions.a).toEqual({
        x: 0,
        y: 0
      })
      const bx =
        -1 * (NODE_MARGIN_X + (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE) - 20
      expect(positions.b).toEqual({
        x: bx,
        y: -200 / 2 + 100 / 2
      })
      expect(positions.c).toEqual({
        x:
          bx -
          NODE_MARGIN_X -
          (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE * 2 -
          50,
        y: -200 / 2 + 100 / 2 - (500 + 400) / 2 + 200 / 2
      })
      expect(positions.d).toEqual({
        x:
          bx -
          NODE_MARGIN_X -
          (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE * 2 -
          40,
        y: -200 / 2 + 100 / 2 - (500 + 400) / 2 + 200 / 2 + 500 + NODE_MARGIN_Y
      })
    })
  })

  describe('calcFamilySizes', () => {
    it('should calc correct size of a node that has no children', () => {
      const node = modelUtils.createNode()
      const nodes = {
        a: node
      }
      const sizes = {
        a: {
          width: 10,
          height: 100
        }
      }
      const familySizes = {}
      modelUtils.calcFamilySizes({ nodes, sizes, familySizes, parentKey: 'a' })
      expect(familySizes).toEqual({
        a: {
          width: 10,
          height: 100,
          othersHeight: 0
        }
      })
    })
    it('should calc correct size of a node that is closed', () => {
      const a = modelUtils.createNode({
        children: ['b'],
        closed: true
      })
      const b = modelUtils.createNode()
      const nodes = {
        a,
        b
      }
      const sizes = {
        a: {
          width: 10,
          height: 100
        },
        b: {
          width: 20,
          height: 200
        }
      }
      const familySizes = {}
      modelUtils.calcFamilySizes({ nodes, sizes, familySizes, parentKey: 'a' })
      expect(familySizes).toEqual({
        a: {
          width: 10 + 20 + NODE_MARGIN_X,
          height: 100,
          othersHeight: 100
        },
        b: {
          width: 20,
          height: 200,
          othersHeight: 0
        }
      })
    })
    it('should calc correct size of a node that has a child', () => {
      const a = modelUtils.createNode({
        children: ['b']
      })
      const b = modelUtils.createNode()
      const nodes = {
        a,
        b
      }
      const sizes = {
        a: {
          width: 10,
          height: 100
        },
        b: {
          width: 20,
          height: 200
        }
      }
      const familySizes = {}
      modelUtils.calcFamilySizes({ nodes, sizes, familySizes, parentKey: 'a' })
      expect(familySizes).toEqual({
        a: {
          width: 10 + 20 + NODE_MARGIN_X,
          height: 200,
          othersHeight: 200
        },
        b: {
          width: 20,
          height: 200,
          othersHeight: 0
        }
      })
    })
    it('should calc correct size of a node that has some children', () => {
      const a = modelUtils.createNode({
        children: ['b', 'c', 'd']
      })
      const b = modelUtils.createNode()
      const c = modelUtils.createNode()
      const d = modelUtils.createNode()
      const nodes = { a, b, c, d }
      const sizes = {
        a: {
          width: 10,
          height: 100
        },
        b: {
          width: 20,
          height: 200
        },
        c: {
          width: 50,
          height: 500
        },
        d: {
          width: 40,
          height: 400
        }
      }
      const familySizes = {}
      modelUtils.calcFamilySizes({ nodes, sizes, familySizes, parentKey: 'a' })
      expect(familySizes).toEqual({
        a: {
          width: 10 + 50 + NODE_MARGIN_X,
          height: 200 + 500 + 400 + NODE_MARGIN_Y * 2,
          othersHeight: 200 + 500 + 400 + NODE_MARGIN_Y * 2
        },
        b: {
          width: 20,
          height: 200,
          othersHeight: 0
        },
        c: {
          width: 50,
          height: 500,
          othersHeight: 0
        },
        d: {
          width: 40,
          height: 400,
          othersHeight: 0
        }
      })
    })
    it('should calc correct size of a node that has a grandson', () => {
      const a = modelUtils.createNode({
        children: ['b']
      })
      const b = modelUtils.createNode({
        children: ['c', 'd']
      })
      const c = modelUtils.createNode()
      const d = modelUtils.createNode()
      const nodes = { a, b, c, d }
      const sizes = {
        a: {
          width: 10,
          height: 100
        },
        b: {
          width: 20,
          height: 200
        },
        c: {
          width: 50,
          height: 500
        },
        d: {
          width: 40,
          height: 400
        }
      }
      const familySizes = {}
      modelUtils.calcFamilySizes({ nodes, sizes, familySizes, parentKey: 'a' })
      expect(familySizes).toEqual({
        a: {
          width: 10 + 20 + 50 + NODE_MARGIN_X * 2,
          height: 500 + 400 + NODE_MARGIN_Y,
          othersHeight: 500 + 400 + NODE_MARGIN_Y
        },
        b: {
          width: 20 + 50 + NODE_MARGIN_X,
          height: 500 + 400 + NODE_MARGIN_Y,
          othersHeight: 500 + 400 + NODE_MARGIN_Y
        },
        c: {
          width: 50,
          height: 500,
          othersHeight: 0
        },
        d: {
          width: 40,
          height: 400,
          othersHeight: 0
        }
      })
    })
    it('should calc correct size of a node that has opposite children', () => {
      const a = modelUtils.createNode({
        oppositeChildren: ['b']
      })
      const b = modelUtils.createNode({
        children: ['c', 'd']
      })
      const c = modelUtils.createNode()
      const d = modelUtils.createNode()
      const nodes = { a, b, c, d }
      const sizes = {
        a: {
          width: 10,
          height: 100
        },
        b: {
          width: 20,
          height: 200
        },
        c: {
          width: 50,
          height: 500
        },
        d: {
          width: 40,
          height: 400
        }
      }
      const familySizes = {}
      modelUtils.calcFamilySizes({
        nodes,
        sizes,
        familySizes,
        parentKey: 'a',
        opposite: true,
        root: true
      })
      expect(familySizes).toEqual({
        a: {
          width: 10 + 20 + 50 + NODE_MARGIN_X * 2,
          height: 500 + 400 + NODE_MARGIN_Y,
          othersHeight: 500 + 400 + NODE_MARGIN_Y
        },
        b: {
          width: 20 + 50 + NODE_MARGIN_X,
          height: 500 + 400 + NODE_MARGIN_Y,
          othersHeight: 500 + 400 + NODE_MARGIN_Y
        },
        c: {
          width: 50,
          height: 500,
          othersHeight: 0
        },
        d: {
          width: 40,
          height: 400,
          othersHeight: 0
        }
      })
    })
  })

  describe('getParentKey', () => {
    const a = modelUtils.createNode({
      children: ['b']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const nodes = { a, b, c, d }
    it('should get correct parent key', () => {
      const parentKey = modelUtils.getParentKey({
        nodes,
        childKey: 'c'
      })
      expect(parentKey).toBe('b')
    })
    it('should get null when no parent', () => {
      const parentKey = modelUtils.getParentKey({
        nodes,
        childKey: 'a'
      })
      expect(parentKey).toBe(null)
    })
    it('should get correct parent key, if the child is oppsite', () => {
      const a = modelUtils.createNode({
        oppositeChildren: ['b']
      })
      const nodes = { a, b, c, d }
      const parentKey = modelUtils.getParentKey({
        nodes,
        childKey: 'b'
      })
      expect(parentKey).toBe('a')
    })
  })

  describe('getNearestFamilyKey', () => {
    const a = modelUtils.createNode({
      children: ['b']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const nodes = { a, b, c, d }
    it('should get correct elder brother key if it exists', () => {
      const key = modelUtils.getNearestFamilyKey({
        nodes,
        childKey: 'd'
      })
      expect(key).toBe('c')
    })
    it('should get correct parent key if elder brothers do not exist', () => {
      const key = modelUtils.getNearestFamilyKey({
        nodes,
        childKey: 'c'
      })
      expect(key).toBe('b')
    })
    it('should get null when no parent ', () => {
      const parentKey = modelUtils.getNearestFamilyKey({
        nodes,
        childKey: 'a'
      })
      expect(parentKey).toBe(null)
    })
    it('should get correct elder brother key if it exists, if the children are opposite', () => {
      const a = modelUtils.createNode({
        oppositeChildren: ['b', 'c']
      })
      const b = modelUtils.createNode({
        children: ['d']
      })
      const nodes = { a, b, c, d }
      const key = modelUtils.getNearestFamilyKey({
        nodes,
        childKey: 'c'
      })
      expect(key).toBe('b')
    })
  })

  describe('getFamilyKeys', () => {
    const a = modelUtils.createNode({
      children: ['b', 'e']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const e = modelUtils.createNode()
    const nodes = { a, b, c, d, e }
    it('should get correct keys', () => {
      const familyKeys = modelUtils.getFamilyKeys({
        nodes,
        parentKey: 'b'
      })
      expect(familyKeys).toEqual(['c', 'd'])
    })
    it('should get no keys when no children', () => {
      const familyKeys = modelUtils.getFamilyKeys({
        nodes,
        parentKey: 'c'
      })
      expect(familyKeys).toEqual([])
    })
  })

  describe('getUpdatedNodesWhenCreateChildNode', () => {
    const a = modelUtils.createNode({
      children: ['c'],
      closed: true
    })
    const c = modelUtils.createNode()
    const nodes = { a, c }
    it('should get correct nodes when creating child node', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenCreateChildNode({
        nodes,
        parentKey: 'a',
        newKey: 'b'
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['c', 'b'],
          closed: false
        }),
        b: modelUtils.createNode()
      })
    })
    it('should get correct nodes when creating opposite child node', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenCreateChildNode({
        nodes,
        parentKey: 'a',
        newKey: 'b',
        opposite: true
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['c'],
          oppositeChildren: ['b'],
          closed: false
        }),
        b: modelUtils.createNode()
      })
    })
  })

  describe('getUpdatedNodesWhenCreateBrotherdNode', () => {
    const a = modelUtils.createNode({
      children: ['b', 'c']
    })
    const b = modelUtils.createNode()
    const c = modelUtils.createNode()
    const nodes = { a, b, c }
    it('should get correct nodes when creating middle brother node', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenCreateBrotherdNode({
        nodes,
        brotherKey: 'b',
        newKey: 'd'
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['b', 'd', 'c']
        }),
        d: modelUtils.createNode()
      })
    })
    it('should get correct nodes when creating last brother node', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenCreateBrotherdNode({
        nodes,
        brotherKey: 'c',
        newKey: 'd'
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['b', 'c', 'd']
        }),
        d: modelUtils.createNode()
      })
    })
    it('should get correct nodes when creating opposite brother node', () => {
      const a = modelUtils.createNode({
        oppositeChildren: ['b', 'c']
      })
      const nodes = { a, b, c }
      const updatedNodes = modelUtils.getUpdatedNodesWhenCreateBrotherdNode({
        nodes,
        brotherKey: 'c',
        newKey: 'd'
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          oppositeChildren: ['b', 'c', 'd']
        }),
        d: modelUtils.createNode()
      })
    })
  })

  describe('getUpdatedNodesWhenDeleteNode', () => {
    const a = modelUtils.createNode({
      children: ['b', 'e']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const e = modelUtils.createNode()
    const nodes = { a, b, c, d, e }
    it('should get correct nodes when deleting a node has no children', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenDeleteNode({
        nodes,
        deleteKey: 'c'
      })
      expect(updatedNodes).toEqual({
        b: Object.assign({}, b, {
          children: ['d']
        }),
        c: null
      })
    })
    it('should get correct nodes when deleting a node has children', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenDeleteNode({
        nodes,
        deleteKey: 'b'
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['e']
        }),
        b: null,
        c: null,
        d: null
      })
    })
    it('should get correct nodes when deleting a node which other nodes depend on it', () => {
      const e = modelUtils.createNode({
        dependencies: {
          c: true,
          d: true
        }
      })
      const nodes = { a, b, c, d, e }
      const updatedNodes = modelUtils.getUpdatedNodesWhenDeleteNode({
        nodes,
        deleteKey: 'c'
      })
      expect(updatedNodes).toEqual({
        b: {
          ...b,
          children: ['d']
        },
        c: null,
        e: modelUtils.createNode({
          dependencies: {
            d: true
          }
        })
      })
    })
    it('should get correct nodes when deleting a node has child which other nodes depend on it', () => {
      const e = modelUtils.createNode({
        dependencies: {
          a: true,
          c: true
        }
      })
      const nodes = { a, b, c, d, e }
      const updatedNodes = modelUtils.getUpdatedNodesWhenDeleteNode({
        nodes,
        deleteKey: 'b'
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['e']
        }),
        b: null,
        c: null,
        d: null,
        e: modelUtils.createNode({
          dependencies: {
            a: true
          }
        })
      })
    })
  })

  describe('getUpdatedNodesWhenDeleteNodes', () => {
    const a = modelUtils.createNode({
      children: ['b', 'e']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const e = modelUtils.createNode()
    const nodes = { a, b, c, d, e }
    it('should get correct nodes when deleting nodes have no children', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenDeleteNodes({
        nodes,
        deleteKeys: {
          c: true,
          e: true
        }
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['b']
        }),
        b: Object.assign({}, b, {
          children: ['d']
        }),
        c: null,
        e: null
      })
    })
    it('should get correct nodes when deleting nodes have children', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenDeleteNodes({
        nodes,
        deleteKeys: {
          b: true,
          d: true
        }
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['e']
        }),
        b: null,
        c: null,
        d: null
      })
    })
    it('should get correct nodes when deleting brothers', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenDeleteNodes({
        nodes,
        deleteKeys: {
          c: true,
          d: true
        }
      })
      expect(updatedNodes).toEqual({
        b: Object.assign({}, b, {
          children: []
        }),
        c: null,
        d: null
      })
    })
  })

  describe('copyNode', () => {
    const origin = modelUtils.createNode()
    it('should get complete copy', () => {
      const copy = modelUtils.copyNode(origin)
      expect(copy).toEqual(origin)
    })
    it('should do deep clone', () => {
      const copy = modelUtils.copyNode(origin)
      expect(copy).not.toBe(origin)
      expect(copy.children).not.toBe(origin.children)
    })
  })

  describe('getUpdatedNodesWhenChangeParent', () => {
    const a = modelUtils.createNode({
      children: ['b', 'e']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const e = modelUtils.createNode()
    const nodes = { a, b, c, d, e }
    it('should get correct nodes, pattern 1', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenChangeParent({
        nodes,
        targetKey: 'c',
        newParentKey: 'a',
        order: 1
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['b', 'c', 'e']
        }),
        b: Object.assign({}, b, {
          children: ['d']
        }),
        c,
        d,
        e
      })
    })
    it('should get correct nodes, pattern 2', () => {
      const updatedNodes = modelUtils.getUpdatedNodesWhenChangeParent({
        nodes,
        targetKey: 'e',
        newParentKey: 'd',
        order: 1
      })
      expect(updatedNodes).toEqual({
        a: Object.assign({}, a, {
          children: ['b']
        }),
        b,
        c,
        d: Object.assign({}, d, {
          children: ['e']
        }),
        e
      })
    })
  })

  describe('getNodeFrom', () => {
    const a = modelUtils.createNode({
      children: ['b']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd', 'e']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const e = modelUtils.createNode()
    const nodes = { a, b, c, d, e }
    it('should get correct key, left, has a parent', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'left',
        targetKey: 'b'
      })
      expect(res).toBe('a')
    })
    it('should get correct key, left, has no parent', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'left',
        targetKey: 'a'
      })
      expect(res).toBe(null)
    })
    it('should get correct key, right, has children', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'right',
        targetKey: 'b'
      })
      expect(res).toBe('c')
    })
    it('should get correct key, right, has no children', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'right',
        targetKey: 'e'
      })
      expect(res).toBe(null)
    })
    it('should get correct key, down, has no brothers', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'down',
        targetKey: 'b'
      })
      expect(res).toBe('b')
    })
    it('should get correct key, down, has younger brothers', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'down',
        targetKey: 'c'
      })
      expect(res).toBe('d')
    })
    it('should get correct key, down, has brothers, but has no younger brothers', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'down',
        targetKey: 'e'
      })
      expect(res).toBe('c')
    })
    it('should get correct key, up, has no brothers', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'up',
        targetKey: 'b'
      })
      expect(res).toBe('b')
    })
    it('should get correct key, up, has elder brothers', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'up',
        targetKey: 'd'
      })
      expect(res).toBe('c')
    })
    it('should get correct key, up, has brothers, but has no elder brothers', () => {
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'up',
        targetKey: 'c'
      })
      expect(res).toBe('e')
    })
    it('should get a key of the target if the to-node is hidden', () => {
      const b = modelUtils.createNode({
        children: ['c', 'd', 'e'],
        closed: true
      })
      const nodes = { a, b, c, d, e }
      const res = modelUtils.getNodeFrom({
        nodes,
        to: 'right',
        targetKey: 'b'
      })
      expect(res).toBe('b')
    })
  })

  describe('getUpdatedNodesWhenChangeChildOrder', () => {
    const a = modelUtils.createNode({
      children: ['b']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd', 'e']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const e = modelUtils.createNode()
    const nodes = { a, b, c, d, e }
    it('should get correct parent node, +1', () => {
      const res = modelUtils.getUpdatedNodesWhenChangeChildOrder({
        nodes,
        childKey: 'c',
        dif: 1
      })
      expect(res).toEqual({
        ...nodes,
        b: Object.assign({}, b, {
          children: ['d', 'c', 'e']
        })
      })
    })
    it('should get correct parent node, +1, from last', () => {
      const res = modelUtils.getUpdatedNodesWhenChangeChildOrder({
        nodes,
        childKey: 'e',
        dif: 1
      })
      expect(res).toEqual({
        ...nodes,
        b: Object.assign({}, b, {
          children: ['e', 'c', 'd']
        })
      })
    })
    it('should get correct parent node, -1', () => {
      const res = modelUtils.getUpdatedNodesWhenChangeChildOrder({
        nodes,
        childKey: 'e',
        dif: -1
      })
      expect(res).toEqual({
        ...nodes,
        b: Object.assign({}, b, {
          children: ['c', 'e', 'd']
        })
      })
    })
    it('should get correct parent node, -1, from 0', () => {
      const res = modelUtils.getUpdatedNodesWhenChangeChildOrder({
        nodes,
        childKey: 'c',
        dif: -1
      })
      expect(res).toEqual({
        ...nodes,
        b: Object.assign({}, b, {
          children: ['d', 'e', 'c']
        })
      })
    })
  })

  describe('getConnectors', () => {
    const a = modelUtils.createNode({
      children: ['b']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const nodes = { a, b, c, d }
    const positions = {
      a: { x: 0, y: 0 },
      b: { x: 50, y: 50 },
      c: { x: -50, y: -50 },
      d: { x: 100, y: 500 }
    }
    const sizes = {
      a: { width: 10, height: 20 },
      b: { width: 30, height: 50 },
      c: { width: 50, height: 20 },
      d: { width: 40, height: 40 }
    }
    it('should get correct connectors', () => {
      const res = modelUtils.getConnectors({ nodes, positions, sizes })
      expect(res).toEqual({
        'a-b': {
          sx: 10 - CONNECTOR_INNTER_MARGIN_X,
          sy: 10,
          ex: 50,
          ey: 75,
          from: 'a',
          to: 'b'
        },
        'b-c': {
          sx: 50 + CONNECTOR_INNTER_MARGIN_X,
          sy: 75,
          ex: 0,
          ey: -40,
          from: 'b',
          to: 'c'
        },
        'b-d': {
          sx: 80 - CONNECTOR_INNTER_MARGIN_X,
          sy: 75,
          ex: 100,
          ey: 520,
          from: 'b',
          to: 'd'
        }
      })
    })
    it('should ommit connectors of hidden nodes', () => {
      const a = modelUtils.createNode({
        children: ['b', 'c']
      })
      const b = modelUtils.createNode({
        children: ['d'],
        closed: true
      })
      const d = modelUtils.createNode({
        children: ['e'],
        closed: true
      })
      const e = modelUtils.createNode()
      const nodes = { a, b, c, d, e }
      const res = modelUtils.getConnectors({ nodes, positions, sizes })
      expect(res).toEqual({
        'a-b': {
          sx: 10 - CONNECTOR_INNTER_MARGIN_X,
          sy: 10,
          ex: 50,
          ey: 75,
          from: 'a',
          to: 'b'
        },
        'a-c': {
          sx: 0 - CONNECTOR_INNTER_MARGIN_X,
          sy: 10,
          ex: 0,
          ey: -40,
          from: 'a',
          to: 'c'
        }
      })
    })
    it('should get correct connectors of opposite children', () => {
      const a = modelUtils.createNode({
        oppositeChildren: ['b']
      })
      const nodes = { a, b, c, d }
      const res = modelUtils.getConnectors({ nodes, positions, sizes })
      expect(res).toEqual({
        'a-b': {
          sx: 10 - CONNECTOR_INNTER_MARGIN_X,
          sy: 10,
          ex: 50,
          ey: 75,
          from: 'a',
          to: 'b'
        },
        'b-c': {
          sx: 50 + CONNECTOR_INNTER_MARGIN_X,
          sy: 75,
          ex: 0,
          ey: -40,
          from: 'b',
          to: 'c'
        },
        'b-d': {
          sx: 80 - CONNECTOR_INNTER_MARGIN_X,
          sy: 75,
          ex: 100,
          ey: 520,
          from: 'b',
          to: 'd'
        }
      })
    })
  })

  describe('getDependencyConnectors', () => {
    const a = modelUtils.createNode({
      children: ['b']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode({
      dependencies: {
        c: true
      }
    })
    const nodes = { a, b, c, d }
    const positions = {
      a: { x: 0, y: 0 },
      b: { x: 50, y: 50 },
      c: { x: -50, y: -50 },
      d: { x: 100, y: 500 }
    }
    const sizes = {
      a: { width: 10, height: 20 },
      b: { width: 30, height: 50 },
      c: { width: 50, height: 20 },
      d: { width: 40, height: 40 }
    }
    it('should get correct dependent connectors', () => {
      const res = modelUtils.getDependencyConnectors({
        nodes,
        positions,
        sizes
      })
      expect(res).toEqual({
        'depend_c-d': {
          sx: -50 + 50,
          sy: -50 + 20 / 2,
          ex: 100,
          ey: 500 + 40 / 2,
          from: 'c',
          to: 'd'
        }
      })
    })
    it('should ommit dependent connectors of hidden nodes', () => {
      const b = modelUtils.createNode({
        children: ['c', 'd'],
        closed: true
      })
      const d = modelUtils.createNode({
        dependencies: {
          a: true
        }
      })
      const nodes = { a, b, c, d }
      const res = modelUtils.getDependencyConnectors({
        nodes,
        positions,
        sizes
      })
      expect(res).toEqual({})
    })
  })

  describe('getBetterConnector', () => {
    const a = modelUtils.createNode({
      children: ['b', 'e']
    })
    const b = modelUtils.createNode({
      children: ['c', 'd']
    })
    const c = modelUtils.createNode()
    const d = modelUtils.createNode()
    const e = modelUtils.createNode()
    const nodes = { a, b, c, d, e }
    const positions = {
      a: { x: 0, y: 0 },
      b: { x: 50, y: 50 },
      c: { x: 100, y: -50 },
      d: { x: 100, y: 500 },
      e: { x: 50, y: 500 }
    }
    const sizes = {
      a: { width: 10, height: 20 },
      b: { width: 30, height: 50 },
      c: { width: 50, height: 20 },
      d: { width: 40, height: 40 },
      e: { width: 40, height: 40 }
    }
    it('should get expected connectos, newChildOrder = elderest', () => {
      const res = modelUtils.getBetterConnector({
        nodes,
        sizes,
        positions,
        targetKey: 'd',
        newParentKey: 'a',
        newChildOrder: 0
      })
      expect(res).toEqual({
        sx: 10 - CONNECTOR_INNTER_MARGIN_X,
        sy: 10,
        ex: 50,
        ey: 50 - NODE_MARGIN_Y / 2
      })
    })
    it('should get expected connectos, newChildOrder is neither elderest nor youngest', () => {
      const res = modelUtils.getBetterConnector({
        nodes,
        sizes,
        positions,
        targetKey: 'd',
        newParentKey: 'a',
        newChildOrder: 1
      })
      expect(res).toEqual({
        sx: 10 - CONNECTOR_INNTER_MARGIN_X,
        sy: 10,
        ex: 50,
        ey: 300
      })
    })
    it('should get expected connectos, newChildOrder is youngest', () => {
      const res = modelUtils.getBetterConnector({
        nodes,
        sizes,
        positions,
        targetKey: 'd',
        newParentKey: 'a',
        newChildOrder: 2
      })
      expect(res).toEqual({
        sx: 10 - CONNECTOR_INNTER_MARGIN_X,
        sy: 10,
        ex: 50,
        ey: 500 + 40 + NODE_MARGIN_Y / 2
      })
    })
    it('should get expected connectos, newParent has no children', () => {
      const res = modelUtils.getBetterConnector({
        nodes,
        sizes,
        positions,
        targetKey: 'e',
        newParentKey: 'c',
        newChildOrder: 0
      })
      expect(res).toEqual({
        sx: 150 - CONNECTOR_INNTER_MARGIN_X,
        sy: -40,
        ex: 150 + NODE_MARGIN_X,
        ey: -40
      })
    })
  })
  describe('getNodeDiff', () => {
    it('should get diff of nodes', () => {
      const nodes = {
        a: modelUtils.createNode({
          text: '1'
        }),
        b: modelUtils.createNode({
          text: '4'
        })
      }
      const updatedNodes = {
        a: modelUtils.createNode({
          text: '1'
        }),
        b: modelUtils.createNode({
          text: '6'
        }),
        c: modelUtils.createNode()
      }
      const res = modelUtils.getNodeDiff({
        nodes,
        updatedNodes
      })
      expect(res).toEqual({
        b: modelUtils.createNode({
          text: '6'
        }),
        c: modelUtils.createNode()
      })
      expect(res.a).toBe(undefined)
    })
  })
  it('should get diff of nodes if next node is deleted', () => {
    const nodes = {
      a: modelUtils.createNode({
        text: '1'
      })
    }
    const updatedNodes = {
      a: null
    }
    const res = modelUtils.getNodeDiff({
      nodes,
      updatedNodes
    })
    expect(res).toEqual({
      a: null
    })
  })
  describe('isConflict', () => {
    it('should return false if all nodes have parent', () => {
      const nodes = {
        [ROOT_NODE]: modelUtils.createNode({
          children: ['b']
        }),
        b: modelUtils.createNode({
          children: []
        })
      }
      const res = modelUtils.isConflict({
        nodes
      })
      expect(res).toBe(false)
    })
  })
  it('should return true if nodes except for [ROOT_NODE] do not have parent', () => {
    const nodes = {
      [ROOT_NODE]: modelUtils.createNode({
        children: []
      }),
      b: modelUtils.createNode({
        children: []
      })
    }
    const res = modelUtils.isConflict({
      nodes
    })
    expect(res).toBe(true)
  })
  it('should return true if children are not found', () => {
    const nodes = {
      [ROOT_NODE]: modelUtils.createNode({
        children: ['a', 'b']
      }),
      b: modelUtils.createNode({
        children: []
      })
    }
    const res = modelUtils.isConflict({
      nodes
    })
    expect(res).toBe(true)
  })
  it('should return true if dependent nodes are not found', () => {
    const nodes = {
      [ROOT_NODE]: modelUtils.createNode({
        children: ['a', 'b']
      }),
      a: modelUtils.createNode({
        children: [],
        dependencies: {
          c: true
        }
      }),
      b: modelUtils.createNode({
        children: []
      })
    }
    const res = modelUtils.isConflict({
      nodes
    })
    expect(res).toBe(true)
  })
  describe('rescueConflict', () => {
    it('should omit nodes which have unreal parent, except for [ROOT_NODE]', () => {
      const nodes = {
        [ROOT_NODE]: modelUtils.createNode({
          children: []
        }),
        b: modelUtils.createNode({
          children: []
        })
      }
      const res = modelUtils.rescueConflict({
        nodes
      })
      expect(res).toEqual({
        [ROOT_NODE]: modelUtils.createNode({
          children: []
        }),
        b: null
      })
    })
    it('should omit children which are not exist', () => {
      const nodes = {
        [ROOT_NODE]: modelUtils.createNode({
          children: ['a', 'b']
        }),
        b: modelUtils.createNode({
          children: ['c']
        })
      }
      const res = modelUtils.rescueConflict({
        nodes
      })
      expect(res).toEqual({
        [ROOT_NODE]: modelUtils.createNode({
          children: ['b']
        }),
        b: modelUtils.createNode({
          children: []
        })
      })
    })
    it('should omit dependencies which are not exist', () => {
      const nodes = {
        [ROOT_NODE]: modelUtils.createNode({
          children: ['a', 'b']
        }),
        a: modelUtils.createNode({
          children: [],
          dependencies: {
            c: true
          }
        }),
        b: modelUtils.createNode({
          children: []
        })
      }
      const res = modelUtils.rescueConflict({
        nodes
      })
      expect(res).toEqual({
        [ROOT_NODE]: modelUtils.createNode({
          children: ['a', 'b']
        }),
        a: modelUtils.createNode({
          children: [],
          dependencies: {}
        }),
        b: modelUtils.createNode({
          children: []
        })
      })
    })
  })
  describe('getHiddenNodes', () => {
    it('should get currect hidden nodes having children', () => {
      const nodes = {
        [ROOT_NODE]: modelUtils.createNode({
          children: ['a', 'b']
        }),
        a: modelUtils.createNode({
          children: ['c'],
          closed: true
        }),
        b: modelUtils.createNode(),
        c: modelUtils.createNode()
      }
      const res = modelUtils.getHiddenNodes({
        nodes
      })
      expect(res).toEqual({
        c: true
      })
    })
    it('should get currect hidden nodes having grandsons', () => {
      const nodes = {
        [ROOT_NODE]: modelUtils.createNode({
          children: ['a', 'b'],
          closed: true
        }),
        a: modelUtils.createNode({
          children: ['c']
        }),
        b: modelUtils.createNode(),
        c: modelUtils.createNode()
      }
      const res = modelUtils.getHiddenNodes({
        nodes
      })
      expect(res).toEqual({
        a: true,
        b: true,
        c: true
      })
    })
  })
})
