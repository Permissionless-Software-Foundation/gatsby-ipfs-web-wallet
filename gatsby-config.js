// Common settings to export.
const config = {
  siteMetadata: {
    title: 'FullStack.cash Web Wallet',
    description: 'A BCH web wallet that uses FullStack.cash for its back end.',
    author: '@christroutner'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        // start_url: '/',
        name: 'images',
        path: `${__dirname.toString()}/src/images`
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        // icon: 'src/images/gatsby-icon.png' // This path is relative to the root of the site.
        icons: [
          {
            src: 'src/images/gatsby-icon.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ] // Add or remove icon sizes as desired
      }
    }

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ]
}

module.exports = config
