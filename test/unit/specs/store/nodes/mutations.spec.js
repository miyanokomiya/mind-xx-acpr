import mutations from '@/store/nodes/mutations'
import { mutationTypes } from '@/store/nodes/types'

describe('store/nodes/mutations', () => {
  describe('UPDATE_NODES', () => {
    it('should update correct [nodes]', () => {
      const state = {
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 },
          c: { x: 40, y: 40 }
        }
      }
      mutations[mutationTypes.UPDATE_NODES](state, {
        nodes: {
          b: { x: 20, y: 30 },
          c: null,
          d: { x: 40, y: 40 }
        }
      })
      expect(state).toMatchObject({
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 20, y: 30 },
          d: { x: 40, y: 40 }
        }
      })
    })
  })
})
