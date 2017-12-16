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

  describe('getCenterOfRectangle', () => {
    it('should calc correct center', () => {
      const rectangle = { x: 0, y: 20, width: 30, height: 30 }
      const res = geometry.getCenterOfRectangle(rectangle)
      expect(res).toMatchObject({ x: 15, y: 35 })
    })
  })

  describe('getDistance', () => {
    it('should calc correct distance', () => {
      const p1 = { x: 0, y: 0 }
      const p2 = { x: 3, y: -4 }
      const res = geometry.getDistance(p1, p2)
      expect(res).toBe(5)
    })
  })

  describe('getClosestRectangle', () => {
    const rectangles = {
      a: { x: 0, y: 0, width: 10, height: 10 },
      b: { x: 10, y: 10, width: 20, height: 20 },
      c: { x: 20, y: 20, width: 30, height: 30 },
      d: { x: 30, y: 30, width: 40, height: 40 }
    }
    it('should calc correct key, pattern 1', () => {
      const target = { x: 20, y: 20, width: 30, height: 30 }
      const res = geometry.getClosestRectangle({ rectangles, target })
      expect(res).toBe('c')
    })
    it('should calc correct key, pattern 2', () => {
      const target = { x: 5, y: 5, width: 10, height: 30 }
      const res = geometry.getClosestRectangle({ rectangles, target })
      expect(res).toBe('b')
    })
    it('should calc correct key, pattern 3', () => {
      const target = { x: 5, y: 5, width: 10, height: 1000 }
      const res = geometry.getClosestRectangle({ rectangles, target })
      expect(res).toBe('d')
    })
  })
})
