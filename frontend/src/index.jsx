import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';

import { HashRouter, Navigate, Routes, Route } from "react-router-dom";
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root'));

const ROOT_VIEW = "CalendarView"

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <HashRouter basename="/">
        <Routes>
          <Route exact path="/" element={<App route={ROOT_VIEW} />} />
          <Route path="/TextAndImagesView" element={<App route='TextAndImagesView' />} />
          <Route path="/TextView" element={<Navigate to="/CalendarView" replace />} />
          <Route path="/ShowsByVenueView" element={<App route='ShowsByVenueView' />} />
          <Route path="/CalendarView" element={<App route='CalendarView' />} />
          <Route path="/MapView" element={<App route='MapView' />} />
          <Route path="/VenuesListView" element={<App route='VenuesListView' />} />
          <Route path="/About" element={<App route='About' />} />
        </Routes>
      </HashRouter>
    </RecoilRoot>
  </React.StrictMode>
);
