import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react'

export default () => {
  const App = class extends Component {
    render() {
      return <Text>hello native</Text>
    }
  }

  AppRegistry.registerComponent('project', () => App)
}
