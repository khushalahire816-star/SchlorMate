import { AlertTriangle } from "lucide-react";
import Button from "./Button";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested information. Please try again.",
  buttonText = "Try Again",
  onRetry,
}) {
  return (
    <div className="bg-white border border-rose-200/80 rounded-2xl p-10 text-center shadow-xs">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4 border border-rose-100">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h2 className="text-lg font-bold text-slate-800">{title}</h2>

      <p className="text-slate-500 text-sm mt-1.5 max-w-md mx-auto leading-relaxed">{message}</p>

      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry} variant="primary">
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
