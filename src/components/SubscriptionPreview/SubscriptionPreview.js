import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import ListItem from './ListItem';
import Icon, { LoadingIcon } from '../Icon/Icon';
import {
  getSubscription,
  filterFeedItems,
  isFeedItemsFetching,
  getFeedItemsFetchError
} from '../../ducks';
import * as actions from '../../actions';
import './styles.css';

const enhance = compose(
  connect(
    (state, ownProps) => ({
      subscription: getSubscription(state, ownProps.id),
      feedItems: filterFeedItems(state, ownProps.id),
      isFetching: isFeedItemsFetching(state, ownProps.id),
      fetchError: getFeedItemsFetchError(state, ownProps.id)
    }),
    { markAsRead: actions.markAsRead }
  ),
  withHandlers({
    onMarkAsReadClick: props => () => props.markAsRead(props.feedItems.map(feedItem => feedItem.id))
  })
);

export const SubscriptionPreview = props => (
  <div className="subscription-preview">
    <h1>
      {props.subscription.title}
      <button className="unstyled-button check-button" onClick={props.onMarkAsReadClick}>
        <Icon name="check" title="Mark all as read" />
      </button>
    </h1>
    <div className="notifications">
      {props.isFetching && <LoadingIcon />}
      {props.fetchError && `An error occured. ${props.fetchError}`}
    </div>
    <ul className="list unstyled-list">
      {props.feedItems.slice(0, props.maxCount).map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
    <hr />
  </div>
);

SubscriptionPreview.propTypes = {
  subscription: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string
  }),
  feedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
      date: PropTypes.string,
      url: PropTypes.string
    })
  ),
  maxCount: PropTypes.number,
  isFetching: PropTypes.bool,
  fetchError: PropTypes.string,
  onMarkAsReadClick: PropTypes.func
};

export default enhance(SubscriptionPreview);
