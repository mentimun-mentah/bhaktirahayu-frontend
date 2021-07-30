import React from 'react';
import initializeStore from 'store';

const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

const getOrCreateStore = (initialState) => {
  if (typeof window === "undefined") {
    return initializeStore(initialState);
  }
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
};

const Apps = (App) => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      const store = getOrCreateStore();

      appContext.ctx.store = store;

      return {
        ...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
        initialReduxState: store.getState(),
      };
    }
   render() {
      const { initialReduxState } = this.props;
      return <App {...this.props} store={getOrCreateStore(initialReduxState)}></App>;
    }
  };
};

export default Apps 
