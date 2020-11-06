import React from 'react'
import PropTypes from 'prop-types'
// import { withPrefix, Link } from 'gatsby'

// window && typeof window !== 'undefined' && window.test = 'testing'
// import Logo from './images/loader.gif'

export default function HTML (props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />

        {/* Loading animation should be loaded very first thing. */}
        <div
          className='test'
          key='loader'
          id='___loader'
          style={{
            alignItems: 'center',
            backgroundColor: '#F2F2F2',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 9000,
            flexDirection: 'column'
          }}
        ><img src='https://i.imgur.com/8n8PYAi.gif' alt='' width='250' />
        Loading...
        </div>

        {/* minimal-slp-wallet-web */}
        <script src='https://unpkg.com/minimal-slp-wallet-web' />

        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div>
          <div
            key='body'
            id='___gatsby'
            dangerouslySetInnerHTML={{ __html: props.body }}
          />
        </div>

        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array
}
