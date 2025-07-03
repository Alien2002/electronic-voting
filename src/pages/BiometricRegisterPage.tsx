// src/pages/BiometricRegisterPage.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const BiometricRegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleFaceRegistration = () => {
    setError(false); // Reset error state on new attempt
    const faceio = new faceIO("fioad3e0"); 

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
      navigate("/elections"); // Redirect to elections page after registration
    }).catch(err => {
      setError(true);
      localStorage.removeItem("faceRegistered");
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
          alert("Registration failed. Error code: " + code);
      }
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
      {error && (
        <button
          onClick={() => {
            localStorage.removeItem("faceRegistered");
            navigate("/");
          }}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to Home
        </button>
      )}
    </div>
  );
};

export default BiometricRegisterPage;
