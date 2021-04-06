/**
 * Titleize a string
 * @param {string} name Original string
 * @return {string} Original string with the first letter uppercased
 */
const titleize = name => name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ').replace(/([A-Z])/g, ' $1')

/** @typedef {'boolean'|'code'|'color'|'datetime'|'file'|'hidden'|'image'|'list'|'map'|'markdown'|'number'|'object'|'relation'|'select'|'string'|'text'} Widget */
/** @typedef {'bold'|'italic'|'code'|'link'|'heading-one'|'heading-two'|'heading-three'|'heading-four'|'heading-five'|'heading-six'|'quote'|'bulleted-list'|'numbered-list'} Button */
/** @typedef {'raw'|'rich_text'} Mode */
/** @typedef {'yml'|'yaml'|'toml'|'json'|'frontmatter'|'yaml-frontmatter'|'toml-frontmatter'|'json-frontmatter'} PostFormat */
/** @typedef {'yml'|'yaml'|'toml'|'json'|'md'|'markdown'|'html'} PageExtension */

/**
 * Arguments that generate a field.
 * @typedef {Object} FieldArgs
 * @property {Widget} [widget] Widget type
 * @property {string} [label] The field label that appears in CMS
 * @property {boolean} [required]
 * @property {boolean} [collapsed]
 * @property {Field|Field[]} [fields]
 * @property {string} [label_singular]
 * @property {Field} [field]
 * @property {any} [defaultValue]
 * @property {boolean} [allow_add]
 * @property {string} [hint]
 * @property {string} [pattern]
 * @property {any} [default]
 * @property {string} [default_language] For code widget
 * @property {boolean} [allow_language_selection] For code widget
 * @property {Object} [keys] For code widget
 * @property {boolean} [output_code_only] For code widget
 * @property {boolean} [allowInput] For color widget
 * @property {boolean} [enableAlpha] For color widget
 * @property {string} [format] For datetime widget
 * @property {string|boolean} [date_format] For datetime widget
 * @property {string|boolean} [time_format] For datetime widget
 * @property {boolean} [picker_utc] For datetime widget
 * @property {string} [media_library] For image/file widget
 * @property {boolean} [allow_multiple] For image/file widget
 * @property {Object} [config] For image/file widget
 * @property {string} [summary] For list widget
 * @property {boolean} [minimize_collapsed] For list widget
 * @property {number} [max] For list/number widget
 * @property {number} [min] For list/number widget
 * @property {boolean} [add_to_top] For list widget
 * @property {number} [decimals] For map widget
 * @property {any} [type] For map widget
 * @property {boolean} [minimal] For markdown widget
 * @property {Button[]} [buttons] For markdown widget
 * @property {string[]} [editor_components] For markdown widget
 * @property {Mode[]} [modes] For markdown widget
 * @property {'int'|'float'} [value_type] For number widget
 * @property {number} [step] For number widget
 * @property {string} [collection] For relation widget
 * @property {string} [value_field] For relation widget
 * @property {string|string[]} [search_fields] For relation widget
 * @property {string} [file] For relation widget
 * @property {string|string[]} [display_fields] For relation widget
 * @property {number} [options_length] For relation widget
 * @property {[object|boolean]} i18n
 * @property {FieldArgs} [...rest]
 */

/**
 * @typedef Field
 * @property {string} name
 * @augments FieldArgs
 */

/**
 * Generates a generic field. Defaults to a 'string' if no widget declared. Defaults title to {@link titleize}d name.
 * @param {string} name The name of the field in code
 * @param {any|FieldArgs} [args]
 * @return Field
 */

export const field = (name,
                      {
                        widget = 'string',
                        label,
                        required,
                        collapsed = false,
                        fields = [],
                        label_singular,
                        field,
                        defaultValue,
                        allow_add,
                        i18n = true,
                        ...rest
                      } = {}) => {

  if (!label) {
    label = titleize(name)
  }

  if (typeof required === 'undefined')
    required = ['object', 'list'].includes(widget)

  const _field = {
    widget,
    name,
    label,
    required,
    collapsed,
    default: defaultValue,
    i18n,
    ...rest
  }

  if (fields.length)
    _field.fields = fields

  if (typeof field !== 'undefined')
    _field.field = field

  if (typeof label_singular !== 'undefined')
    _field.label_singular = label_singular


  if (typeof allow_add !== 'undefined')
    _field.allow_add = allow_add

  return _field
}
export const string = field

/**
 * Generates a required field
 * @param {string} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const required = (name, args) => field(name, { ...args, required: true })


/**
 * Generates a required string field. Defaults name to 'title'.
 * @param {string=} name
 * @param {any|FieldArgs=} args
 * @return {Field}
 */
export const title = (name = 'title', args) => field(name, { ...args, required: true })

/**
 * Generates an object field.
 * @param {string} name
 * @param {Field|Field[]} fields
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const object = (name, fields, args) => required(name, {
  ...args,
  widget: 'object',
  fields
})

export const group = object

/**
 * Generates a list field.
 * Defaults singular label to the label with the last letter removed.
 * Defaults to collapsed.
 * @param {string} name
 * @param {Field|Field[]=} fields
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const list = (name, fields, args) => {
  const _args = {
    ...args,
    widget: 'list',
    collapsed: (typeof args === 'undefined' || typeof args.collapsed === 'undefined') ? true : args.collapsed,
    label_singular: (typeof args === 'undefined' || typeof args.label_singular === 'undefined') ? name.slice(0, -1) : args.label_singular
  }

  let _label_singular
  if (typeof args !== 'undefined') {
    if (typeof args.label_singular !== 'undefined') {
      _label_singular = args.label_singular
    } else if (typeof args.label !== 'undefined') {
      _label_singular = args.label.slice(0, -1)
    }
  } else {
    _label_singular = name.slice(0, -1)
  }

  _args.label_singular = _label_singular

  if (Array.isArray(fields))
    _args.fields = fields
  else
    _args.field = fields

  _args.minimize_collapsed = typeof args !== 'undefined' && typeof args.minimize_collapsed !== 'undefined' ? args.minimize_collapsed : true

  return required(name, _args)
}

/**
 * Generates a tags field, i.e.
 * @param {string} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const tags = (name, args) => list(name, undefined, { hint: 'Comma separated. Make sure there is no comma at the end.', ...args })

/**
 * Generates an image field. Defaults name to 'image'.
 * @param {string} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const image = (name = 'image', args) => field(name, { ...args, widget: 'image' })

/**
 * Generates a text field. Defaults name to 'text'.
 * @param {string=} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const text = (name = 'text', args) => field(name, { ...args, widget: 'text' })

/**
 * Generates a minimal markdown field. Defaults name to 'text'.
 * @param {string=} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const md = (name = 'text', args) => field(name, {
  widget: 'markdown',
  minimal: true,
  buttons: ['bold', 'italic', 'link', 'heading-three', 'heading-four', 'heading-five', 'heading-six', 'bulleted-list', 'numbered-list'],
  editor_components: [], ...args,
})
export const markdown = md
export const body = args => md('body', args)

/**
 * Generates a date field. Defaults name to 'date'.
 * @param {string=} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const date = (name = 'date', args) => field(name, {
  widget: 'datetime',
  date_format: 'DD/MM/YYYY',
  time_format: false,
  format: 'LLL',
  ...args,
})

/**
 * Generates a boolean field.
 * @param {string} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const boolean = (name, args) => field(name, { widget: 'boolean', defaultValue: false, ...args })

/**
 * @typedef Option
 * @property {string} label
 * @property {string} value
 */

/**
 * Generates an option, to be used inside a {@link select}.
 * @param value
 * @param label
 * @return {Option}
 */
export const option = (value, label) => ({
  value,
  label: label || titleize(value)
})

/**
 * Generates a select field.
 * @param {string} name
 * @param {Option[]} options Populated with {@link option}s.
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const select = (name, options, args) => field(name, {
  widget: 'select',
  options,
  ...args
})

/**
 * Generates a string field validated as a URL
 * @param {string=} name
 * @param {any|FieldArgs} [args]
 * @return {Field}
 */
export const url = (name = 'url', args) => field(name, {
  pattern: ['https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,24}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', 'Must be a valid URL'],
  ...args
})

/**
 * @typedef RelationAdditionalArgs
 * @property {boolean} [multiple] For relation widget
 * @property {[string]} [file] For relation widget
 * @property {string[]} [display_fields] For relation widget
 * @property {number} [options_length] For relation widget
 */

/**
 * Generates a relation field
 * @param {string} name
 * @param {string} collection
 * @param {string} value_field
 * @param {string[]} search_fields
 * @param {any|RelationAdditionalArgs=} args
 * @return {Field}
 */
export const relation = (name, collection, value_field, search_fields, args) => field(name, { widget: 'relation', collection, value_field, search_fields, ...args })

/**
 * Generates a number
 * @param {string} name
 * @param {any|FieldArgs=} args
 * @return {Field}
 */
export const number = (name, args) => field(name, { widget: 'number', ...args })

/**
 * Generates an integer
 * @param {string} name
 * @param {any|FieldArgs=} args
 * @return {Field}
 */
export const int = (name, args) => number(name, { value_type: 'int', ...args })

/**
 * Generates a floating point number
 * @param {string} name
 * @param {any|FieldArgs=} args
 * @return {Field}
 */
export const float = (name, args) => number(name, { value_type: 'float', ...args })

/**
 * Generates a range
 * @param {string} name
 * @param {number=} min
 * @param {number=} max
 * @param {number=} step
 * @param {any|FieldArgs=} args
 * @return {Field}
 */
export const range = (name, min = 0, max = 1, step = 0.1, args) => number(name, { min, max, step, ...args })

/**
 * Generates a percentage range
 * @param {string=} name
 * @return {Field}
 */
export const percentage = (name = 'percentage') => range(name, 1, 100, 1)

/**
 * Generates a field with a single file
 * @param {string} name
 * @return {Field}
 */
export const file = (name) => field(name, { widget: 'file', allow_multiple: false })

/**
 * @typedef Page
 * @todo PageArgs, PostArgs
 */

/**
 * Generates a single page field. Defaults label to {@link titleize}d name. Defaults to a .yml file.
 * @param {string} name
 * @param {Field[]} fields
 * @param {string=} label
 * @param {string=} filename
 * @param {string=} path
 * @param {string=} folder
 * @param {PageExtension} extension
 * @param {object|boolean=} i18n
 * @param {any|FieldArgs} [...rest]
 * @return {Page}
 */
export const page = (name, fields, { label, filename, path = 'src/content/', folder = 'pages', extension = 'yml', i18n = true, ...rest } = {}) => ({
  name,
  file: `${path}${folder}/${filename || name}.${extension}`,
  label: label || titleize(name),
  fields,
  [i18n ? 'i18n' : '_i18n']: i18n,
  ...rest
})

/**
 * Generates a page in the data folder.
 * @param {string} name
 * @param {Field[]} fields
 * @param {any|FieldArgs} [args]
 * @return {Page}
 */
export const settingsPage = (name, fields, args) => page(name, fields, {
  folder: '_data',
  ...args
})

/**
 * @typedef PostType
 */

/**
 * Generates a post type. Defaults label to {@link titleize}d name. Defaults to a .md file.
 * @param {string} name
 * @param {Field[]} fields
 * @param {string=} label
 * @param {PostFormat=} format
 * @param {string=} path
 * @param {string=} subfolder
 * @param {string=} slug
 * @param {string=} label_singular
 * @param {object|boolean=} i18n
 * @param {any|FieldArgs} [...rest]
 * @return {PostType}
 */
export const postType = (name, fields, { label, format = 'frontmatter', path = 'src/content', subfolder = '', slug = '{{slug}}', label_singular, i18n = true, ...rest } = {}) => ({
  name,
  folder: `${path}${subfolder || ''}/${name}`,
  label: label || titleize(name),
  format,
  fields,
  editor: { preview: false },
  label_singular: label_singular || name.slice(0, -1),
  create: true,
  slug,
  i18n,
  ...rest
})
