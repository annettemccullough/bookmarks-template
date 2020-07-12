require('dotenv').config();

const { getContent } = require('shares-scraper');
const _ = require('lodash');

const express = require('express');

const indexRouter = express.Router();

const routerPaths = require('./paths');

// Load configured values
const all = process.env.CATCH_ALL_CATEGORY;
const pocket = process.env.POCKET_ID;
const categories = [`${all}`];
if (process.env.CATEGORIES) {
  JSON.parse(process.env.CATEGORIES).forEach((category) => {
    categories.push(category);
  });
}

// Initialise the posts object, this will be
// used to store articles by category
let posts = {};

// Determine if the current post should be set on
// a specific category based on the tags it has and
// any filter than has been applied
function setPost(filter, category, post) {
  if (!filter || (filter && post.tags.includes(`#${filter}`))) {
    if (!posts[category]) posts[category] = [];
    posts[category].push(post);
  }
}

indexRouter.use('/', async (req, res, next) => {
  const filter = _.get(req.query, 'tag', null);

  // Retrieve the content
  const contentPromise = getContent({ pocket });
  posts = [];

  // Initialise the tags object, this will be
  // used to store tags by category
  const tags = {};

  contentPromise.then((content) => {
    content.posts.forEach((post) => {
      // if the post has tags
      if (post.tags) {
        // loop through all the tags on a post
        _.map(post.tags, (tag) => {
          // if any of the tags matches a configured category
          // then add the post to that category
          if (categories.includes(tag.replace('#', ''))) {
            setPost(filter, tag.replace('#', ''), post);
          }
        });
      }

      setPost(filter, all, post);
    });

    // if this is the root path, or the catch all category
    // then render the content
    if (['/', `/${all}`].includes(req.path)) {
      res.render('index', { posts: { ...posts[all] }, categories });
    } else { // otherwise, set the posts & tags and move on
      req.posts = posts;
      req.tags = tags;
      next();
    }
  });
}, routerPaths(categories));

module.exports = indexRouter;
