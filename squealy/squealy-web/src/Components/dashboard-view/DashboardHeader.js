import React, {Component} from 'react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'

import logo from '../../images/logo.png'

export default class DashboardHeader extends Component {
  render() {
    const {saveDashboard} = this.props
    return (
      <Navbar bsStyle='default' fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/squealy-authoring-interface/">
              <img src={logo} />
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavItem>
            <button className="btn btn-success" id='save-dashboard-btn' onClick={saveDashboard}>
              Save Dashboards
            </button>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}
