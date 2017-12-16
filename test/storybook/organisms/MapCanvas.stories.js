import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import MapCanvas from '@/components/organisms/MapCanvas'

import { createNode } from '@/utils/model'

const methods = {
  updateNodes (nextNodes) {
    Object.keys(nextNodes).forEach(key => {
      if (nextNodes[key]) {
        Vue.set(this.nodes, key, nextNodes[key])
      } else {
        Vue.delete(this.nodes, key)
      }
    })
  },
  createNode (createNodes) {
    this.nodes = Object.assign({}, this.nodes, createNodes)
  }
}

storiesOf('organisms/MapCanvas', module)
  .add('some nodes', () => {
    const root = createNode({
      text: 'root',
      children: ['a', 'b', 'c']
    })
    return {
      components: { MapCanvas },
      template: `
      <v-app>
        <div>
          <MapCanvas
            :nodes="nodes"
            @updateNodes="updateNodes"
            @createNode="createNode"
          />
        </div>
      </v-app>
      `,
      data: () => ({
        nodes: {
          root,
          a: createNode({ text: 'aaaa', children: ['d'] }),
          b: createNode({ text: 'bbbbbbbbbbbbbbbbbbbbbbbbb' }),
          c: createNode({ text: 'cccc' }),
          d: createNode({ text: 'dddd' })
        }
      }),
      methods
    }
  })
  .add('many nodes', () => {
    return {
      components: { MapCanvas },
      template: `
      <v-app>
        <div>
          <MapCanvas
            :width="600"
            :height="500"
            :nodes="nodes"
            :selectKeys="selectKeys"
            @updateNodes="updateNodes"
            @createNode="createNode"
          />
        </div>
      </v-app>
      `,
      data: () => ({
        nodes: {
          root: {
            text:
              'root\nfefa\nfesf\nse\nff\ns\nf\nsef\ns\nfs\nf\nsfse\nf\nsef\nfefef',
            children: ['a', 'key_0.508391830846717', 'key_0.7926114238450479']
          },
          a: {
            text: 'aaaa\nfef',
            children: ['key_0.8647900305998089', 'key_0.32390893637177665']
          },
          'key_0.8647900305998089': {
            text: 'fwef\nfefe\ndad\ndwadf\nfefe',
            children: ['key_0.9907358047515797', 'key_0.7458344838527207']
          },
          'key_0.32390893637177665': {
            text: 'fe\nfef\nfe',
            children: ['key_0.32023221676966585', 'key_0.13200816582385477']
          },
          'key_0.32023221676966585': { text: '', children: [] },
          'key_0.13200816582385477': {
            text: '',
            children: ['key_0.1081131244932998', 'key_0.3289132386379947']
          },
          'key_0.9907358047515797': {
            text: 'ffe\nfaefe',
            children: ['key_0.07479360067522389']
          },
          'key_0.7458344838527207': { text: '', children: [] },
          'key_0.07479360067522389': { text: '', children: [] },
          'key_0.7926114238450479': { text: '', children: [] },
          'key_0.508391830846717': {
            text: 'f\nf\ne\nf\nesfesfsfsfseee33ee3e',
            children: [
              'key_0.07114884878750471',
              'key_0.2729369976005753',
              'key_0.7776011738601232'
            ]
          },
          'key_0.1081131244932998': { text: '', children: [] },
          'key_0.3289132386379947': { text: '', children: [] },
          'key_0.07114884878750471': {
            text: 'ef\nesfsefe',
            children: ['key_0.6229181115748166']
          },
          'key_0.2729369976005753': { text: '', children: [] },
          'key_0.7776011738601232': { text: '', children: [] },
          'key_0.6229181115748166': { text: '', children: [] }
        },
        selectKeys: {}
      }),
      methods
    }
  })
