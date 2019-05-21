import React from 'react';
import Reviews from './Reviews.jsx';
import $ from 'jquery';
import styled from 'styled-components';
import RecentlyPosted from './RecentlyPosted.jsx';
import FilterComponent from './FilterComponent.jsx';

/* REVIEWS MODULE
** Purpose: the ReviewsModule is the starting point for 3 separate components
** 1. Filters: dynamically display available filters pulled from BE
** 2. Reviews: reviews based on selected filter values
** 3. Recent reviews: most recent 10 reviews based on selected date range
*/
class ReviewsModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      activeFilters: {},
      filterSearch: {},
      count: 0,
      reviews: []
    };
    this.updateReviewState = this.updateReviewState.bind(this);
  }

  componentDidMount() {
    this.getReviews(this.state.activeFilters, this.updateReviewState);
    this.getFilters((err, data) => {
      if (err) { return console.error('Error getting filters'); }
      this.setState({
        filters: data
      });
    });
  }

  updateReviewState(data) {
    console.log(data);
    let reviews = data.rows;
    let count = data.count;
    this.setState({ reviews, count });
  }

  getReviews(options, callback) {
    $.ajax({
      url: 'http://localhost:3005/reviews',
      method: 'GET',
      data: {where: options},
      success: result => callback(result),
      error: () => console.error('Couldn\'t get reviews')
    });
  }

  getFilters(callback) {
    $.ajax({
      url: 'http://localhost:3005/reviews/filters',
      method: 'GET',
      success: (data) => callback(null, data), 
      error: (err) => console.error('Error getting filter', err)
    });
  }

  /* Set filters takes an event, a filter (e.g. language), and an option object with { optionId, optionName }
  ** optionId and optionName values are strings i they are valid, and empty objects if not, due to ORM/Sequelize recognizing empty objects as null
  ** If the updated filter has no restriction, e.g. it's an empty object, we delete the filter
  ** Else we update the filter with the new option.
  **
  ** Note, as have an activeFilters object and a filterSearch object
  ** activeFilters: filters (e.g. 'language') are keys, but values are objects with option ID and option display
  **  This is because filter 'Recommended' has values true/false, but display as 'Recommended' and 'Not recommended.
  ** filterSearch: this is the actual option object that is sent to an API. It contains the values to narrow the query by.
  */
  setFilters(e, filter, option) {
    e.preventDefault();
    let activeFilters = Object.assign(this.state.activeFilters);
    let filterSearch = Object.assign(this.state.filterSearch);

    if (typeof option.optionId === 'object' && Object.keys(option.optionId).length === 0) {
      delete activeFilters[filter];
      delete filterSearch[filter];
    } else {
      activeFilters[filter] = option;
      filterSearch[filter] = option.optionId;
    }
    this.setState({activeFilters, filterSearch});
    this.getReviews(filterSearch, this.updateReviewState);
  }

  render() {
    return (
      <ModuleContainer>
        <FilterComponent setFilters={this.setFilters.bind(this)} activeFilters={this.state.activeFilters} 
          filters={this.state.filters} count={this.state.count}/>
        <Reviews reviews={this.state.reviews}/>
        <RecentlyPosted />
      </ModuleContainer>
    );
  }
}

const ModuleContainer = styled.div`
  background: #1a2738;
  font-family: Arial, Helvetica, sans-serif;
`;

export default ReviewsModule;