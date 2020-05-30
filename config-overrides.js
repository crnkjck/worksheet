const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = function override(config, env){
    let loaders = config.module.rules[2].oneOf
    loaders.splice(loaders.length -1, 0, {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: {
          loader: 'elm-webpack-loader',
          options: {}
        }
      })

    

    let copyPlugin = new CopyPlugin([{        
      from: path.resolve('src/components/solvers/tableauEditor/src/tableauEditor.css'),
      to: path.resolve('build/tableauEditor.css'),
      toType: 'file', 
    }])
    config.plugins = [copyPlugin, ...config.plugins]
    return config
}