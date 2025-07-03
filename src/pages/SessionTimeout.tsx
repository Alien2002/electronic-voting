import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";

const SESSION_DURATION = 5 * 60 * 1000; 
const PROMPT_BEFORE = 30 * 1000; 

const SessionTimeout = ({ onLogout, onExtend }: { onLogout: () => void, onExtend: () => void }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [sessionKey, setSessionKey] = useState(0); // Add this line
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Starting session timer
    const timeout = setTimeout(() => setShowPrompt(true), SESSION_DURATION - PROMPT_BEFORE);
    setTimer(timeout);

    return () => {
      if (timer) clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [sessionKey]); // Depend on sessionKey

  const handleExtend = () => {
    setShowPrompt(false);
    if (timer) clearTimeout(timer);
    setSessionKey(prev => prev + 1); // Restart timer
    onExtend();
  };

  const handleLogout = () => {
    setShowPrompt(false);
    if (timer) clearTimeout(timer);
    signOut();
  };

  // Auto-logout if user doesn't respond in PROMPT_BEFORE ms
  useEffect(() => {
    let autoLogout: NodeJS.Timeout;
    if (showPrompt) {
      autoLogout = setTimeout(handleLogout, PROMPT_BEFORE);
    }
    return () => clearTimeout(autoLogout);
  }, [showPrompt]);

  return showPrompt ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded shadow">
        <p>Your session is about to expire. Extend session?</p>
        <div className="mt-4 flex gap-4">
          <button onClick={handleExtend} className="bg-blue-600 text-white px-4 py-2 rounded">Extend</button>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SessionTimeout;