import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { installInterceptors } from 'lib/axios'

import thunk from 'redux-thunk'
import reducers from './reducers'

const Store = initialState => {
  let devtools = composeWithDevTools(applyMiddleware(thunk))
  if(process.env.NODE_ENV === 'production'){
    devtools = applyMiddleware(thunk)
  }

  const store = createStore(reducers, initialState, devtools)
  installInterceptors(store)

  if (module.hot) {
    module.hot.accept("./reducers", () => {
      const createNextReducer = require("./reducers").default
      store.replaceReducer(createNextReducer(initialState))
    })
  }

  return store
}

export default Store
