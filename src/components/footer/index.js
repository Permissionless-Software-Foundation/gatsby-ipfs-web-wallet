import React from 'react'
import './footer.css'
import { Row, Col } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'

// Get the IPFS hash from the BCH Blockchain.
import Memo from '../../services/memo-hash'
const siteConfig = require('../site-config')

let _this

class Footer extends React.Component {
  constructor (props) {
    super(props)
    _this = this

    _this.state = {
      ipfsHash: 'No Result',
      ipfsHashLink: ''
    }

    this.memo = new Memo({
      bchWallet: props.bchWallet,
      bchAddr: siteConfig.memoAddr
    })
  }

  async componentDidMount () {
    // Get hash using memo service
    await this.handleMemoService()
  }

  async handleMemoService () {
    // This is a hard-coded hash or 'checkpoint' to use in times when the
    // connection fails.
    const hash = 'QmXT85Xoi7xMRD9m7Ta4Cx8Yrsd2WSzLrq2VRo26KW4xLu'

    // Try to retrieve the hash from the BCH blockchain.
    try {
      const hash = await this.memo.findHash()
      console.log(`IPFS hash found: ${hash}`)

      if (!hash) {
        throw new Error('Hash not found! Falling back to hard coded IPFS hash.')
      }
    } catch (err) {
      console.error('Error trying to retrieve IPFS hash for the site: ', err)
    }

    this.setState({
      ipfsHash: hash,
      ipfsHashLink: `https://ipfs-gateway.fullstack.cash/ipfs/${hash}`
    })
  }

  render () {
    return (
      <section id="footer">
        <Row className="footer-container">
          <Col md={5} className="footer-section">
            <Row>
              <Col md={12} className="mb-1">
                <p className="section-tittle">Produced By</p>

                <a
                  href="https://psfoundation.cash/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Permissionless Software Foundation
                </a>
              </Col>
              <Col md={12}>
                <p className="section-tittle">Source Code</p>
                <FontAwesomeIcon className="" size="lg" icon={faGithub} />
                <a
                  href="https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </Col>
            </Row>
          </Col>
          <Col md={7} className="footer-section">
            <div className="pull-right">
              <span className="section-tittle">
                Ways to access this web-app
              </span>
              <ul>
                <li id="web">
                  <span>
                    <b>Web</b>
                  </span>
                  <b>|</b>
                  <a href="https://wallet.fullstack.cash">
                    wallet.fullstack.cash
                  </a>
                </li>

                <li id="tor">
                  <span>
                    <b>Tor</b>
                  </span>
                  <b>|</b>
                  <a href="http://2egutot63q765ciwsenlcy5zdyxwxt7olzbldr5dx5i3ixsef2nvrzid.onion/">
                    2egutot63q765ciwsenlcy5zdyxwxt7olzbldr5dx5i3ixsef2nvrzid.onion
                  </a>
                </li>

                <li id="ipfs">
                  <span>
                    <b>IPFS</b>
                  </span>
                  <b>|</b>
                  <a href={_this.state.ipfsHashLink}>{this.state.ipfsHash}</a>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </section>
    )
  }
}

// Props prvided by redux
Footer.propTypes = {
  bchWallet: PropTypes.object // get minimal-slp-wallet instance
}

export default Footer
