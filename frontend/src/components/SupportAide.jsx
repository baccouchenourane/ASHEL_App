import React, { useState, useEffect, useRef } from 'react';
import { Send, Globe, MapPin, Navigation, Mic, MicOff, Image as ImageIcon, FileText } from 'lucide-react';

const SupportAide = ({ isEmbedded = false }) => {
  const [lang, setLang] = useState('fr'); 
  const [msg, setMsg] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: "Ahla bik! 👋 Je suis l'assistant Tunis-Bot. Comment puis-je vous aider ?" }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [chatHistory]);

  const ui = {
    fr: { placeholder: "Posez votre question...", listening: "J'écoute...", viewDoc: "Voir le document" },
    ar: { placeholder: "اسألني أي حاجة...", listening: "قاعد نسمع فيك...", viewDoc: "عرض الوثيقة" }
  };

  // --- LOGIQUE DE RÉPONSE RICHE (TEXTE + IMAGE + CARTE) ---
  const handleSend = (textOverride) => {
    const userMsg = (textOverride || msg).toLowerCase();
    if (!userMsg.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setMsg("");

    setTimeout(() => {
      let response = { role: 'bot', text: "" };

      // 1. Logique pour les TIMBRES / DOCUMENTS (IMAGE)
      if (userMsg.includes("timbre") || userMsg.includes("تنبر") || userMsg.includes("fiscal")) {
        response.text = lang === 'fr' 
          ? "Voici à quoi ressemble le timbre fiscal de 10 DT pour votre document :" 
          : "هذا هو التنبر الجبائي بـ 10 دينارات اللي تستحقو:";
        response.image = "https://th.bing.com/th/id/OIG.6O5p_Xy8_7W4W_2_1_1"; // Simulation image timbre
      } 
      // 2. Logique pour le RIB / CHÈQUE (IMAGE)
      else if (userMsg.includes("rib") || userMsg.includes("chèque") || userMsg.includes("صب")) {
        response.text = lang === 'fr' 
          ? "Pour trouver votre RIB, regardez en bas de votre chèque comme ceci :" 
          : "باش تلقى الـ RIB متاعك، ثبت في أسفل الشيك متاعك هكا:";
        response.image = "https://www.aide-banque.fr/wp-content/uploads/2019/04/specimen-cheque-rib.jpg";
      }
      // 3. Logique AMENDES
      else if (userMsg.includes("nkhales") || userMsg.includes("خطية")) {
        response.text = lang === 'fr' 
          ? "Vous pouvez payer vos amendes dans l'onglet 'Amendes'." 
          : "تجم تخلص خطاياك في قسم 'المخالفات' بالـ Carte Bancaire.";
      }
      // 4. DEFAUT
      else {
        response.text = lang === 'fr' 
          ? "Désolé, je n'ai pas compris. Essayez 'timbre' ou 'RIB'." 
          : "سامحني ما فهمتكش، جرب اسألني على 'تنبر' ولا 'RIB'.";
      }

      setChatHistory(prev => [...prev, response]);
    }, 800);
  };

  const toggleMic = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend(lang === 'ar' ? "نحب نشوف تنبر" : "Je veux voir le timbre");
    }, 2000);
  };

  return (
    <div style={chatContainer}>
      {/* HEADER TOOLS */}
      <div style={toolBar}>
        <div style={{display:'flex', gap:'8px'}}>
          <button onClick={() => setLang('fr')} style={lang === 'fr' ? activeLang : inactiveLang}>FR</button>
          <button onClick={() => setLang('ar')} style={lang === 'ar' ? activeLang : inactiveLang}>عربي</button>
        </div>
        <button onClick={() => handleSend(lang === 'ar' ? "وين أقرب قباضة؟" : "Où est la recette ?")} style={locationBtn}>
          <MapPin size={14} /> {lang === 'fr' ? 'Proximité' : 'الأقرب'}
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div style={messageArea}>
        {chatHistory.map((c, i) => (
          <div key={i} style={{ alignSelf: c.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div style={{ 
              ...bubbleStyle, 
              background: c.role === 'user' ? '#0056D2' : 'white',
              color: c.role === 'user' ? 'white' : '#1E293B',
              borderRadius: c.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              direction: (lang === 'ar' && c.role === 'bot') ? 'rtl' : 'ltr'
            }}>
              {c.text}
              
              {/* AFFICHAGE IMAGE SI EXISTE */}
              {c.image && (
                <div style={imageContainer}>
                  <img src={c.image} alt="doc" style={docImg} />
                  <div style={imageLabel}><ImageIcon size={12}/> {ui[lang].viewDoc}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isListening && <div style={listeningIndicator}>{ui[lang].listening}</div>}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div style={inputContainer}>
        <button onClick={toggleMic} style={{...iconBtn, background: isListening ? '#EF4444' : '#F1F5F9'}}>
          <Mic size={20} color={isListening ? "white" : "#64748B"} />
        </button>
        <input 
          style={inputStyle}
          placeholder={ui[lang].placeholder}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={() => handleSend()} style={sendBtn}><Send size={18} color="white" /></button>
      </div>
    </div>
  );
};

// --- STYLES ---
const chatContainer = { height: '100%', display: 'flex', flexDirection: 'column', background: '#F8FAFC' };
const toolBar = { padding: '12px 15px', background: 'white', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const activeLang = { background: '#0056D2', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer' };
const inactiveLang = { background: '#F1F5F9', color: '#64748B', border: 'none', padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer' };
const locationBtn = { background: '#ECFDF5', color: '#10B981', border: '1px solid #10B981', padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' };

const messageArea = { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' };
const bubbleStyle = { padding: '12px 16px', fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', lineHeight: '1.4' };

const imageContainer = { marginTop: '10px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', background: 'white' };
const docImg = { width: '100%', height: 'auto', display: 'block' };
const imageLabel = { padding: '8px', fontSize: '0.65rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700' };

const listeningIndicator = { alignSelf: 'center', background: '#FEE2E2', color: '#EF4444', padding: '5px 15px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' };
const inputContainer = { padding: '15px', background: 'white', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '10px' };
const inputStyle = { flex: 1, border: 'none', background: '#F1F5F9', padding: '12px 15px', borderRadius: '15px', outline: 'none', fontSize: '0.85rem' };
const iconBtn = { width: '42px', height: '42px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const sendBtn = { background: '#0056D2', width: '42px', height: '42px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

export default SupportAide;