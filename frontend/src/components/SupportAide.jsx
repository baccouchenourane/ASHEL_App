import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Mic, ImageIcon, Loader2, ShieldCheck, FileText } from 'lucide-react';

const SupportAide = ({ isEmbedded = false }) => {
  const [lang, setLang] = useState('fr'); 
  const [msg, setMsg] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: "Bienvenue sur GovChain Tunisia. Je suis Amine, votre assistant virtuel. Comment puis-je vous accompagner aujourd'hui ?" }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [chatHistory, isTyping]);

  const ui = {
    fr: { 
      placeholder: "Décrivez votre demande...", 
      listening: "Amine vous écoute...", 
      viewDoc: "Consulter le document", 
      typing: "Amine analyse votre demande...",
      status: "Session sécurisée par GovChain"
    },
    ar: { 
      placeholder: "كيف يمكنني مساعدتك؟", 
      listening: "أنا أسمعك...", 
      viewDoc: "عرض الوثيقة", 
      typing: "أمين بصدد الكتابة...",
      status: "اتصال آمن عبر GovChain"
    }
  };

  const handleSend = (textOverride) => {
    const userMsg = (textOverride || msg).toLowerCase();
    if (!userMsg.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setMsg("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let response = { role: 'bot', text: "" };

      // --- LOGIQUE DE RÉPONSE BASÉE SUR TES CAPTURES ---
      
      // 1. SERVICES ADMINISTRATIFS (Basé sur Capture 2026-04-15 010030)
      if (userMsg.includes("extrait") || userMsg.includes("naissance") || userMsg.includes("مضمون")) {
        response.text = lang === 'fr' 
          ? "L'extrait de naissance est disponible dans l'onglet 'Administration'. Une fois payé, il sera instantanément ajouté à votre Coffre-fort numérique." 
          : "تجم تطلع مضمون الولادة من قسم 'Administration'. بعد الخلاص، تلقاه طول في الـ Coffre-fort متاعك.";
      } 
      else if (userMsg.includes("b3") || userMsg.includes("bulletin") || userMsg.includes("عدلية")) {
        response.text = lang === 'fr'
          ? "La demande de Bulletin N°3 est traitée en ligne. Vous recevrez une notification système dès qu'il sera signé et prêt."
          : "طلب الـ B3 يتم عن بعد. توة تجيك 'Notification' أول ما يحضر و يتصحح إلكترونياً.";
      }
      // 2. MODES DE PAIEMENT (Basé sur Capture 2026-04-15 010108)
      else if (userMsg.includes("payer") || userMsg.includes("paiement") || userMsg.includes("خلاص")) {
        response.text = lang === 'fr'
          ? "GovChain accepte quatre modes de paiement : Carte Bancaire (Visa/Mastercard), E-Dinar (Poste), Virement Bancaire (RIB) ou en espèces via un bureau de Poste."
          : "تجم تخلص بـ 4 طرق: بطاقة بنكية، E-Dinar، تحويل بنكي (Virement) ولا كاش في البوسطة.";
      }
      // 3. FACTURES SONEDE (Basé sur Capture 2026-04-15 010103)
      else if (userMsg.includes("sonede") || userMsg.includes("فاتورة") || userMsg.includes("eau")) {
        response.text = lang === 'fr' 
          ? "Pour payer votre facture SONEDE, munissez-vous de la référence (ex: SND-2026). Le montant inclut la consommation et les taxes de 7%." 
          : "باش تخلص فاتورة الصوناد، استعمل رقم المرجع (SND-2026). المعلوم فيه الاستهلاك و الأداءات (7%).";
      }
      // 4. SÉCURITÉ (Basé sur Capture 2026-04-15 010113)
      else if (userMsg.includes("securite") || userMsg.includes("carte") || userMsg.includes("امن")) {
        response.text = lang === 'fr' 
          ? "Toutes vos transactions sont cryptées. Pour les paiements par carte, vérifiez bien le code CVV et la date d'expiration." 
          : "العمليات الكل مؤمنة. كي تخلص بالكارت، ثبت في الـ CVV و تاريخ نهاية الصلوحية.";
      }
      // 5. NOTIFICATIONS (Basé sur Capture 2026-04-15 010034)
      else if (userMsg.includes("notification") || userMsg.includes("suivi") || userMsg.includes("وينو")) {
        response.text = lang === 'fr' 
          ? "Consultez l'icône cloche en haut à droite pour suivre l'état de vos dossiers (en cours de signature, prêt, ou sécurité)." 
          : "ثبت في علامة الجرس الفوق على اليمين باش تتبع أوراقك (قيد الإنجاز ولا حضرت).";
      }
      // 6. DEFAUT
      else {
        response.text = lang === 'fr' 
          ? "Je n'ai pas bien saisi. Souhaitez-vous des informations sur le paiement SONEDE, l'Extrait de naissance ou le suivi de votre B3 ?" 
          : "ما فهمتكش مليح. تحب معلومات على خلاص الصوناد، المضمون، ولا الـ B3 ؟";
      }

      setChatHistory(prev => [...prev, response]);
    }, 1000);
  };

  const handleLocation = () => {
    setChatHistory(prev => [...prev, { 
      role: 'bot', 
      text: lang === 'fr' ? "Je localise les bureaux de poste et recettes des finances les plus proches..." : "قاعد نلوجلك على أقرب بوسطة و قباضة مالية..." 
    }]);
    setTimeout(() => {
        window.open("https://www.google.com/maps/search/Recette+des+finances+Tunisie", '_blank');
    }, 1000);
  };

  const toggleMic = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend(lang === 'ar' ? "كيفاش نخلص فاتورة" : "Comment payer ma facture");
    }, 2000);
  };

  return (
    <div style={chatContainer}>
      <div style={toolBar}>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
          <ShieldCheck size={16} color="#10B981" />
          <span style={{fontSize: '0.65rem', color: '#64748B', fontWeight: '700'}}>{ui[lang].status}</span>
        </div>
        <div style={{display:'flex', gap:'8px'}}>
          <button onClick={() => setLang('fr')} style={lang === 'fr' ? activeLang : inactiveLang}>FR</button>
          <button onClick={() => setLang('ar')} style={lang === 'ar' ? activeLang : inactiveLang}>AR</button>
        </div>
      </div>

      <div style={messageArea}>
        {chatHistory.map((c, i) => (
          <div key={i} style={{ alignSelf: c.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div style={{ 
              ...bubbleStyle, 
              background: c.role === 'user' ? '#1E293B' : 'white',
              color: c.role === 'user' ? 'white' : '#1E293B',
              borderRadius: c.role === 'user' ? '18px 18px 2px 18px' : '2px 18px 18px 18px',
              border: c.role === 'user' ? 'none' : '1px solid #E2E8F0',
              direction: (lang === 'ar' && c.role === 'bot') ? 'rtl' : 'ltr'
            }}>
              {c.text}
            </div>
          </div>
        ))}
        {isTyping && (
            <div style={typingStyle}>
                <Loader2 size={14} className="animate-spin" /> {ui[lang].typing}
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={quickActions}>
         <button onClick={() => handleSend("Extraits")} style={pillBtn}>📜 Extraits</button>
         <button onClick={() => handleSend("Paiement")} style={pillBtn}>💳 Paiements</button>
         <button onClick={handleLocation} style={pillBtn}>📍 Bureaux</button>
      </div>

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

// --- STYLES PROFESSIONNELS ---
const chatContainer = { height: '100%', display: 'flex', flexDirection: 'column', background: '#F8FAFC' };
const toolBar = { padding: '10px 15px', background: 'white', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const activeLang = { background: '#1E293B', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer' };
const inactiveLang = { background: '#F1F5F9', color: '#64748B', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer' };
const messageArea = { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' };
const bubbleStyle = { padding: '14px', fontSize: '0.8rem', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', lineHeight: '1.5', fontWeight: '500' };
const quickActions = { display: 'flex', gap: '8px', padding: '0 15px 10px 15px', overflowX: 'auto' };
const pillBtn = { background: 'white', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', color: '#1E293B', whiteSpace: 'nowrap', cursor: 'pointer' };
const typingStyle = { alignSelf: 'flex-start', color: '#64748B', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '5px' };
const inputContainer = { padding: '15px', background: 'white', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '10px' };
const inputStyle = { flex: 1, border: 'none', background: '#F1F5F9', padding: '12px 15px', borderRadius: '12px', outline: 'none', fontSize: '0.85rem' };
const iconBtn = { width: '45px', height: '45px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const sendBtn = { background: '#0056D2', width: '45px', height: '45px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

export default SupportAide;