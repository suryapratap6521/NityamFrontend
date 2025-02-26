import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from "./reducers/index";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {thunk} from "redux-thunk";
// Define your custom theme
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  // Other theme configurations...
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Add thunk middleware
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
    <Toaster />
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);




