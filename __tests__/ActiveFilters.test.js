import React from 'react';
import { shallow, mount } from 'enzyme';
import ActiveFilters from '../client/src/ActiveFilters.jsx';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';
import $ from 'jquery';

Enzyme.configure({ adapter: new Adapter() });

let wrapper;
let props;
let mockCallback;

const createProps = (mockCallback) => ({
  activeFilters: {
    language: {
      optionId: 'arabic',
      optionName: 'Arabic'
    }
  },
  setFilters: mockCallback
});

beforeEach(() => {
  jest.resetModules();
  mockCallback = jest.fn();
  props = createProps(mockCallback);
  wrapper = shallow(<ActiveFilters activeFilters={props.activeFilters} setFilters={mockCallback} /> );
});

describe('<ActiveFilters /> rendering', () => {
  it('should render elements', () => {
    expect(wrapper).toMatchSnapshot();
  });

  // it('should set filters when the FilterButton is clicked', () => {
  //   wrapper.find('FilterButton').simulate('click');
  //   expect(mockCallback.mock.calls.length).toEqual(1);
  // });

});