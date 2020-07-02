exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  actions.setWebpackConfig({
    node: {
      fs: "empty",
    },
  })
  //Ignore css order
  if (stage === "build-javascript") {
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === "MiniCssExtractPlugin"
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)
  }
}

exports.sourceNodes = ({ actions, createNodeId, createContentDigest  }) => {
    const { createNode  } = actions
    const defaultMenuItems = [
        {
            title: "Audit",
            icon: "fas-cog",
            component: "./audit"
        }
    ]

    createNode({
        menuItems: defaultMenuItems,
        id: `bch-wallet-plugins`,
        parent: null,
        children: [],
        internal: {
            type: `BchWalletPlugins`,
            contentDigest: createContentDigest({})
        }
    })
}

