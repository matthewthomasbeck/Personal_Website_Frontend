const path = require('path');

module.exports = {
  entry: './src/controller.js',
  output: {
    filename: 'controller.bundle.js',
    path: path.resolve(__dirname, 'js'),
  },
  mode: 'production'
}; 