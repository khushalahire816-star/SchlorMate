import { Loader2 } from "lucide-react";

function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>

      <p className="text-slate-600 text-sm font-medium">{message}</p>
      <p className="text-slate-400 text-xs mt-1">Please wait a moment...</p>
    </div>
  );
}

export default Loading;
