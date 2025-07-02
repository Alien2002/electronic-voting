// src/pages/BiometricAuthPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BiometricAuthPage = () => {
  const navigate = useNavigate();

  const handleFaceAuth = () => {
    const faceio = new faceIO("fioad3e0");

   faceio.authenticate({
  locale: "auto"
}).then(userInfo => {
  console.log("✅ FaceIO Auth Success:", userInfo);
  
  const email = userInfo?.details?.email || userInfo?.payload?.email;
  if (!email) {
    alert("Authenticated: but email not found");
  } else {
    alert("Authenticated: " + email);
  }

  navigate("/elections");
}).catch(err => {
  alert("Authentication failed: " + (err?.code ?? "unknown"));
  console.error("❌ FaceIO Auth Error:", err);
});

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-4">Verify Your Face</h1>
      <p className="mb-6">Authenticate before casting your vote.</p>
      <button
        onClick={handleFaceAuth}
        className="px-6 py-3 bg-white text-blue-900 rounded hover:bg-gray-200"
      >
        Verify Face
      </button>
    </div>
  );
};

export default BiometricAuthPage;
