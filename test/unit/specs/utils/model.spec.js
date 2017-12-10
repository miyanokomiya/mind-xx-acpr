import * as modelUtils from '@/utils/model'
import {
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
  NODE_ADDITIONAL_MARGIN_X_RATE
} from '@/constants'

describe('utils/model', () => {
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
          height: 500 + 400
        },
        b: {
          width: 20 + 50,
          height: 500 + 400
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
      expect(positions.a).toMatchObject({
        x: 0,
        y: 0
      })
      expect(positions.b).toMatchObject({
        x: 10 + NODE_MARGIN_X + (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE,
        y: -200 / 2 + 100 / 2
      })
      expect(positions.c).toMatchObject({
        x:
          10 +
          20 +
          NODE_MARGIN_X * 2 +
          (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE * 2,
        y: -200 / 2 + 100 / 2 - (500 + 400) / 2 + 200 / 2
      })
      expect(positions.d).toMatchObject({
        x:
          10 +
          20 +
          NODE_MARGIN_X * 2 +
          (500 + 400) * NODE_ADDITIONAL_MARGIN_X_RATE * 2,
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
          height: 100
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
          height: 200
        },
        b: {
          width: 20,
          height: 200
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
          height: 200 + 500 + 400 + NODE_MARGIN_Y * 2
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
          height: 500 + 400 + NODE_MARGIN_Y
        },
        b: {
          width: 20 + 50 + NODE_MARGIN_X,
          height: 500 + 400 + NODE_MARGIN_Y
        },
        c: {
          width: 50,
          height: 500
        },
        d: {
          width: 40,
          height: 400
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
    it('should get null when no parent ', () => {
      const parentKey = modelUtils.getParentKey({
        nodes,
        childKey: 'a'
      })
      expect(parentKey).toBe(null)
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
      children: ['c']
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
          children: ['c', 'b']
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
  })
})
