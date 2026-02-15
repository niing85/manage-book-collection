import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Page01 from './page/page01';
import Page02 from './page/page02';
import Page03 from './page/page03';
import PageNotFound from './page/pageNotFound';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/page01" element={<Page01 />} />
          <Route path="/page02" element={<Page02 />} />
          <Route path="/page03" element={<Page03 />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
