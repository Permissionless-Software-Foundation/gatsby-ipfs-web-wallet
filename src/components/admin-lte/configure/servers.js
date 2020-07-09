import React from "react"
import PropTypes from "prop-types"
import { Row, Col, Box, Inputs, Button } from "adminlte-2-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const { Text, Select } = Inputs

let _this
class Servers extends React.Component {
  constructor(props) {
    super(props)

    _this = this

    this.state = {
      selectOptions: [],
      errMsg: "",
      selectedServer: "",
      showAddField: false,
      newServer: "",
    }

    // Default field options
    this.defaultOptions = [
      {
        value: "https://api.fullstaack.cash/v3/",
        text: "https://api.fullstaack.cash/v3/",
      },
      {
        value: "https://free-api.fullstack.cash/v3/",
        text: "https://free-api.fullstack.cash/v3/",
      },
    ]
  }

  render() {
    return (
      <Row>
        <Col sm={12}>
          <Box className="hover-shadow border-none mt-2">
            <Row>
              <Col sm={12} className="text-center">
                <h1>
                  <FontAwesomeIcon
                    className="title-icon"
                    size="xs"
                    icon="coins"
                  />
                  <span>Back End Server</span>
                </h1>
                <Box className="border-none">
                  <Row>
                    <Col xs={12}>
                      {_this.state.showAddField ? (
                        <Text
                          id="newServer"
                          name="newServer"
                          placeholder="Add New Server url"
                          label="Add New Server Url"
                          labelPosition="above"
                          onChange={_this.handleUpdate}
                          value={_this.state.newServer}
                          buttonRight={
                            <Button
                              text={_this.state.newServer ? " ADD " : "CLOSE"}
                              type="primary"
                              onClick={_this.handleNewServerUrl}
                            />
                          }
                        />
                      ) : (
                        <Select
                          name="selectedServer"
                          label="Select Server Url"
                          labelPosition="above"
                          options={_this.state.selectOptions}
                          value={_this.state.selectedServer}
                          onChange={_this.handleUpdate}
                          buttonRight={
                            <Button
                              icon="fa-plus"
                              onClick={_this.handleTextField}
                            />
                          }
                        />
                      )}
                    </Col>
                    <Col sm={12} />
                  </Row>

                  <Button
                    text="Update"
                    type="primary"
                    className="btn-lg"
                    onClick={_this.handleUpdateServer}
                  />
                </Box>
              </Col>
              <Col sm={12} className="text-center">
                {_this.state.errMsg && (
                  <p className="error-color">{_this.state.errMsg}</p>
                )}
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    )
  }
  // turn on / off text field
  handleTextField() {
    _this.setState({
      showAddField: !_this.state.showAddField,
    })
  }
  // Add the new server value to the select field
  handleNewServerUrl() {
    const { newServer, selectOptions } = _this.state

    if (newServer) {
      const alreadyExist = selectOptions.find(val => {
        return val.value === newServer
      })
      // Prevent duplicate options
      if (alreadyExist) {
        _this.setState({
          showAddField: false,
          selectedServer: newServer,
        })
        _this.resetForm()

        return
      }
      const option = {
        value: newServer,
        text: newServer,
      }

      // add the new select option
      selectOptions.push(option)
    }

    _this.setState({
      selectOptions,
      showAddField: false,
      selectedServer: newServer ? newServer : _this.state.selectedServer,
    })
    _this.resetForm()
  }

  // populate select field with select options from localstorage
  populateSelect() {
    try {
      const walletInfo = _this.props.walletInfo
      let selectOptions = _this.defaultOptions

      // verify server list from localstorage
      if (!walletInfo.servers) {
        // add default server list to localStorage
        walletInfo.servers = []
        walletInfo.selectedServer = selectOptions[0].value

        for (let i = 0; i < selectOptions.length; i++) {
          walletInfo.servers.push(selectOptions[i].value)
        }
        _this.props.setWalletInfo(walletInfo)

        _this.setState({
          selectOptions,
          selectedServer: selectOptions[0].value,
        })
      } else {
        selectOptions = []

        // populate select field with data from localstorage
        for (let i = 0; i < walletInfo.servers.length; i++) {
          const option = {
            value: walletInfo.servers[i],
            text: walletInfo.servers[i],
          }
          selectOptions.push(option)
        }
        _this.setState({
          selectOptions,
          selectedServer: walletInfo.selectedServer,
        })
      }
    } catch (error) {
      console.warn(error)
    }
  }

  componentDidMount() {
    _this.populateSelect()
  }

  handleUpdate(event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value,
    })
  }

  handleUpdateServer() {
    _this.handleNewServerUrl()
    // await for state update delay
    setTimeout(() => {
      _this.saveServer()
    }, 500)
  }

  // store servers in the localstorage
  saveServer() {
    try {
      // store the new server in the localstorage if it does not exist
      const walletInfo = _this.props.walletInfo
      const { servers } = walletInfo

      const selectedValue = _this.state.selectedServer
      if (!selectedValue) {
        return
      }

      const alreadyExist = servers.find(val => {
        return val === selectedValue
      })
      if (!alreadyExist) {
        servers.push(selectedValue)
      }

      walletInfo.servers = servers
      walletInfo.selectedServer = selectedValue
      _this.props.setWalletInfo(walletInfo)
    } catch (error) {
      console.warn(error)
    }
  }
  // clean the text form field
  resetForm() {
    _this.setState({
      newServer: "",
    })
  }
}
Servers.propTypes = {
  setWalletInfo: PropTypes.func.isRequired,
  walletInfo: PropTypes.object.isRequired,
  setBchWallet: PropTypes.func.isRequired,
}

export default Servers
