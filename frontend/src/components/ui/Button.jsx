function Button({ children, className = '', ...props }) {
  const baseStyles = 'rounded-xl px-6 py-3 font-semibold transition-all duration-200';

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
