import React, {Component} from 'react'
import {Navbar, NavDropdown, MenuItem, Nav, NavItem, DropdownButton} from 'react-bootstrap'
import FontAwesome from 'font-awesome/css/font-awesome.css'
import {Link} from 'react-router'

import logo from '../images/logo.png'

export default class MenuBar extends Component {
  render() {
    //Pass links to nav bar using props later
    const {apiAdditionHandler, apiDefinition, apiOpenHandler, exportConfigAsYaml, saveFileOnServer} = this.props
    const closedApi=[]
    apiDefinition.map((api, index) => {
      if(!api.open) {
       closedApi.push(<MenuItem key={index} eventKey={index} onClick={() => {apiOpenHandler(index)}}>{api.apiName}</MenuItem>)
      }
    })
    return (
      <Navbar bsStyle='default' fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">
              <img src={logo} />
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullLeft>
          <NavDropdown eventKey={1} title="File" id="file_menu">
            <NavDropdown
              key={1}
              eventKey={1.1}
              title="Open existing API"
              id="dropdown-size-small">
              {
                closedApi.length ? closedApi : <MenuItem>No Api Available</MenuItem>
              }
            </NavDropdown>
            <MenuItem eventKey={1.2}  key={2} onClick={apiAdditionHandler}>Create a new API</MenuItem>
          </NavDropdown>
          {//Commenting out this code as not needed as of now
            /*
            <NavDropdown eventKey={1} title="Settings" id="basic-nav-dropdown">
              <MenuItem eventKey={1.1}>Action</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={1.2}>Separated link</MenuItem>
            </NavDropdown>
            */
          }
        </Nav>
        <Nav pullRight>
          <NavItem href='dashboard'>
              <button className="btn btn-info">
                Dashboard
              </button>
            </NavItem>
          <NavItem>
            <button className="btn btn-info export-btn"
              onClick={exportConfigAsYaml}>Export
            </button>
          </NavItem>
          <NavItem>
            <button className="btn btn-success" id='save-btn' onClick={saveFileOnServer}>
              Save API
            </button>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}
