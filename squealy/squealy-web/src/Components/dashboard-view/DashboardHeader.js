import React, {Component} from 'react'
import {Navbar} from 'react-bootstrap'

import logo from '../../images/logo.png'

export default class DashboardHeader extends Component {
  render() {
    return (
      <Navbar bsStyle='default' fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">
              <img src={logo} />
            </a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }
}
