let cachedStyles = {}

const upper = s => s.toUpperCase()
const capital = s => upper(s.substr(0, 1)) + s.slice(1)

const transformKeysMap = {
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ'
}

const mergeStyles = (obj, ...styles)  => {
  let result = obj || {}

  return styles.reduce((acc, style) => {
    if (Array.isArray(style))
      style.map(s => mergeStyles(acc, s))
    else if (typeof style === 'object')
      Object.assign(acc, style)

    return acc
  }, result)
}

const prefix = '$'

const arrayToString = val =>
  val.map(style =>
    typeof style == 'number' ? `${style}px` : style
  ).join(' ')

export default function elementStyles(key, view, name, tag, props) {
  // <name-tag>hello</name-tag>
  // console.log('name', name, 'tag', tag)

  if (typeof name !== 'string')
    return

  // if its the root element (name === view or Wrapper)
  const isRoot = (
    name.indexOf('Flint.') == 0 ||
    view.name && view.name.toLowerCase() == name
  )

  if (view.styles) {
    // if <foobar> is root, then apply both the base ($) and ($foobar)
    const diffName = name !== tag
    const hasTag = typeof tag == 'string'
    const tagStyle = hasTag && view.styles[prefix + tag]

    const viewStyle = view.styles[prefix]
    const viewStaticStyle = view.styles._static[prefix]
    const nameStyle = view.styles[prefix + name]

    let nameStaticStyle
    const tagStaticStyle = view.styles._static[prefix + tag]

    if (diffName)
      nameStaticStyle = view.styles._static[prefix + name]

    const index = props.repeat ? key[1] : void 0
    const uniqueTagId = view.entityId + name + tag

    let result
    let ran = false

    // TODO: only try/catch in dev mode
    try {
      result = mergeStyles({},
        // tag style
        tagStyle ? tagStyle(index) : {},
        // base style
        isRoot && viewStyle && viewStyle(index),
        isRoot && viewStaticStyle,
        // name dynamic styles
        nameStyle && diffName && nameStyle(index),
        // tag static
        tagStaticStyle,
        // name static
        nameStaticStyle,
      )

      // add class styles
      if (props.className) {
        props.className.split(' ').forEach(className => {
          const classSelector = `_class_${className}`
          const justClass = prefix + classSelector
          const nameAndClass = prefix + name + classSelector

          // $.class = {}
          if (view.styles[justClass] || view.styles._static[justClass])
            result = mergeStyles(null, result, view.styles[justClass] && view.styles[justClass](index), view.styles._static[justClass])

          // $name.class = {}
          if (view.styles[nameAndClass] || view.styles._static[nameAndClass])
            result = mergeStyles(null, result, view.styles[nameAndClass] && view.styles[nameAndClass](index), view.styles._static[nameAndClass])
        })
      }

      ran = true
    }
    catch (e) {
      console.error('Error running style for ', view.name+':'+name, e.message)
      props.style = cachedStyles[uniqueTagId]
    }

    if (ran) {
      // merge styles [] into {}
      if (Array.isArray(result))
        result = mergeStyles(null, ...result)

      // add style="" prop styles
      if (props.style)
        result = mergeStyles(null, result, props.style)

      // apply view internal $ styles
      if (name.indexOf('Flint.') == 0)
        result = mergeStyles(null, result, view.styles._static.$, view.styles.$)

      // add view external props.style
      if (isRoot && view.props.style)
        result = mergeStyles(null, result, view.props.style)

      // put styles back into props.style
      if (result)
        props.style = result

      // cache styles
      cachedStyles[uniqueTagId] = result
    }
  }

  // HELPERS
  if (props.style) {
    const ps = props.style

    // position
    if (ps.position && Array.isArray(ps.position)) {
      ps.top = ps.position[0]
      ps.right = ps.position[1]
      ps.bottom = ps.position[2]
      ps.left = ps.position[3]
      ps.position = 'absolute'
    }

    // array to string
    Object.keys(ps).forEach(key => {
      // @media queries
      if (key[0] == '@')
        Object.keys(ps[key]).forEach(subKey => {
          if (Array.isArray(ps[key][subKey]))
            ps[key][subKey] = arrayToString(ps[key][subKey])
        })
      // regular
      else if (Array.isArray(ps[key]))
        ps[key] = arrayToString(ps[key])
    })

    // { transform: { x: 10, y: 10, z: 10 } }
    if (typeof ps.transform === 'object') {
      ps.transform = Object.keys(ps.transform).map(key =>
        `${transformKeysMap[key] || key}(${ps.transform[key]})`
      ).join(' ')
    }

    // background { r, g, b, a }
    if (ps.background && typeof ps.background == 'object') {
      const bg = ps.background

      if (bg.a)
        ps.background = `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})`
      else
        ps.background = `rgb(${bg.r}, ${bg.g}, ${bg.b})`
    }
  }

  // set body bg to Main view bg
  if (
    view.name == 'Main' &&
    name == 'Flint.MainWrapper' &&
    props.style &&
    typeof document != 'undefined'
  ) {
    const bg = props.style.background || props.style.backgroundColor
    const body = document.body

    // if body already has bg, ignore
    if (bg && body && !body.style.background && !body.style.backgroundColor) {
      body.style.background = bg
    }
  }
}
