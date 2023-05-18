import React from 'react';
import './Loading.css';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';

const Loading = ({ loading, error }) => {
  return (
    <div className="loadingContainer">
      {loading && !error && <SpinnerIcon />}
      {error && <ErrorIcon />}
    </div>
  );
};

const SpinnerIcon = () => (
  <FiLoader className="icon spinner-icon" />
);

const ErrorIcon = () => (
  <div className="tooltip">
    <FiAlertCircle className="icon error-icon" />
    <span className="tooltipText">There was an error generating the summary. Please try again.</span>
  </div>
);

export default Loading;
