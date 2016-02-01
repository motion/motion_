import type { Identifier, Element } from './types'

import React from 'react'
import getElement from './getElement'
import elementStyles from './styles'
import elementProps from './props'
import stringifyObjects from './stringifyObjects'
import { isString, every } from 'lodash'

/*

  Shim around React.createElement, that adds in our:

     - tag helpers (sync, yield, repeat, if, ...)
     - styling (radium, css classes, ...)
     - object to string

*/

const DIV = 'div'

function getNativeEl(tag, els) {
  console.log('getting native el', tag, els)
  if (!isString(tag)) return tag

  const { Text, View, TextInput } = React

  const nameToComponent = name =>
    (({ view: View, text: Text, input: TextInput })[name])

  let nativeEl = 'view'

  if (every(els, isString)) {
    // args = args.join('')
    nativeEl = 'text'
  } else {
    els = els
      .map(el => isString(el) ? React.createElement(Text, {}, el) : el)
  }

  if (tag === 'input') nativeEl = 'input'

  return nameToComponent(nativeEl)
}


export default function createElement(identifier : Identifier, _props, ...args) {
  // TODO remove or document
  if (_props && _props.__skipFlint)
    return React.createElement(identifier[1], _props, ...args)

  const view = this
  // todo do this better
  let native = false
  if (React.Text) native = true
  //const { native } = view
  const Flint = this.Flint


  const el: Element = getElement(identifier, view, _props, Flint.getView)
  const props = elementProps(el, view, Flint, _props)
  props.style = elementStyles(el, view, props)

  // TODO option to disable object stringifying
  if (!process.env.production)
    args = stringifyObjects(el, args, view)

  const tag = props.tagName || (el.whitelisted ? DIV : el.component || el.name)
  const platformEl = native ? getNativeEl(tag, args) : tag

  console.log('creating element', tag, 'is native', native)

  return React.createElement(platformEl, props, ...args)
}
