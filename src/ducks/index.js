export const getSubscriptionKeys = subscriptions =>
  Object.keys(subscriptions);

export const getSubscription = (state, subscriptionId) =>
  state.subscriptions[subscriptionId];

export const getFeedItemObject = (state, subscriptionId) =>
  state.feedItems[subscriptionId] || {};

export const getFeedItems = (state, subscriptionId) =>
  getFeedItemObject(state, subscriptionId).items || [];

export const filterFeedItems = (state, subscriptionId) =>
  getFeedItems(state, subscriptionId).filter(item => state.markedFeedItems.indexOf(item.id) < 0);

export const isFeedItemsFetching = (state, subscriptionId) =>
  getFeedItemObject(state, subscriptionId).fetching;

export const getFeedItemsFetchError = (state, subscriptionId) =>
  getFeedItemObject(state, subscriptionId).error;
