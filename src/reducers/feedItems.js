import pipe from 'lodash/fp/pipe';
import omit from 'lodash/fp/omit';
import uniq from 'lodash/fp/uniq';
import getObj from 'lodash/fp/get';

import {
  FETCH_FEEDITEMS_REQUEST,
  FETCH_FEEDITEMS_SUCCESS,
  FETCH_FEEDITEMS_FAILURE,
  DELETE_SUBSCRIPTION,
  MARK_FEEDITEM_READ,
  UNMARK_FEEDITEM_READ,
  BOOKMARK_FEEDITEM,
  UNBOOKMARK_FEEDITEM,
  UPDATE_UNREAD_COUNT
} from '../actions';

const feedItems = (state = {}, action) => {
  switch (action.type) {
    case FETCH_FEEDITEMS_REQUEST:
      return {
        ...state,
        [action.subscriptionId]: {
          ...pipe(
            getObj(action.subscriptionId),
            omit('error')
          )(state),
          fetching: true
        }
      };
    case FETCH_FEEDITEMS_SUCCESS:
      return {
        ...state,
        [action.subscriptionId]: {
          ...pipe(
            getObj(action.subscriptionId),
            omit(['error', 'fetching'])
          )(state),
          items: action.items
        }
      };
    case FETCH_FEEDITEMS_FAILURE:
      return {
        ...state,
        [action.subscriptionId]: {
          ...pipe(
            getObj(action.subscriptionId),
            omit('fetching')
          )(state),
          error: action.error
        }
      };
    case DELETE_SUBSCRIPTION:
      return omit(action.subscriptionId)(state);
    case MARK_FEEDITEM_READ:
      var readItems = getObj([action.subscriptionId, 'markedAsRead'])(state) || [];
      return {
        ...state,
        [action.subscriptionId]: {
          ...getObj(action.subscriptionId)(state),
          markedAsRead: uniq(readItems.concat(action.ids))
        }
      };
    case UNMARK_FEEDITEM_READ:
      readItems = getObj([action.subscriptionId, 'markedAsRead'])(state) || [];
      return {
        ...state,
        [action.subscriptionId]: {
          ...getObj(action.subscriptionId)(state),
          markedAsRead: readItems.filter(item => item !== action.id)
        }
      };
    case UPDATE_UNREAD_COUNT:
      var items = getObj([action.subscriptionId, 'items'])(state) || [];
      readItems = getObj([action.subscriptionId, 'markedAsRead'])(state) || [];
      const unreadItems = items.filter(entry => !readItems.includes(entry.id));
      return {
        ...state,
        [action.subscriptionId]: {
          ...getObj(action.subscriptionId)(state),
          unreadCount: unreadItems.length
        }
      };
      case BOOKMARK_FEEDITEM:
        var bookmarkedItems = getObj([action.subscriptionId, 'bookmarked'])(state) || [];
        return {
          ...state,
          [action.subscriptionId]: {
            ...getObj(action.subscriptionId)(state),
            bookmarked: uniq(bookmarkedItems.concat(action.id))
          }
        };
      case UNBOOKMARK_FEEDITEM:
        bookmarkedItems = getObj([action.subscriptionId, 'bookmarked'])(state) || [];
        return {
          ...state,
          [action.subscriptionId]: {
            ...getObj(action.subscriptionId)(state),
            bookmarked: bookmarkedItems.filter(item => item !== action.id)
          }
        };
    default:
      return state;
  }
};

export default feedItems;
