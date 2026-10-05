function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon: Icon,
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-xs active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/90 active:scale-[0.99]",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-emerald-500",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-xs active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-rose-500",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99]",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.99]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3 text-base font-semibold rounded-xl gap-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        font-medium
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizes[size] || sizes.md}
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}

export default Button;
