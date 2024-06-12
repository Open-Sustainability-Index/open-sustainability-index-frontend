import React from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Notifications = (): React.ReactElement => {
  return (
    <>
      <ToastContainer />

      <style jsx>
        {`
          :global(.Toastify__toast) {
            border-radius: 0.25em;
            box-shadow: 0 0.2em 1em rgba(0, 0, 0, 0.3);
            padding: 1em;
            background-color: #edf1f7;
            color: #0a0a0a;
            font-family: 'Open Sans', sans-serif;
            font-weight: 500;
          }
          :global(.Toastify__toast--success) {
            background-color: #d6ffc8;
          }
          :global(.Toastify__toast--warning) {
            background-color: #fffbe6;
          }
          :global(.Toastify__toast--error) {
            background-color: #ed7070;
            color: white;
          }
        `}
      </style>
    </>
  );
};
export default Notifications;
