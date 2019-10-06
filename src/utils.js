import {message} from 'antd';

export const showSuccessMessage = messageText => {
  message.success(messageText);
};

export const showErrorMessage = messageText => {
  message.error(messageText);
};

export const paginateOver = field => (prev, {fetchMoreResult}) => {
  if (!fetchMoreResult) return prev;
  return Object.assign({}, prev, {
    [field]: [...prev[field], ...fetchMoreResult[field]]
  });
};

export const prepend = (field, value) => prev => ({...prev, [field]: [value, ...prev[field]]});
