import React, {Component} from 'react'
import {Navbar, NavDropdown, MenuItem, Nav, NavItem, DropdownButton} from 'react-bootstrap'
import FontAwesome from 'font-awesome/css/font-awesome.css'
import { baseUrl } from './../Utils'
import {DOCUMENT_URL} from './../Constant'
import logo from './../images/logo.png'

export default class NavBar extends Component {
  render() {
    const { savedStatus, saveInProgress, userInfo } = this.props

    let nameInitial = userInfo.name.split('.')
    nameInitial = nameInitial[0][0] + (nameInitial.length > 1 ? nameInitial[1][0] : '')

    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">
              <img src={logo} />
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <span className='save-status'>
          {
            (saveInProgress)? 'Saving....'
            : 
            (savedStatus)? 'All Changes Saved.': 'Unable to Save.'
          }
        </span>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} className={'username-initial '+ (nameInitial.length > 1 ? 'dbl-letter' : '')}>
              <span>{nameInitial}</span>
            </NavItem>
            <NavDropdown eventKey={2} title={userInfo.name} id='user_info_dropdown'>
                <MenuItem eventKey={2.1}>{userInfo.email ? userInfo.email : 'No Email'}</MenuItem>
                {userInfo.isAdmin ? <MenuItem eventKey={2.2} href={baseUrl()} target={'_blank'}>Admin</MenuItem> : null}
                <MenuItem eventKey={2.2} href={DOCUMENT_URL} target={'_blank'}>Help</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={2.2} href={baseUrl() + 'logout'}>Logout</MenuItem>
              </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
