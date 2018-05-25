'use strict';

const path = require('path');

var webpackConfig = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  plugins: []
};

module.exports = webpackConfig;
