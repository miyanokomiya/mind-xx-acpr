import * as geometry from '@/utils/geometry'

describe('utils/geometry', () => {
  describe('getCoveredRectangle', () => {
    it('should calc correct rectangle covered a rectangle', () => {
      const positions = {
        a: {
          x: 0,
          y: 10
        }
      }
      const sizes = {
        a: {
          width: 100,
          height: 200
        }
      }
      const rec = geometry.getCoveredRectangle({ positions, sizes })
      expect(rec).toMatchObject({
        x: 0,
        y: 10,
        width: 100,
        height: 200
      })
    })
    it('should calc correct rectangle covered two rectangles', () => {
      const positions = {
        a: {
          x: 10,
          y: 10
        },
        b: {
          x: -10,
          y: 40
        }
      }
      const sizes = {
        a: {
          width: 100,
          height: 200
        },
        b: {
          width: 50,
          height: 200
        }
      }
      const rec = geometry.getCoveredRectangle({ positions, sizes })
      expect(rec).toMatchObject({
        x: -10,
        y: 10,
        width: 120,
        height: 230
      })
    })
    it('should calc correct rectangle and ignore incomplete arguments', () => {
      const positions = {
        a: {
          x: 10,
          y: 10
        },
        c: {
          x: -10,
          y: 40
        }
      }
      const sizes = {
        a: {
          width: 100,
          height: 200
        },
        b: {
          width: 50,
          height: 200
        }
      }
      const rec = geometry.getCoveredRectangle({ positions, sizes })
      expect(rec).toMatchObject({
        x: 10,
        y: 10,
        width: 100,
        height: 200
      })
    })
  })
})
