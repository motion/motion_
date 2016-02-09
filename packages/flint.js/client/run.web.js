import { StyleRoot, keyframes } from 'flint-radium'
import React from 'react'
import ReactDOM from 'react-dom'

export default (Main, nodeID) => {
  ReactDOM.render(
    <StyleRoot className="__flintRoot">
      <Main />
    </StyleRoot>,
    document.getElementById(nodeID)
  )
}
