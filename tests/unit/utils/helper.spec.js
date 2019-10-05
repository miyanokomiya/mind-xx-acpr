import * as target from '@/utils/helper'

describe('@/utils/helper.js', () => {
  describe('dateTimeFormat', () => {
    it('returns formatted date string', () => {
      expect(target.dateTimeFormat(new Date('Sat Oct 05 2019 15:56:15'))).toBe(
        '2019/10/05 15:56:15',
      )
    })
  })

  describe('dateFormat', () => {
    it('returns formatted date string', () => {
      expect(target.dateFormat(new Date('Sat Oct 05 2019 15:56:15'))).toBe('2019/10/05')
    })
  })
})
