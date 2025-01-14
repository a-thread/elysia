import React from 'react';
import PropTypes from 'prop-types';

const IconButton = ({ icon, onClick, disabled, className, title, attributes, listeners, ...props }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 ${className}`}
      disabled={disabled}
      title={title}
      {...attributes}
      {...listeners}
      {...props}
    >
      {icon}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  attributes: PropTypes.object,
  listeners: PropTypes.object,
};

IconButton.defaultProps = {
  onClick: () => { },
  disabled: false,
  className: '',
  title: '',
  attributes: {},
  listeners: {},
};

export default IconButton;