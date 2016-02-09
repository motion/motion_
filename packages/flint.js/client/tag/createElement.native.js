import React from 'react'

/*

  Shim around React.createElement, that adds in our:

     - tag helpers (sync, yield, repeat, if, ...)
     - styling (radium, css classes, ...)
     - object to string

*/

const DIV = 'div'
const { Text } = React

export default function createElement(identifier : Identifier, _props, ...args) {
  // TODO remove or document
  /*
  if (_props && _props.__skipFlint)
    return React.createElement(identifier[1], _props, ...args)

  const view = this
  const Flint = view.Flint

  const el: Element = getElement(identifier, view, _props, Flint.getView)
  const props = elementProps(el, view, Flint, _props)
  props.style = elementStyles(el, view, props)

  // TODO option to disable object stringifying
  if (!process.env.production)
    args = stringifyObjects(el, args, view)

  const tag = props.tagName || (el.whitelisted ? DIV : el.component || el.name)

  */
  return React.createElement(<Text>hello</Text>, props, ...args)
}
