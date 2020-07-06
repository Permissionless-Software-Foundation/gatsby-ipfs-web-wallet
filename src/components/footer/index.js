import React from 'react'
import './footer.css'
import { Row, Col } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

class Footer extends React.Component {
  render () {
    return (
      <section id='footer'>
        <Row className='footer-container'>
          <Col md={5} className='footer-section'>
            <Row>
              <Col md={12} className='mb-1'>
                <p className='section-tittle'>Produced By</p>

                <a
                  href='https://psfoundation.cash/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Permissionless Software Foundation
                </a>
              </Col>
              <Col md={12}>
                <p className='section-tittle'>Source Code</p>
                <FontAwesomeIcon className='' size='lg' icon={faGithub} />
                <a
                  href='https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </a>
              </Col>
            </Row>
          </Col>
          <Col md={7} className='footer-section'>
            <div className='pull-right'>
              <span className='section-tittle'>
                Ways to access this web-app
              </span>
              <ul>
                <li id='web'>
                  <span>
                    <b>Web</b>
                  </span>
                  <b>|</b>
                  <a href='https://wallet.fullstack.cash'>
                    wallet.fullstack.cash
                  </a>
                </li>

                <li id='tor'>
                  <span>
                    <b>Tor</b>
                  </span>
                  <b>|</b>
                  <a href='http://puh2fyj2ly5b4p5m.onion/'>
                    puh2fyj2ly5b4p5m.onion
                  </a>
                </li>

                <li id='ipfs'>
                  <span>
                    <b>IPFS</b>
                  </span>
                  <b>|</b>
                  <a href='https://ipfs.io/ipfs/QmTMpYt66SGSjckXTHF6bPip6h1V5fXT23tEUJgy7pyTkf/'>
                    QmTMpYt66SGSjckXTHF6bPip6h1V5fXT23tEUJgy7pyTkf
                  </a>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        {/*   <center>
        <a href="https://psfoundation.cash/" target="_blank" rel="noreferrer">
          Produced by the Permissionless Software Foundation
        </a>

        <br /><br />
        <p>Ways to access this web-app:</p>
        <ul>
          <li>
            Web: <a href="https://wallet.fullstack.cash">wallet.fullstack.cash</a>
          </li>

          <li>
            Tor: <a href="http://puh2fyj2ly5b4p5m.onion/">puh2fyj2ly5b4p5m.onion</a>
          </li>

          <li>
            IPFS: <a href="https://ipfs.io/ipfs/QmTMpYt66SGSjckXTHF6bPip6h1V5fXT23tEUJgy7pyTkf/">QmTMpYt66SGSjckXTHF6bPip6h1V5fXT23tEUJgy7pyTkf</a>
          </li>
        </ul>
        <br />

        <a href="https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet" target="_blank" rel="noreferrer">
          Source Code
        </a>
        </center> */}
      </section>
    )
  }
}

export default Footer
