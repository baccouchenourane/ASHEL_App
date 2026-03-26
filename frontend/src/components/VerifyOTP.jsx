import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, BellRing } from 'lucide-react';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [generated, setGenerated] = useState('');
  const [showSms, setShowSms] = useState(false);

  useEffect(() => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setGenerated(random);
    setTimeout(() => setShowSms(true), 1500);
  }, []);

  return (
    <div className="app-container">
      {showSms && (
        <div className="sms-notif">
          <div style={{display:'flex', gap:'10px'}}>
            <BellRing size={16} color="#C5A059" />
            <span style={{fontSize:'0.75rem'}}>Code de sécurité : <b>{generated}</b></span>
          </div>
        </div>
      )}
      <div style={{ padding: '60px 30px', textAlign: 'center' }}>
        <Smartphone size={50} color="#0F172A" />
        <h2>Vérification OTP</h2>
        <input 
          style={{ width: '100%', padding: '15px', textAlign: 'center', fontSize: '1.5rem', borderRadius: '12px', border: '2px solid #C5A059', margin: '30px 0' }}
          placeholder="000000" maxLength={6}
          onChange={(e) => { if(e.target.value === generated) navigate('/home'); }}
        />
        <p style={{fontSize: '0.8rem', color: '#64748B'}}>Entrez le code reçu par SMS</p>
      </div>
    </div>
  );
};

export default VerifyOTP;