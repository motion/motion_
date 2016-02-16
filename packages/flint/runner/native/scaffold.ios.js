/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry, Text, Component, View
} from 'react-native'
global.React = React
global.isNative = true

let renderFn = () => {}

setTimeout(() => {
  require(`/Users/nickc/flint/packages/flint.js/dist/flint.native.js`)
  console.log('flint is', global.Flint)
  Flint.init()
  Flint = Flint.run("flintapp-basic", {
    render(el) { renderFn(el) }
  })

  console.log('about to require main.js')

  require('./.internal/out/main.js')
  Flint.start()
}, 100)

let Main = <Text>Loading Application</Text>
const App = class extends Component {
  constructor() {
    super()
    renderFn = el => {
      console.log('got new el', el)
      Main = el
      this.forceUpdate()
    }
    return null
  }
  render() {
    return <View>{Main}</View>
  }
}

AppRegistry.registerComponent('app', () => App)
