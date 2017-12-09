import { storiesOf } from '@storybook/vue'
import { text } from '@storybook/addon-knobs'

import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'

storiesOf('molecules/svg/SvgTextRectangle', module).add('story', () => {
  const text1 = text('Text', 'editable text')
  return {
    components: { SvgTextRectangle },
    template: `
        <svg-wrapper>
          <SvgTextRectangle :x="10" :y="10" text="text"/>
          <SvgTextRectangle :x="10" :y="40" :rx="10" :ry="5" fill="yellow"  text="あいうえお"/>
          <SvgTextRectangle :x="10" :y="70" stroke="none" fill="yellow"  text="大三元gggWWW\nQQQpppp"/>
          <SvgTextRectangle :x="10" :y="130" :rx="10" :ry="5" fill="yellow"  :text="text1"/>
        </svg-wrapper>
      `,
    data: () => ({
      text1: `${text1}`
    })
  }
})
