

// src/pages/BiometricRegisterPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BiometricRegisterPage = () => {
  const navigate = useNavigate();

  const handleFaceRegistration = () => {
    const faceio = new faceIO("fioad3e0"); // Replace with your real FACEIO public ID

    faceio.enroll({
  locale: "auto",
  payload: {
    email: "voter@example.com",
    voterId: "VOTER001"
  }
}).then(userInfo => {
  console.log("✅ Full registration info:", userInfo);
alert("Face Registered for: " + userInfo.details.voterId);





  localStorage.setItem("faceRegistered", "true");
  navigate("/biometric-auth"); // ✅ send them to verify
}).catch(err => {
  let code = typeof err === "number" ? err : err?.code;
  alert("Registration failed. Error code: " + code);
  console.error("❌ Error details:", err);
});


  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-4">Register Your Face</h1>
      <p className="mb-6">Securely register before voting.</p>
      <button
        onClick={handleFaceRegistration}
        className="px-6 py-3 bg-white text-blue-900 rounded hover:bg-gray-200"
      >
        Register Face
      </button>
    </div>
  );
};

export default BiometricRegisterPage;
