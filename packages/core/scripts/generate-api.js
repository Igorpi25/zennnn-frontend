const jsdom = require('jsdom')
global.window = new jsdom.JSDOM().window
global.document = window.document
global.Element = window.Element
global.HTMLElement = window.HTMLElement

const fs = require('fs-extra')
const path = require('path')
const isFunction = require('lodash/isFunction')
const isPlainObject = require('lodash/isPlainObject')
const isEmpty = require('lodash/isEmpty')
const lib = require('../lib/index.cjs')
const Prism = require('prismjs')
require('prismjs/components/prism-typescript')
const md = require('markdown-it')({
  html: true,
  linkify: true,
})

const map = {
  ExpandTransition: {
    props: {
      mode: String,
      x: Boolean,
      expandedParentClass: String,
    }
  },
  LoadingSpinner: {
    props: {
      size: { type: Number, default: 18 },
    },
  },
  Messages: {
    props: {
      value: Array,
      error: Boolean,
    },
  },
}

const dirname = 'docs/.vitepress/locales'

function getLocaleData () {
  const locale = {}
  const localeFiles = fs.readdirSync(dirname)
  localeFiles.forEach(file => {
    const compLocale = fs.readFileSync(path.join(dirname, file), 'utf8')
    locale[file.split('.')[0]] = JSON.parse(compLocale)
  })
  return locale
}

const localeData = getLocaleData()

for (const componentName in lib) {
  const transformedName = kebabCase(componentName)
  const locale = localeData[transformedName] || {}
  const component = isFunction(lib[componentName]) ? map[componentName] : lib[componentName]
  const data = {}
  if (component.props) {
    const propsLocale = locale.props || {}
    data.props = Object.keys(component.props).sort().reduce((acc, key) => {
      const prop = getProp(key, component.props[key])
      const description = propsLocale[key] ? md.render(propsLocale[key]) : ''
      if (!Object.prototype.hasOwnProperty.call(data, 'props')) {
        data.props = []
      }
      return [
        ...acc,
        {
          name: kebabCase(key),
          type: getType(prop.type),
          default: getDefaultValue(prop),
          description,
        },
      ]
    }, [])
  }

  if (component.emits) {
    const emitsLocale = locale.emits || {}
    const arr = Array.isArray(component.emits) ? component.emits : Object.keys(component.emits)
    data.emits = arr.reduce((acc, key) => {
      return [
        ...acc,
        {
          name: kebabCase(key),
          description: emitsLocale[key] ? md.render(emitsLocale[key]) : '',
        }
      ]
    }, [])
  }

  if (locale.slots) {
    data.slots = Object.keys(locale.slots).reduce((acc, key) => {
      return [
        ...acc,
        {
          name: key,
          description: locale.slots[key] ? md.render(locale.slots[key]) : '',
        }
      ]
    }, [])
  }

  fs.outputFileSync(path.join('docs/.vitepress/data', `${transformedName}.json`), JSON.stringify(data, null, 2))
}

function getType (value) {
  const type = Array.isArray(value) ? value.join(' | ') : value

  return Prism.highlight(String(type), Prism.languages.typescript)
}

function getDefaultValue (item) {
  const { default: defaultValue } = item
  const str = defaultValue == null || typeof defaultValue === 'string'
    ? String(defaultValue)
    : JSON.stringify(defaultValue, null, 2)

  const code = Prism.highlight(str, Prism.languages.typescript)
  return isPlainObject(defaultValue) && !isEmpty(JSON.parse(JSON.stringify(defaultValue)))
    ? `<div class="api-table__default"><pre><code>${code}</code></pre></div>`
    : code
}

function getProp (name, prop) {
  const type = getPropType(isPlainObject(prop) ? prop.type : prop)
  return {
    name,
    type,
    default: getPropDefault(prop && prop.default, type),
  }
}

function getPropType (type) {
  if (Array.isArray(type)) {
    return type.map(t => getPropType(t))
  }

  if (!type) return 'any'

  return type.name.toLowerCase()
}

function getPropDefault (def, type) {
  if (def == null && type !== 'boolean' && type !== 'function') {
    return 'undefined'
  } else if (typeof (def) === 'function' && type !== 'function') {
    def = def.call({})
  }

  if (type === 'boolean') {
    return def ? 'true' : 'false'
  }

  if (type === 'string' || typeof def === 'string') {
    return def ? `'${def}'` : def
  }

  if (type === 'function') {
    return parseFunctionParams(def)
  }

  return def
}

function parseFunctionParams (func) {
  const groups = /function\s_.*\((.*)\)\s\{.*/i.exec(func)
  if (groups && groups.length > 1) return `(${groups[1]}) => {}`
  else return 'null'
}

function kebabCase (str) {
  let kebab = ''
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    if (charCode >= 65 && charCode <= 90) {
      kebab += `${i > 0 ? '-' : ''}${str[i].toLowerCase()}`
    } else {
      kebab += str[i]
    }
  }
  return kebab
}

// Component props sort
// console.log(JSON.stringify(Object.keys(props).sort().reduce((acc, p) => { return { ...acc, [p]: '' } }, {}), null, 2))
