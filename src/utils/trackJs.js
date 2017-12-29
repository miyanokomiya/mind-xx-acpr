import Vue from 'vue'

if (!window.trackJs) {
  window.trackJs = {
    track () {
      console.log('trackJs', arguments)
    }
  }
}

Vue.config.errorHandler = (err, vm, info) => {
  // Log properties passed to the component if there are any
  if (vm.$options.propsData) {
    console.log('Props passed to component', vm.$options.propsData)
  }

  // Emit component name and also the lifecycle hook the error occured in if present
  var infoMessage = `Error in component: <${vm.$options.name} />\n`
  if (info) {
    infoMessage += `Error occurred during lifecycle hook: ${info}\n`
  }

  // This puts the additional error information in the Telemetry Timeline
  console.log(infoMessage)

  // Track the native JS error
  window.trackJs.track(err)
}
