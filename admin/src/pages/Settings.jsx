// Settings.jsx
import { useState } from "react";
import ChangeDeletePassword from "../component/ChangeDeletePassword";

const Settings = () => {
  const [tab, setTab] = useState("deletePassword");

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl border border-gray-200 dark:border-[#1f1f1f] w-fit bg-gray-100 dark:bg-[rgba(10,10,10,0.6)]">
        <button
          onClick={() => setTab("deletePassword")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "deletePassword"
              ? "bg-[#b00000] text-white"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          🔑 Delete Password
        </button>
        {/* add more tabs here later */}
      </div>

      {tab === "deletePassword" && <ChangeDeletePassword />}
    </div>
  );
};

export default Settings;