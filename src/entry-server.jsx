import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App';

//이하 코드에서 정적라우팅 진행
export function render(path) {
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </Provider>,
  );
  return { html };
}
//
