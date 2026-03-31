import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react";
import axios from "axios";

const VOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [newOtpSimulated, setNewOtpSimulated] = useState("");

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const userCIN = localStorage.getItem("pending_cin");

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
    if (!userCIN) navigate("/");
  }, [userCIN, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const val = element.value;
    setOtp([...otp.map((d, idx) => (idx === index ? val : d))]);
    if (val !== "" && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

const handleVerify = async () => {
  setLoading(true);
  setError("");
  try {
    const response = await axios.post("http://localhost:8081/api/auth/verify-otp", {
      cin: userCIN,
      code: otp.join("")
    });

    if (response.data.success) {
      const pendingUser = JSON.parse(localStorage.getItem("pending_user"));

      // 1. CRÉATION DU TOKEN (Ce qui manquait !)
      // Si ton backend renvoie un token, utilise : response.data.token
      localStorage.setItem("ashel_token", "session_active_" + userCIN); 

      // 2. CRÉATION DE LA SESSION
      const userSession = {
        cin: userCIN,
        nom: pendingUser?.nom || "Citoyen",
        isLoggedIn: true
      };
      localStorage.setItem("user_ashel", JSON.stringify(userSession));

      // 3. NETTOYAGE
      localStorage.removeItem("pending_cin");
      localStorage.removeItem("pending_user");

      setSuccess(true);
      
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    }
  } catch (err) {
    setError(err.response?.data?.error || "Code incorrect.");
  } finally {
    setLoading(false);
  }
};

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError("");
    try {
      const response = await axios.post("http://localhost:8081/api/auth/resend-otp", {
        cin: userCIN,
      });

      const newCode = response.data.otp;
      setNewOtpSimulated(newCode);
      localStorage.setItem("temp_otp", newCode);

      setResendSuccess(true);
      setOtp(new Array(6).fill(""));
      setTimeout(() => {
        setResendSuccess(false);
        setNewOtpSimulated("");
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Impossible de renvoyer le code.");
    } finally {
      setResendLoading(false);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
  };

  return (
    <div className="app-container">
      {/* Bulle SMS simulée pour le nouveau code */}
      {resendSuccess && (
        <div className="sms-notification-bubble fade-in">
          <p className="sms-header">Messages • À l'instant</p>
          <p className="sms-content">
            ASHAL : Nouveau code : <strong>{newOtpSimulated}</strong>
          </p>
        </div>
      )}

      <div className="moucharabieh-overlay"></div>

      <div
        style={{
          padding: "40px 25px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
          position: "relative",
        }}
      >
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#64748B",
            fontSize: "0.85rem",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          <ArrowLeft size={18} /> Retour
        </button>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: "30px" }} className="fade-in">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              background: "#EFF6FF",
              borderRadius: "24px",
              marginBottom: "16px",
              border: "1px solid #BFDBFE",
            }}
          >
            <ShieldCheck size={34} color="#0056D2" />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900" }}>
            Code <span style={{ color: "#E70011" }}>OTP</span>
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "8px" }}>
            Saisissez le code reçu pour votre CIN{" "}
            <strong>{userCIN ? `${userCIN.substring(0, 3)}****` : ""}</strong>
          </p>
        </div>

        {/* Messages d'état */}
        {error && (
          <div className="error-banner fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div
            style={{
              background: "#f0fdf4",
              color: "#15803d",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            className="fade-in"
          >
            <Check size={16} /> Vérification réussie ! Redirection...
          </div>
        )}

        {/* Champs OTP */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                width: "46px",
                height: "58px",
                textAlign: "center",
                fontSize: "1.4rem",
                fontWeight: "900",
                border: data ? "2px solid #0056D2" : "2px solid #E2E8F0",
                borderRadius: "16px",
                background: data ? "#EFF6FF" : "#F8FAFC",
                outline: "none",
                transition: "border 0.2s, background 0.2s",
              }}
            />
          ))}
        </div>

        {/* Bouton vérifier */}
        <button
          onClick={handleVerify}
          disabled={loading || success}
          className="btn-ashal-primary"
          style={{
            opacity: loading || success ? 0.7 : 1,
            cursor: loading || success ? "not-allowed" : "pointer",
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "VÉRIFIER LE CODE"}
        </button>

        {/* Renvoyer le code */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem" }}>
          Vous n'avez pas reçu le code ?{" "}
          <span
            onClick={!resendLoading && !success ? handleResend : undefined}
            style={{
              color: resendLoading || success ? "#94a3b8" : "#0056D2",
              fontWeight: "800",
              cursor: resendLoading || success ? "default" : "pointer",
            }}
          >
            {resendLoading ? "Envoi..." : "Renvoyer"}
          </span>
        </div>
      </div>

      <style>{`
        .sms-notification-bubble {
          position: absolute; top: 15px; left: 15px; right: 15px;
          background: white; padding: 15px; border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); z-index: 1000;
          border-left: 5px solid #E70011;
        }
        .sms-header { margin: 0; font-size: 0.65rem; font-weight: 900; color: #E70011; }
        .sms-content { margin: 4px 0 0; font-size: 0.8rem; color: #1e293b; }
        .error-banner {
          background: #fef2f2; color: #b91c1c; padding: 12px; border-radius: 12px;
          display: flex; align-items: center; gap: 8px; font-size: 0.8rem; margin-bottom: 15px;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default VOTP;