import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2, Check, AlertCircle, Signal, Wifi, Battery } from "lucide-react";
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
        localStorage.setItem("ashel_token", "session_active_" + userCIN); 

        const userSession = {
          cin: userCIN,
          nom: pendingUser?.nom || "Citoyen",
          isLoggedIn: true
        };
        localStorage.setItem("user_ashel", JSON.stringify(userSession));

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
    <div className="auth-container dark-theme">
      <div className="app-container">
        <div className="moucharabieh-overlay" />

        {/* Barre d'état (Style iPhone) */}
        <div style={styles.statusBar}>
          <span style={styles.statusTime}>09:41</span>
          <div style={styles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

        {/* Bulle SMS simulée */}
        {resendSuccess && (
          <div className="sms-notification-bubble fade-in">
            <p className="sms-header">Messages • À l'instant</p>
            <p className="sms-content">
              ASHAL : Nouveau code : <strong>{newOtpSimulated}</strong>
            </p>
          </div>
        )}

        <div style={styles.scrollArea}>
          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            style={styles.backBtn}
          >
            <ArrowLeft size={20} color="#1e293b" />
          </button>

          {/* Titre & Icône */}
          <div style={{ textAlign: "center", marginBottom: "30px" }} className="fade-in">
            <div style={styles.stepIcon}>
              <ShieldCheck size={34} color="#0056D2" />
            </div>
            <h1 className="title-text">
              Code <span style={{ color: "#E70011" }}>OTP</span>
            </h1>
            <p className="subtitle-text" style={{ marginTop: "8px" }}>
              Saisissez le code reçu pour votre CIN{" "}
              <strong>{userCIN ? `${userCIN.substring(0, 3)}****` : ""}</strong>
            </p>
          </div>

          {/* Erreurs et Succès */}
          {error && (
            <div style={styles.errorBanner} className="fade-in">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div style={styles.successBanner} className="fade-in">
              <Check size={16} /> Vérification réussie ! Redirection...
            </div>
          )}

          {/* Champs OTP */}
          <div style={styles.otpGrid}>
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
                  ...styles.otpInput,
                  border: data ? "2px solid #0056D2" : "2px solid #E2E8F0",
                  background: data ? "#EFF6FF" : "#F8FAFC",
                }}
              />
            ))}
          </div>

          {/* Bouton vérifier */}
          <button
            onClick={handleVerify}
            disabled={loading || success}
            className="btn-primary-ashel"
            style={{
              opacity: loading || success ? 0.7 : 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "VÉRIFIER LE CODE"}
          </button>

          {/* Renvoyer le code */}
          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#64748B" }}>
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
      </div>

      <style>{`
        .auth-container.dark-theme { background: #f1f5f9; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
        .app-container { width: 390px; height: 844px; background: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); border-radius: 50px; border: 4px solid #334155; }
        .moucharabieh-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url("https://www.transparenttextures.com/patterns/arabesque.png"); opacity: 0.02; pointer-events: none; }
        
        .title-text { font-size: 1.8rem; font-weight: 900; color: #1e293b; }
        .subtitle-text { font-size: 0.85rem; color: #64748b; line-height: 1.5; }
        
        .btn-primary-ashel { width: 100%; padding: 16px; border-radius: 16px; border: none; background: #1e293b; color: white; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .btn-primary-ashel:hover { background: #0056D2; }

        .sms-notification-bubble {
          position: absolute; top: 55px; left: 15px; right: 15px;
          background: white; padding: 15px; border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); z-index: 1000;
          border-left: 5px solid #E70011;
        }
        .sms-header { margin: 0; font-size: 0.65rem; font-weight: 900; color: #E70011; text-transform: uppercase; }
        .sms-content { margin: 4px 0 0; font-size: 0.8rem; color: #1e293b; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const styles = {
  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', color: '#64748b', zIndex: 10 },
  statusTime: { fontWeight: '700', fontSize: '13px', color: '#1e293b' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '10px 24px 24px', zIndex: 2, position: 'relative' },
  backBtn: { width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '20px' },
  stepIcon: { width: '72px', height: '72px', borderRadius: '24px', background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  otpGrid: { display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "28px" },
  otpInput: { width: "42px", height: "58px", textAlign: "center", fontSize: "1.4rem", fontWeight: "900", borderRadius: "16px", outline: "none", transition: "0.2s" },
  errorBanner: { background: "#fef2f2", color: "#b91c1c", padding: "12px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", marginBottom: "15px", fontWeight: "600" },
  successBanner: { background: "#f0fdf4", color: "#15803d", padding: "12px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", marginBottom: "15px", fontWeight: "600" }
};

export default VOTP;