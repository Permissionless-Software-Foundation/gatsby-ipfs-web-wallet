const path = require('path')
const webpack = require('webpack')
exports.onCreateWebpackConfig = ({ stage, actions, getConfig, plugins }) => {
  // console.log('stage', stage)
  // console.log('actions', actions)
  // console.log('getConfig', getConfig)

  // https://webpack.js.org/configuration/resolve/
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        http: require.resolve('stream-http'),
        zlib: require.resolve('browserify-zlib'),
        https: require.resolve('https-browserify'),
        process: require.resolve('process/browser'),
        assert: require.resolve('assert')
      },
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
        process: 'process/browser'
      }
    }
  })

  // Ignore css order
  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }

    // Create new webpack plugins for resolve 'process/browser'
    // and buffer/Buffer
    const processPlugin = new webpack.ProvidePlugin({
      process: 'process/browser'
    })
    const bufferPlugin = new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })

    // Add plugins to webpack plugins array
    config.plugins.push(processPlugin)
    config.plugins.push(bufferPlugin)

    // Save the new config
    actions.replaceWebpackConfig(config)
  }
}

exports.createPages = async ({ actions }, themeOptions) => {
  const basePath = '/'
  actions.createPage({
    path: basePath,
    component: require.resolve('./src/pages/index.js')
  })
}
