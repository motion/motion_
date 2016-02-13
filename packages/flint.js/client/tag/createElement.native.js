import React from 'react'

import { isString, isNumber, every,
         includes, isFunction,
         pick, difference, omit } from 'lodash'
import getElement from './getElement'
import elementStyles from './styles'
import elementProps from './props'
import stringifyObjects from './stringifyObjects'

/*

  Shim around React.createElement, that adds in our:

     - tag helpers (sync, yield, repeat, if, ...)
     - styling (radium, css classes, ...)
     - object to string

*/

const { Image, Text, View,
        TouchableWithoutFeedback, Textbox } = React
const isSimple = el => isString(el) || isNumber(el)

function createTag(el, props, children) {
  if (el == React.Image) return createImage(el, props, children)
  return React.createElement(el, props, ...args)
}

const textStyles = [
  'fontSize', 'font', 'color',
  'fontWeight', 'textAlign', 'letterSpacing',
]

const getInstance = {
  img(name, props, children) {
    const style = { width: props.style.width, height: props.style.height }

    // src -> uri: src
    if (props.src) {
      props.source = { uri: props.src }
      delete props.src
    }

    const imgProps = omit(props, 'key')

    // handle source to uri: src
    return <TouchableWithoutFeedback key={props.key} style={style} onPress={props.onPress}>
      <Image {...imgProps} />
    </TouchableWithoutFeedback>
  },
  text(name, props, children) {
    const style = props.style
    props.style = omit(style, textStyles)

    // const onEvents = Object.keys(props).filter(name => name.substr(0,2) === 'on')

    const textStyle = pick(style, textStyle)
    // const textEvents = pick(props, onEvents)
    const textProps = { style: textStyle }// Object.assign({}, textStyles, textEvents)

    return <TouchableWithoutFeedback {...props}>
      <Text onPress={() => { console.log('press text')}} {...textProps}>{children}</Text>
    </TouchableWithoutFeedback>
  },
  view(name, props, children) {
    props.style = omit(props.style, textStyles)
    if (children.length === 1) {
      return <TouchableWithoutFeedback {...props}>{children}</TouchableWithoutFeedback>
    } else {
      return <View {...props}>{children}</View>
    }
  },
  input(name, props, children) {
    return <Textbox {...props} />
  },
}

function getNativeEl(tag, props, children) {
  if (!isString(tag)) return React.createElement(tag, props, children)

  const special = ['img', 'input']
  const name = includes(special, tag) ? tag : 'view'

  const textStyle = pick(props.style || {}, textStyles)

  let keyID = 0
  const toS = s => isString(s) ? s : s.toString()
  children = children
    .map(el => isSimple(el) ? <Text key={keyID++} style={textStyle}>{toS(el)}</Text> : el)

  if (children.length === 1) children = children[0]

  return getInstance[name](name, props, children)
}

export default function createElement(identifier : Identifier, _props, ...args) {
  if (_props && _props.__skipFlint)
    return React.createElement(identifier[1], _props, ...args)

  const view = this
  const Flint = view.Flint
  const el: Element = getElement(identifier, view, _props, Flint.getView)

  // debugger

  const props = elementProps(el, view, Flint, _props)
  props.style = elementStyles(el, view, props)

  // TODO option to disable object stringifying
  if (!process.env.production)
    args = stringifyObjects(el, args, view)

  const tag = props.tagName || (el.whitelisted ? 'div' : el.component || el.name)

  // image source
  // img src -> Image source={uri}
  if (props.style && props.style.native) {
    Object.assign(props.style, props.style.native)
    delete props.style.native
  }

  if (props.style && props.style.web) delete props.style.web
  if (props.onClick || !props.onPress) {
    props.onPress = props.onClick
    delete props.onClick
  }

  return getNativeEl(tag, props, args)
}
