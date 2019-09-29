import Vue from 'vue'

const windowStatePlugin = {
  install: function(Vue) {
    // ウィンドウの状態
    var state = {
      scrollX: 0,
      scrollY: 0,
      width: 0,
      height: 0,
    }
    // // スクロール数値を取得
    // var onScroll = function () {
    //   state.scrollX = window.pageXOffset
    //   state.scrollY = window.pageYOffset
    // }
    // document.addEventListener('scroll', onScroll)
    // ウィンドウのサイズを取得
    var onResize = function() {
      state.width = document.documentElement.clientWidth
      state.height = document.documentElement.clientHeight
    }
    window.addEventListener('resize', onResize)
    onResize()

    // // 初期値を更新
    // window.addEventListener('load', onScroll)
    // プロパティ $window を定義
    Vue.util.defineReactive(Vue.prototype, '$window', state)
  },
}
Vue.use(windowStatePlugin)
