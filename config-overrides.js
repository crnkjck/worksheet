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
    return config
}