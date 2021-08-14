import { parseCookies } from 'nookies'
import { createLogs } from 'lib/logsCreator'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { signature_exp, token_rvd, csrf_not_match, invalid_alg, missing_cookie_access_token } from 'lib/axios'
import { signature_failed, invalid_payload, not_enough_seg, invalid_header_str, refreshHeader } from 'lib/axios'

import thunk from 'redux-thunk'

import instance from 'lib/axios'
import reducers from './reducers'
import * as actions from 'store/actions'

const installInterceptors = (store) => {
  instance.interceptors.response.use((response) => {
    createLogs({ url: response?.config?.url, ...response?.data })
    return response;
  }, async error => {
    createLogs({ url: error?.response?.config?.url, ...error?.response?.data })
    const cookies = parseCookies();
    const { csrf_refresh_token } = cookies;

    const data = error && error.response && error.response.data;
    const status = error && error.response && error.response.status;
    const config = error && error.response && error.response.config;

    if(status == 422 && data.detail == signature_exp && csrf_refresh_token && config.url === "/users/refresh-token"){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
      return Promise.reject(error);
    }

    if(status == 404){
      return error.response;
    }

    if(status == 401 && 
      ((data.detail == token_rvd) || (data.detail == csrf_not_match) || 
      (data.detail == invalid_alg) || (data.detail == missing_cookie_access_token))
    ){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
    }

    if(status == 422 && ((data.detail == signature_failed) || (data.detail == invalid_payload) || (data.detail == not_enough_seg) || (data.detail == invalid_header_str))){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
    }

    if(status == 422 && data.detail == signature_exp && csrf_refresh_token){
      await instance.post("/users/refresh-token", null, refreshHeader())
        .then((res) => {
          if(res.data){
            const { csrf_access_token } = parseCookies();
            const needResolve = {
              ...error.config,
              headers: {
                ...error.config.headers,
                "X-CSRF-TOKEN": csrf_access_token,
              },
            }
            let isExecuted = false
            if(!isExecuted){
              isExecuted = true
              return instance.request(needResolve)
            }
          } else {
            instance.delete("/users/delete-cookies")
            store.dispatch(actions.logout());
          }
        })
    }

    return Promise.reject(error);
  });
}

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
