function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white
        border border-slate-200/90
        rounded-2xl
        shadow-xs
        ${hover ? "hover:border-slate-300 hover:shadow-sm transition-all duration-200" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
