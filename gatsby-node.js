exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty'
    }
  })

  // Ignore css order
  if (stage === 'build-javascript') {
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
