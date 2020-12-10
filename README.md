# mongoose-simple-slugify

A simple language agnostic `mongoose` plugin for generating unique slugs from a given string.

## Installation
Installation is as simple as any other `npm` package:

```
$ npm install mongoose-simple-slugify
```

## Usage
Given you have a schema in a file `models/post.js` that has a `title` and you want to generate a slug using that `title`, the corresponding code will be as follows:

```js
// models/post.js

// regular mongoose stuff
const mongoose = require('mongoose');
const { Schema } = mongoose;

// require mongoose-simple-slugify in your schema
const slugify = require('mongoose-simple-slugify');

const Post = mongoose.model(
  'Post',
  new Schema(
    {
      // title of the post
      title: {
        type: String,
        required: true,
      },
      // slug generated for the post
      slug: {
        source: 'title', // source for generating the slug
        type: String,
        unique: true,
      },

      body: {
        type: String,
        required: true,
      },
    },

    { timestamps: true },
  ).plugin(slugify), // registering the plugin
);

module.exports = Post;

```

That's all you need. Now everytime you create a new post a slug will be generated automatically. In case the generated slug is already in the database, a cryptographically correct random string will be appended to the slug.