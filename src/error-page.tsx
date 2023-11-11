import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import ErrorState from './components/ErrorState';

const ErrorPage: React.FC = () => {
  // you don't need to explicitly set error to `unknown`
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.data.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <ErrorState msg={errorMessage}/>
  );
};

export default ErrorPage;