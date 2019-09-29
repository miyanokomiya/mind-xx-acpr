import { storiesOf } from '@storybook/vue'
import { text } from '@storybook/addon-knobs'

import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'

storiesOf('molecules/svg/SvgTextRectangle', module)
  .add('story', () => {
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
  .add('link', () => {
    return {
      components: { SvgTextRectangle },
      template: `
        <svg-wrapper>
          <SvgTextRectangle :x="10" :y="10" text="https://mind-xx-acpr.firebaseapp.com/map/-L1k9pQdQ248amP4NQOe"/>
          <SvgTextRectangle :x="10" :y="40" text="あいうえお\nhttps://mind-xx-acpr.firebaseapp.com/map/-L1k9pQdQ248amP4NQOe\nかきくけこ"/>
        </svg-wrapper>
      `,
      data: () => ({})
    }
  })
  .add('closed', () => {
    return {
      components: { SvgTextRectangle },
      template: `
        <svg-wrapper>
          <SvgTextRectangle :x="10" :y="10" text="abcde fef" fill="white" :hiddenFamilyCount="1" :childrenCount="2" />
          <SvgTextRectangle :x="10" :y="60" text="abcde fef" fill="red" :hiddenFamilyCount="2" :childrenCount="2" />
          <SvgTextRectangle :x="10" :y="110" text="abcde fef" fill="blue" :hiddenFamilyCount="33" :childrenCount="2" />
          <SvgTextRectangle :x="10" :y="160" text="abcde fef" fill="blue" :hiddenFamilyCount="332" :childrenCount="2" />
          <SvgTextRectangle :x="10" :y="210" text="abcde fef" fill="blue" :hiddenFamilyCount="3232" :childrenCount="2" />

          <SvgTextRectangle :x="-100" :y="10" text="abcde fef" fill="white" :hiddenFamilyCount="1" :childrenCount="2" />
          <SvgTextRectangle :x="-100" :y="60" text="abcde fef" fill="red" :hiddenFamilyCount="2" :childrenCount="2" />
          <SvgTextRectangle :x="-100" :y="110" text="abcde fef" fill="blue" :hiddenFamilyCount="33" :childrenCount="2" />
          <SvgTextRectangle :x="-100" :y="160" text="abcde fef" fill="blue" :hiddenFamilyCount="332" :childrenCount="2" />
          <SvgTextRectangle :x="-100" :y="210" text="abcde fef" fill="blue" :hiddenFamilyCount="3232" :childrenCount="2" />
        </svg-wrapper>
      `,
      data: () => ({})
    }
  })
  .add('comments', () => {
    return {
      components: { SvgTextRectangle },
      template: `
        <svg-wrapper>
          <SvgTextRectangle :x="50" :y="10" text="abcde fef" fill="white" :commentCount="1"/>
          <SvgTextRectangle :x="50" :y="60" text="abcde fef" fill="red" :commentCount="2"/>
          <SvgTextRectangle :x="50" :y="110" text="abcde fef" fill="blue" :commentCount="33"/>
          <SvgTextRectangle :x="50" :y="160" text="abcde fef" fill="blue" :commentCount="332"/>
          <SvgTextRectangle :x="50" :y="210" text="abcde fef" fill="blue" :commentCount="3232"/>
        </svg-wrapper>
      `,
      data: () => ({})
    }
  })
  .add('checkbox', () => {
    return {
      components: { SvgTextRectangle },
      template: `
        <svg-wrapper>
          <SvgTextRectangle :x="50" :y="10" text="abcde fef" fill="white" check :checked="checked" @toggleChecked="val => checked = val"/>
          <SvgTextRectangle :x="50" :y="50" text="abcde fef\nbbbbb\neeee" fill="white" check :checked="checked" @toggleChecked="val => checked = val"/>
        </svg-wrapper>
      `,
      data: () => ({
        checked: 0
      })
    }
  })
