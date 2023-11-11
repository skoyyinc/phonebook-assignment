import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './error-page';
import ContactIndex from './routes/ContactIndex';
import AddContact from './routes/AddContact';
import ContactDetail from './routes/ContactDetail';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children : [
      {
        errorElement: <ErrorPage />,
       
        children: [
          { index: true, element: <ContactIndex /> },
          {
            path:"/add",
            element: <AddContact />,
            
            
          },
          {
            path:"/contact",
            element: <ContactDetail />,
            
          }
          
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    
    <RouterProvider router={router} />
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
