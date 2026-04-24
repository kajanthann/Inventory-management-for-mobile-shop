import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

export const useConfirmToast = () => {
  const { theme } = useContext(AppContext) || {};

  return (message, onConfirm) => {
    let toastId;

    // ⏱ countdown component
    const ConfirmToast = () => {
      const [timeLeft, setTimeLeft] = useState(5);

      useEffect(() => {
        if (timeLeft <= 0) {
          toast.dismiss(toastId);
          return;
        }

        const timer = setTimeout(() => {
          setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
      }, [timeLeft]);

      return (
        <div
          className={`p-4 rounded-lg shadow-lg border w-[300px]
          ${
            theme === "dark"
              ? "bg-[#1a1a1a] border-[#2a2a2a] text-white"
              : "bg-white border-gray-200 text-black"
          }`}
        >
          <p className="text-sm mb-2 font-medium">{message} <span className="text-xs text-gray-400">{timeLeft}s</span></p>

          

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(toastId)}
              className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600"
            >
              No
            </button>

            <button
              onClick={() => {
                toast.dismiss(toastId);
                onConfirm();
              }}
              className="px-3 py-1 text-xs rounded bg-red-600 text-white"
            >
              Yes
            </button>
          </div>
        </div>
      );
    };

    toastId = toast.custom(<ConfirmToast />, {
      duration: 5000,
    });
  };
};