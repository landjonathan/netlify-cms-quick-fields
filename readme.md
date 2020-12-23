# Netlify CMS Quick Fields

Using the [manual initialization](https://www.netlifycms.org/docs/beta-features/#manual-initialization) beta feature
allows defining the CMS config in Javascript, which as opposed to YAML, is quite good at abstracting repetition. Netlify
CMS Quick Fields adds a few sensible defaults on top.

```javascript
page('home', [
  group('hero', [
    title(),
    string('subtitle', { hint: 'Aim for 10-30 charachters' }),
    image('backgroundImage'),
  ])
])
```

## Features
- Quickly define collections and fields
- Handy defaults and shortcuts
- Autocompletion-friendly types

## Install

```shell
npm i netlify-cms-quick-fields
```

## Usage
Follow the [manual initialization instructions](https://www.netlifycms.org/docs/beta-features/#manual-initialization) in
the official docs. 

In the `collections` field of the config file, use the `postType` function to generate folder collections and the `page` function for file collections. Collection functions and field collections share the same parameter convention `(name, fields?, args)`. By default, labels are generated automatically by capitalizing names.

Currently, this package assumes ESM.

```javascript
// config.js
import { postType, page, title, text, string } from 'netlify-cms-quick-fields'

const config = {
  backend: {
    name: 'git-gateway',
  },
  //...
  collections: [
    {
      posts: postType('posts', [
        string('headline'),
        text('content')
      ]),
      pages: {
        label: 'Pages',
        name: 'pages',
        files: [
          page('home', [
            title(),
            text()
          ]),
        ]
      }
    },
  ]
}
```

All primitive fields are optional by default.
Inside a `page` or `postType` you can use the following fields corrosponding to their respective widgets:

- `string`
- `text` — name defaults to `text`
- `markdown` / `md` — Name defaults to `text`
- `image` — name defaults to `image`
- `date` — name defaults to `date` 
- `boolean`
- `select` — accepts an array of `option`s (e.g. `select('choice', [option('yes'), option('no')])`)
- `object`
- `list` — by default is collapsed, and the `label_singular` is the name with the last letter truncated.

- `field` — can be used for any widget, defaults to `string`
- `required` — a required field
- `title` — a required `string` with the default name `title`
- `url` — a string with URL validation

### Annotated example for a page
```javascript
// about.js
import { page, title, object, string, image, list, md, text } from 'netlify-cms-quick-fields'

export default page('about', [
  object('hero', [
    title(), 
    //-> {widget: 'string', name: 'title', label: 'Title'}
    
    string('subtitle', { hint: 'Aim for 10-30 charachters' }),  
    //-> {widget: 'string', name: 'subtitle', label: 'Subtitle', required: false, hint: 'Aim for 10-30 charachters'}
    
    image('backgroundImage'),
    //-> {widget: 'image', name: 'backgroundImage', label: 'Background Image', required: false}
    
  ]),
  //-> {widget: 'object', name: 'hero', label: 'Hero', fields: [...]}
  list('features', [
    image('icon'),
    //-> {widget: 'image', name: 'icon', label: 'Icon', required: false}
    
    title(),
    //-> {widget: 'string', name: 'title', label: 'Title'}
    
    md()
    //-> {widget: 'markdown', name: 'text', label: 'Text', required: false}
  
  ]),
  //-> {widget: 'list', name: 'features', label: 'Features', collapsed: true, label_singular: 'Feature', fields: [...]}

  list('team', [
    image('headshot'),
    //-> {widget: 'image', name: 'headshot', label: 'Headshot', required: false}
    
    string('name', { required: true }),
    //-> {widget: 'string', name: 'name', label: 'Name'}
    
    text('bio'),
    //-> {widget: 'text', name: 'bio', label: 'Bio', required: false}
  
  ], { collpased: false, label_singular: 'Team Member' })
  //-> {widget: 'list', name: 'team', label: 'Team', collapsed: false, label_singular: 'Team Member', fields: [...]}
])
```

## Todo

- [ ] Better docs
- [ ] Quick fields for all widgets
- [ ] Better types for posts and pages
- [ ] Include manual initialization and config file in package
- [ ] Tooling to escape config to YAML

## Thanks
Everyone working on [Netlify CMS](https://www.netlifycms.org/)

[Sanity Quick Fields](https://github.com/SimeonGriggs/sanity-quick-fields) for finally helping me figure out what to call this thing.