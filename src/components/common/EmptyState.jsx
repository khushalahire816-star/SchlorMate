import { Inbox } from "lucide-react";
import Button from "./Button";

function EmptyState({
  icon: Icon = Inbox,
  title = "No Data Found",
  message = "There is nothing to display right now.",
  buttonText,
  onButtonClick,
  className = "",
}) {
  const isComponent = typeof Icon === "function" || typeof Icon === "object";

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-10 text-center shadow-xs ${className}`}>
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 border border-slate-200/60">
        {isComponent ? (
          <Icon className="w-7 h-7 text-slate-500" />
        ) : (
          <span className="text-2xl">{Icon}</span>
        )}
      </div>

      <h2 className="text-lg font-bold text-slate-800">{title}</h2>

      <p className="text-slate-500 text-sm mt-1.5 max-w-md mx-auto leading-relaxed">{message}</p>

      {buttonText && onButtonClick && (
        <div className="mt-6">
          <Button onClick={onButtonClick} variant="primary">
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
