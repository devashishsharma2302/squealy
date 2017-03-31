import React from 'react'
import { shallow, render} from 'enzyme'
import { getEmptyApiDefinition, getEmptyUserInfo } from '../src/Utils'
import {CHART_DATA} from './../src/mockDataForAuthorization'
import SideMenu from './../src/Components/SideMenu'

/**
 * Test cases for Side menu:
 *  1. To check permission if user can add or delete chart
 *  2. To check chart if selected or not
 *  3. Right click menu and delete functionality
 *  FIXME: Not able to write test cases for modal as modal renders on document body.
 */
describe('Unit tests for SideMenu using shallow rendering', () => {
  const onHandleTestButtonMock = jest.fn(),
    onChangeTestDataMock = jest.fn(),
    testChartAdditionHandler = jest.fn(),
    testChartDeletionHandler = jest.fn(),
    testChartSelectionHandler = jest.fn(),
    testSelectedChartChangeHandler = jest.fn(),
    tempFilterSelectionHandler = jest.fn(),
    tempFilterDeletionHandler = jest.fn(),
    tempSelectedFilterChangeHandler = jest.fn(),
    tempFilterAdditionHandler = jest.fn()

  const charts = [getEmptyApiDefinition()]
  let userInfo = getEmptyUserInfo()
  userInfo.name = 'test.user'
  userInfo.can_add_chart = true
  userInfo.can_delete_chart = true

  it('Test if user allowed to add chart', () => {
    let tempUserInfo = JSON.parse(JSON.stringify(userInfo))
    tempUserInfo.can_add_chart = false
    tempUserInfo.can_delete_chart = false

    const component = shallow(
      <SideMenu 
        userInfo={tempUserInfo}
        chartAdditionHandler={testChartAdditionHandler} 
        charts={CHART_DATA}
        selectedChartIndex={0} 
        chartSelectionHandler={testChartSelectionHandler}
        chartDeletionHandler={testChartDeletionHandler}
        selectedChartChangeHandler={testSelectedChartChangeHandler}
        databases={[]}
        filters={[]}
        filterAdditionHandler={tempFilterAdditionHandler}
        filterDeletionHandler={tempFilterDeletionHandler}
        selectedFilterChangeHandler={tempSelectedFilterChangeHandler}
        selectedFilterIndex={null}
        filterSelectionHandler={tempFilterSelectionHandler}
        />
    )

    const node = component.find('.selected-chart').first()
    //Manually trigger right click for menu
    node.simulate('contextMenu', { preventDefault() {}, pageY: 100, pageX:200}, 0)

    //delete option should be hidden if user does not have delete permissions
    expect(component.find('.delete-chart').exists()).toBe(false)
    
    //Plus icon should be hidden for user if he does not have permission to add chart
    expect(component.find('.add-new').exists()).toBe(false)
  })

  it('Triggers click event on plus icon on SideMenu to add Chart', () => {
    const component = shallow(
      <SideMenu 
        userInfo={userInfo}
        chartAdditionHandler={testChartAdditionHandler} 
        charts={charts}
        selectedChartIndex={0} 
        chartSelectionHandler={testChartSelectionHandler}
        chartDeletionHandler={testChartDeletionHandler}
        selectedChartChangeHandler={testSelectedChartChangeHandler}
        databases={[]}
        filters={[]}
        filterAdditionHandler={tempFilterAdditionHandler}
        filterDeletionHandler={tempFilterDeletionHandler}
        selectedFilterChangeHandler={tempSelectedFilterChangeHandler}
        selectedFilterIndex={null}
        filterSelectionHandler={tempFilterSelectionHandler}
        />
    )

    // Manually simulate click event on test button
    const addBtn = component.find('.add-new').first()
    addBtn.simulate('click')
    //Check if modal is open on clicking plus icon
    expect(component.state('showAddChartModal')).toBe(true)
  })

  it('Delete a chart by right click menu in SideMenu', () => {
    const component = shallow(
      <SideMenu 
        userInfo={userInfo}
        chartAdditionHandler={testChartAdditionHandler} 
        charts={CHART_DATA}
        selectedChartIndex={0} 
        chartSelectionHandler={testChartSelectionHandler}
        chartDeletionHandler={testChartDeletionHandler}
        selectedChartChangeHandler={testSelectedChartChangeHandler}
        databases={[]}
        filters={[]}
        filterAdditionHandler={tempFilterAdditionHandler}
        filterDeletionHandler={tempFilterDeletionHandler}
        selectedFilterChangeHandler={tempSelectedFilterChangeHandler}
        selectedFilterIndex={null}
        filterSelectionHandler={tempFilterSelectionHandler}
        />
    )
    expect(component.find('.selected-chart').exists()).toBe(true)
    
    const node = component.find('.selected-chart').first()
    
    //Manually trigger right click for menu    
    node.simulate('contextMenu', { preventDefault() {}, pageY: 100, pageX:200}, 0)

    expect(component.state('showLeftNavContextMenu')).toBe(true)
    expect(component.find('.left-nav-menu').exists()).toBe(true)

    const nodeDel = component.find('.delete-chart').first()
    //Manually trigger delete
    nodeDel.simulate('click')

    expect(testChartDeletionHandler).toBeCalled()
  })
}) 