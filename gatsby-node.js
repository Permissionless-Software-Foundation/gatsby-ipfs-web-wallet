const path = require('path')
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  // console.log('stage', stage)
  // console.log('actions', actions)
  // console.log('getConfig', getConfig)

  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false
      },
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom')
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
