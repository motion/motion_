import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react'

export default (Main, opts) => {
  console.log('running', Main, opts)
  opts.render(Main)
}
