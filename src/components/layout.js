/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
// import { useStaticQuery, graphql } from "gatsby"

// import Header from "./header"

import './app-colors.css'
import './layout.css'
const Footer = typeof window !== 'undefined' ? require('./footer').default : null
// import Footer from "./footer"

const Layout = ({ children, bchWallet }) => {
  /*   const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `) */

  return (
    <>
      <main>{children}</main>
      {Footer && <Footer bchWallet={bchWallet} />}{' '}
    </>
  )
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  bchWallet: PropTypes.object // get minimal-slp-wallet instance

}

export default Layout
