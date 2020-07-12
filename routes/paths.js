const _ = require('lodash');

const express = require('express');

const pathsRouter = express.Router();

// For each configured category, generate a subpath
function routerPaths(categories) {
  return _.map(categories, (category) => pathsRouter.get(`/${category}`, async (req, res) => {
    const content = {
      posts: { ...req.posts[category] },
      categories,
    };

    res.render('index', content);
  }));
}

module.exports = routerPaths;
