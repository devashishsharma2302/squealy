import React, {Component} from 'react'
import {Navbar, NavDropdown, MenuItem, Nav, NavItem, DropdownButton} from 'react-bootstrap'
import FontAwesome from 'font-awesome/css/font-awesome.css'
import {Link} from 'react-router'

import logo from './../images/logo.png'

export default class NavBar extends Component {
  render() {
    const { savedStatus, saveInProgress } = this.props
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">
              <img src={logo} />
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <div className='save-status'>
          {
            (saveInProgress)? 'Saving....'
            : 
            (savedStatus)? 'All Changes Saved.': 'Unable to Save.'
          }
        </div>
      </Navbar>
    )
  }
}
