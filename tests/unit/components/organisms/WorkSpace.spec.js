import { mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Target from '@/components/organisms/WorkSpace.vue'
import * as model from '@/utils/model.js'

const vuetify = new Vuetify()

describe('components/organisms/WorkSpace.vue', () => {
  describe('snapshot', () => {
    const user = model.createUser({ uid: 'u' })

    const file_a = model.createFile({ name: 'file_a', nodeCount: 1 })
    const file_b = model.createFile({ name: 'file_b', nodeCount: 2 })
    const file_c = model.createFile({ name: 'file_c', nodeCount: 2 })

    it('default', () => {
      const wrapper = mount(Target, {
        propsData: {
          user,
          files: { a: file_a, file_c },
          fileAuthorities: { a: model.createFileAuthority({ public: { write: true } }) },
          sharedFiles: { b: file_b },
          sharedFileAuthorities: { b: model.createFileAuthority() },
        },
        vuetify,
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('shared', async () => {
      const wrapper = mount(Target, {
        propsData: {
          user,
          files: { a: file_a },
          fileAuthorities: { a: model.createFileAuthority() },
          sharedFiles: { b: file_b },
          sharedFileAuthorities: {
            b: model.createFileAuthority({
              users: { u: { write: true } },
            }),
          },
        },
        vuetify,
      })
      await wrapper.setData({ dataKind: 'shared' })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('workSpace', async () => {
      const wrapper = mount(Target, {
        propsData: {
          user,
          files: { a: file_a },
          fileAuthorities: { a: model.createFileAuthority() },
          sharedFiles: { b: file_b },
          sharedFileAuthorities: { b: model.createFileAuthority() },
        },
        vuetify,
      })
      await wrapper.setData({ dataKind: 'workSpace' })
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    describe('changeName', () => {
      it('emit', () => {
        const file_a = model.createFile({ name: 'file_a', nodeCount: 1 })
        const wrapper = shallowMount(Target, {
          propsData: {
            files: { a: file_a },
          },
        })
        wrapper.vm.changeName({ key: 'a', name: 'new name' })
        expect(wrapper.emitted('changeName')).toEqual([
          [
            {
              files: {
                a: {
                  ...file_a,
                  name: 'new name',
                },
              },
            },
          ],
        ])
      })
    })

    describe('createFile', () => {
      it('emit', () => {
        const wrapper = shallowMount(Target)
        wrapper.vm.createFile()
        expect(wrapper.emitted('createFile')).toEqual([
          [
            {
              file: { name: '' },
            },
          ],
        ])
        expect(wrapper.vm.pagination.sortBy).toBe('updated')
        expect(wrapper.vm.pagination.descending).toBe(true)
      })
    })

    describe('deleteFile', () => {
      it('emit', () => {
        const wrapper = shallowMount(Target)
        expect(wrapper.vm.snackbar).toBe(false)
        wrapper.vm.deleteFile('a')
        expect(wrapper.vm.snackbar).toBe(true)
        wrapper.vm.deleteFile('a')
        expect(wrapper.emitted('deleteFiles')).toEqual([
          [
            {
              files: { a: null },
            },
          ],
        ])
        expect(wrapper.vm.snackbar).toBe(false)
      })
    })

    describe('cloneFile', () => {
      it('emit', () => {
        const file_a = model.createFile({ name: 'file_a', nodeCount: 1 })
        const wrapper = shallowMount(Target, {
          propsData: {
            files: { a: file_a },
          },
        })
        wrapper.vm.cloneFile('a')
        expect(wrapper.emitted('cloneFile')).toEqual([[{ fileKey: 'a' }]])
      })
    })
  })
})
