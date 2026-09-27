import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import './styles/global.scss';
import { store } from './store/store';
import { ScrollToTop } from './shared/components/ScrollToTop';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <ScrollToTop />
      <App />
    </HashRouter>
  </Provider>
);