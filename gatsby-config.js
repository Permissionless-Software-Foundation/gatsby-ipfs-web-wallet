const ipfsPrefix = process.argv.find(val => val === '--prefix-paths')
console.log('DEBUG >> IM HERE')

const ipfsConfig = [
  'gatsby-plugin-ipfs',
  'gatsby-plugin-react-helmet',
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      start_url: '__GATSBY_IPFS_PATH_PREFIX__',
      name: 'images',
      path: `${__dirname}/src/images`
    }
  },
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: 'gatsby-starter-default',
      short_name: 'starter',
      start_url: '__GATSBY_IPFS_PATH_PREFIX__',
      background_color: '#663399',
      theme_color: '#663399',
      display: 'minimal-ui',
      icon: 'src/images/gatsby-icon.png' // This path is relative to the root of the site.
    }
  }

  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
]

const normalConfig = [
  'gatsby-plugin-react-helmet',
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      start_url: '/',
      name: 'images',
      path: `${__dirname}/src/images`
    }
  },
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: 'gatsby-starter-default',
      short_name: 'starter',
      start_url: '/',
      background_color: '#663399',
      theme_color: '#663399',
      display: 'minimal-ui'
      //    icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
    }
  }

  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
]

module.exports = {
  siteMetadata: {
    title: 'Gatsby IPFS Adminlte Starter',
    description: 'A gatsbyjs app with adminlte2 integration.',
    author: '@gatsbyjs'
  },
  pathPrefix: '__GATSBY_IPFS_PATH_PREFIX__',
  plugins: ipfsPrefix ? ipfsConfig : normalConfig
}
