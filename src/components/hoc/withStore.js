import React from 'react';

const withStore = store => WrappedComponent => {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} store={store}/>;
    }
  };
}

export default withStore;