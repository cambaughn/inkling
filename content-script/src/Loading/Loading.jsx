import React from 'react';
import './Loading.css';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';

const Loading = ({ loading, error }) => {
  return (
    <div className="loadingContainer">
      {loading && !error && <SpinnerIcon />}
      {error && (
        <div className="tooltip">
          <FiAlertCircle className="icon error-icon" />
          <span className="tooltipText">{error}</span>
        </div>
      )}
    </div>
  );
};

const SpinnerIcon = () => (
  <FiLoader className="icon spinner-icon" />
);


export default Loading;
