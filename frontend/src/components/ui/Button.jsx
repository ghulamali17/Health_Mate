function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-[0.98]",
    secondary:
      "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98]",
    blue: "bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-400 hover:text-primary hover:bg-slate-50 active:scale-[0.98]",
  };

  const baseStyles =
    "rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2";

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
