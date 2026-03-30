import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, RefreshCw, Loader2, Check, AlertCircle, Fingerprint } from "lucide-react";
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
  const userIdentifier = userCIN || "votre compte";

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
    if (!userCIN) navigate("/"); // Redirige vers login si pas de CIN
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
    const code = otp.join("");
    if (code.length < 6) {
      setError("Veuillez saisir les 6 chiffres.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", {
        cin: userCIN,
        otp: code
      });
      setSuccess(true);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Code incorrect ou expiré.");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/auth/resend-otp", {
        cin: userCIN,
      });
      setNewOtpSimulated(response.data.otp);
      setResendSuccess(true);
      setOtp(new Array(6).fill(""));
      setTimeout(() => { setResendSuccess(false); setNewOtpSimulated(""); }, 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Impossible de renvoyer le code.");
    } finally {
      setResendLoading(false);
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="app-container">
      {/* Bulle SMS simulée pour le nouveau code */}
      {resendSuccess && (
        <div className="sms-notification-bubble fade-in">
          <p className="sms-header">Messages • À l'instant</p>
          <p className="sms-content">ASHAL : Nouveau code : <strong>{newOtpSimulated}</strong></p>
        </div>
      )}

      <div className="moucharabieh-overlay"></div>
      <div style={{ padding: '40px 25px', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.85rem', fontWeight: '700', marginBottom: '20px' }}>
          <ArrowLeft size={18} /> Retour
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }} className="fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', background: '#EFF6FF', borderRadius: '24px', marginBottom: '16px', border: '1px solid #BFDBFE' }}>
            <ShieldCheck size={34} color="#0056D2" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Code <span style={{ color: '#E70011' }}>OTP</span></h1>
        </div>

        {error && <div className="error-banner fade-in"><AlertCircle size={16} /> <span>{error}</span></div>}
        {success && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px', borderRadius: '12px', marginBottom: '15px' }} className="fade-in"><Check size={16} /> Vérification réussie !</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '28px' }}>
          {otp.map((data, index) => (
            <input key={index} type="text" maxLength="1" ref={(el) => (inputRefs.current[index] = el)} value={data}
              onChange={(e) => handleChange(e.target, index)} onKeyDown={(e) => handleKeyDown(e, index)}
              style={{ width: '46px', height: '58px', textAlign: 'center', fontSize: '1.4rem', fontWeight: '900', border: data ? '2px solid #0056D2' : '2px solid #E2E8F0', borderRadius: '16px', background: data ? '#EFF6FF' : '#F8FAFC' }}
            />
          ))}
        </div>

        <button onClick={handleVerify} disabled={loading || success} className="btn-ashal-primary">
          {loading ? <Loader2 className="animate-spin" /> : "VÉRIFIER LE CODE"}
        </button>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
          Vous n'avez pas reçu le code ?{' '}
          <span onClick={!resendLoading ? handleResend : undefined} style={{ color: '#0056D2', fontWeight: '800', cursor: 'pointer' }}>
            {resendLoading ? "Envoi..." : "Renvoyer"}
          </span>
        </div>
      </div>

      <style>{`
        .sms-notification-bubble { position: absolute; top: 15px; left: 15px; right: 15px; background: white; padding: 15px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); z-index: 1000; border-left: 5px solid #E70011; }
        .sms-header { margin: 0; font-size: 0.65rem; font-weight: 900; color: #E70011; }
        .error-banner { background: #fef2f2; color: #b91c1c; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; margin-bottom: 15px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default VOTP;