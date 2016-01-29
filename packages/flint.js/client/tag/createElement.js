// import React from 'react'
import type { Identifier, Element } from './types'

// import React from 'react'
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

const DIV = 'div'

// curried to accept React
export default function createElement(React, identifier : Identifier, _props, ...args) {
  // TODO remove or document
  if (_props && _props.__skipFlint)
    return this.React.createElement(identifier[1], _props, ...args)

  const view = this
  const Flint = view.Flint

  const el: Element = getElement(identifier, view, _props, Flint.getView)
  const props = elementProps(el, view, Flint, _props)
  props.style = elementStyles(el, view, props)

  // TODO option to disable object stringifying
  /*
  if (!process.env.production)
    args = stringifyObjects(el, args, view)
  */

  const tag = props.tagName || (el.whitelisted ? DIV : el.component || el.name)
  const { Text, View, TextInput } = React

  let NativeEl = 'view'

  if (args.length === 1 && typeof args[0] === 'string') {
    NativeEl = 'text'
  } else {
    const allText = args.filter(a => typeof a === 'string').length === args.length
    if (allText) {
      // args = args.join('')
      NativeEl = 'text'
    } else {
      args = args.map(arg => {
        if (typeof arg === 'string') {
          return React.createElement(Text, {}, arg)
        }
        return arg
      })
    }
  }

  if (tag === 'input') NativeEl= 'input'

  const getNativeEl = name => {
    if (name === 'view') return View
    if (name === 'text') return Text
    if (name === 'input') return TextInput
  }

  console.log('creating ',tag,...args, 'el', NativeEl)
  return React.createElement(typeof tag === 'string' ? getNativeEl(NativeEl) : tag, props, ...args)
}
