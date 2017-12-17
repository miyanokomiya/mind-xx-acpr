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

  describe('getRelationBetweenRectangleAndPoint', () => {
    const rectangle = {
      x: 0,
      y: 0,
      width: 10,
      height: 10
    }
    it('should calc correct relation, 1', () => {
      const point = { x: -5, y: -5 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(1)
    })
    it('should calc correct relation, 2', () => {
      const point = { x: 5, y: -5 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(2)
    })
    it('should calc correct relation, 3', () => {
      const point = { x: 15, y: -5 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(3)
    })
    it('should calc correct relation, 4', () => {
      const point = { x: -5, y: 5 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(4)
    })
    it('should calc correct relation, 5', () => {
      const point = { x: 8, y: 3 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(5)
    })
    it('should calc correct relation, 6', () => {
      const point = { x: 15, y: 5 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(6)
    })
    it('should calc correct relation, 7', () => {
      const point = { x: -5, y: 15 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(7)
    })
    it('should calc correct relation, 8', () => {
      const point = { x: 5, y: 15 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(8)
    })
    it('should calc correct relation, 9', () => {
      const point = { x: 15, y: 15 }
      const res = geometry.getRelationBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(9)
    })
  })

  describe('getDistanceBetweenRectangleAndPoint', () => {
    const rectangle = {
      x: 0,
      y: 0,
      width: 10,
      height: 10
    }
    it('should calc correct distance, 1', () => {
      const point = { x: -3, y: -4 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(5)
    })
    it('should calc correct distance, 2', () => {
      const point = { x: 5, y: -4 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(4)
    })
    it('should calc correct distance, 3', () => {
      const point = { x: 13, y: -4 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(5)
    })
    it('should calc correct distance, 4', () => {
      const point = { x: -3, y: 5 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(3)
    })
    it('should calc correct distance, 5', () => {
      const point = { x: 3, y: 4 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(0)
    })
    it('should calc correct distance, 6', () => {
      const point = { x: 13, y: 4 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(3)
    })
    it('should calc correct distance, 7', () => {
      const point = { x: -3, y: 14 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(5)
    })
    it('should calc correct distance, 8', () => {
      const point = { x: 3, y: 14 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(4)
    })
    it('should calc correct distance, 9', () => {
      const point = { x: 13, y: 14 }
      const res = geometry.getDistanceBetweenRectangleAndPoint({
        rectangle,
        point
      })
      expect(res).toBe(5)
    })
  })

  describe('getClosestRectangleByPoint', () => {
    const rectangles = {
      a: { x: 0, y: 0, width: 10, height: 10 },
      b: { x: 10, y: 10, width: 20, height: 20 },
      c: { x: 20, y: 20, width: 30, height: 30 },
      d: { x: 30, y: 30, width: 40, height: 40 }
    }
    it('should calc correct key, pattern 1', () => {
      const point = { x: 35, y: 20 }
      const res = geometry.getClosestRectangleByPoint({ rectangles, point })
      expect(res).toBe('c')
    })
    it('should calc correct key, pattern 2', () => {
      const point = { x: 15, y: 8 }
      const res = geometry.getClosestRectangleByPoint({ rectangles, point })
      expect(res).toBe('b')
    })
  })
})
