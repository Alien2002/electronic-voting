// src/pages/BiometricAuthPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BiometricAuthPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFaceAuth = () => {
    setError(false);

    if (
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      alert("Camera access is not supported in this browser or environment.");
      setError(true);
      return;
    }

    const faceio = new faceIO("fioad3e0");

    faceio.authenticate({
      locale: "auto"
    }).then(userInfo => {
      setLoading(false);
      console.log("✅ FaceIO Auth Success:", userInfo);

      const email = userInfo?.details?.email || userInfo?.payload?.email;
      if (!email) {
        alert("Authenticated: but email not found");
      } else {
        alert("Authenticated: " + email);
      }

      navigate("/elections");
    }).catch(err => {
      setLoading(false);
      setError(true);
      let code = typeof err === "number" ? err : err?.code;
      switch (code) {
        case 1:
          alert("Make sure you have a working camera and allow access.");
          break;
        case 2:
          alert("No face model found for this application. Please contact support.");
          break;
        case 3:
          alert("You cancelled the operation.");
          break;
        case 4:
          alert("Session expired. Please try again.");
          break;
        case 5:
          alert("Operation timed out. Please try again.");
          break;
        case 6:
          alert("No face detected. Please ensure your face is clearly visible and well-lit.");
          break;
        case 7:
          alert("Face not recognized. Please try again.");
          break;
        case 8:
          alert("Multiple faces detected. Please ensure only your face is visible.");
          break;
        case 9:
          alert("Network error. Please check your connection and try again.");
          break;
        default:
          alert("Authentication failed. Error code: " + code);
      }
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
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Face"}
      </button>
      {error && (
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to Home
        </button>
      )}
    </div>
  );
};

export default BiometricAuthPage;
