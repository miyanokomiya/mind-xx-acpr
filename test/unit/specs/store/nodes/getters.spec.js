import getters from '@/store/nodes/getters'
import { getterTypes } from '@/store/nodes/types'

describe('store/nodes/getters', () => {
  describe('NODES', () => {
    it('should get correct [nodes]', () => {
      const state = {
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 }
        }
      }
      const res = getters[getterTypes.NODES](state)
      expect(res).toMatchObject({
        a: { x: 0, y: 0 },
        b: { x: 10, y: 10 }
      })
    })
  })
  describe('SELECTED_NODES', () => {
    it('should get correct [selectedNodes]', () => {
      const state = {
        selectedNodes: {
          a: true,
          b: true
        }
      }
      const res = getters[getterTypes.SELECTED_NODES](state)
      expect(res).toMatchObject({
        a: true,
        b: true
      })
    })
  })
})
