import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, children, type = 'button', className = '', styleType }) => {
  // styleType: e.g. 'btn-large-blue'
  const styleClass = styleType ? styleType : 'button';
  return (
    <button onClick={onClick} type={type} className={`${styleClass} ${className}`.trim()}>
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  styleType: PropTypes.string,
};

export default Button;