import React from 'react';
import renderer from 'react-test-renderer';

import FormatSelector from '../src/Components/FormatSelector'

const apiResponseGetter =(event, value) => {
  return value
}

test('It returns the format which is clicked', () => {
   const component = renderer.create(
    <FormatSelector selectedFormat='table'
                apiResponseGetter={apiResponseGetter} />
  );

  let tree = component.toJSON();

  expect(tree.children[0].children[0].props.onClick()).toBe('table')
  expect(tree).toMatchSnapshot();

})
