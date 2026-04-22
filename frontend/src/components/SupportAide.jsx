import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Mic, Loader2, ShieldCheck, X, FileText } from 'lucide-react'; // ✅ AJOUTÉ FileText

const SupportAide = ({ isEmbedded = false, onClose }) => {
  const [lang, setLang] = useState('fr');
  const [msg, setMsg] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: "Bienvenue sur ASHAL Tunisia. Je suis Amine, votre assistant virtuel. Comment puis-je vous accompagner aujourd'hui ?" }
  ]);
  const chatEndRef = useRef(null);

  // Scroll automatique vers le dernier message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Gestion des réponses par mots-clés
  const getBotResponse = (userMsg) => {
    const msgLower = userMsg.toLowerCase();
    
    // Documents
    if (msgLower.includes("extrait") || msgLower.includes("naissance") || msgLower.includes("bulletin") || msgLower.includes("b3") || msgLower.includes("document")) {
      return lang === 'fr'
        ? "📄 Les documents administratifs (Extrait de naissance, Bulletin n°3) sont disponibles dans l'onglet 'Administration'. Une fois la demande validée et payée, ils sont instantanément ajoutés à votre Coffre-fort numérique signé et certifié."
        : "📄 الوثائق الإدارية (مضمون الولادة، Bulletin n°3) متوفرة في قسم 'Administration'. بعد التأكيد والخلاص، تلقاهم طول في Coffre-fort الرقمي متاعك.";
    }
    
    // Paiements
    if (msgLower.includes("paiement") || msgLower.includes("payer") || msgLower.includes("paye") || msgLower.includes("carte") || msgLower.includes("cvv")) {
      return lang === 'fr'
        ? " ASHAL accepte 4 modes de paiement sécurisés :\n• Carte Bancaire (Visa/Mastercard)\n• E-Dinar (Poste)\n• Virement Bancaire (RIB)\n• Espèces via bureau de Poste\n\nVérifiez bien votre CVV et date d'expiration pour les paiements par carte."
        : " ASHAL تقبل 4 طرق دفع آمنة:\n• بطاقة بنكية (Visa/Mastercard)\n• E-Dinar (البوسطة)\n• تحويل بنكي (RIB)\n• كاش في البوسطة\n\nتأكد من CVV وتاريخ انتهاء الصلوحية للبطاقة.";
    }
    
    // Sécurité
    if (msgLower.includes("sécurité") || msgLower.includes("securite") || msgLower.includes("crypté") || msgLower.includes("securisé")) {
      return lang === 'fr'
        ? "🔒 Toutes vos transactions et documents sont cryptés de bout en bout sur ASHAL. Vos données sont protégées par la technologie blockchain tunisienne et conformes à la loi n°2025-12 sur la sécurité numérique."
        : "🔒 جميع معاملاتك ووثائقك مشفرة بالكامل على ASHAL. بياناتك محمية بتقنية البلوكشين التونسية ومتوافقة مع القانون عدد 12 لسنة 2025 المتعلق بالأمن الرقمي.";
    }
    
    // Suivi de dossiers
    if (msgLower.includes("suivi") || msgLower.includes("dossier") || msgLower.includes("avancement") || msgLower.includes("notification")) {
      return lang === 'fr'
        ? "📋 Pour suivre l'avancement de vos dossiers, cliquez sur l'icône 🔔 en haut à droite. Vous y trouverez :\n• État des signatures\n• Documents prêts\n• Notifications système\n• Alertes de sécurité"
        : "📋 باش تتبع تقدم أوراقك، انقر على أيقونة 🔔 في الأعلى على اليمين. تلقى فيه:\n• حالة التواقيع\n• وثائق جاهزة\n• إشعارات النظام\n• تنبيهات الأمن";
    }
    
    // Réponse par défaut
    return lang === 'fr'
      ? "Je n'ai pas bien saisi votre demande. Souhaitez-vous des informations sur :\n• 📄 Les documents administratifs\n• 💳 Les modes de paiement\n• 🔒 La sécurité des transactions\n• 📋 Le suivi de dossiers"
      : "ما فهمتكش مليح. تحب معلومات على:\n• 📄 الوثائق الإدارية\n• 💳 طرق الدفع\n• 🔒 أمان المعاملات\n• 📋 متابعة الملفات";
  };

  const handleSend = async (textOverride) => {
    const userMsg = (textOverride || msg).trim();
    if (!userMsg) return;

    // Ajout du message utilisateur
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setMsg("");
    
    // Simulation de frappe
    setIsTyping(true);
    
    // Délai de 1s pour simuler la réflexion
    setTimeout(() => {
      const response = getBotResponse(userMsg);
      setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  // Géolocalisation - Bureaux des finances
  const handleLocation = () => {
    const userMsg = lang === 'fr' ? "Où se trouvent les bureaux ?" : "وين توجد المكاتب؟";
    
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const response = lang === 'fr'
        ? "📍 Voici les recettes des finances en Tunisie. Cliquez sur le lien pour ouvrir Google Maps :\n\nhttps://www.google.com/maps/search/Recette+des+finances+Tunisie"
        : "📍 قباضات المالية في تونس. انقر على الرابط باش تفتح Google Maps:\n\nhttps://www.google.com/maps/search/Recette+des+finances+Tunisie";
      
      setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
      
      // Ouverture de Google Maps après 1s
      setTimeout(() => {
        window.open("https://www.google.com/maps/search/Recette+des+finances+Tunisie", '_blank');
      }, 1000);
    }, 1000);
  };

  // Interface vocale simulée
  const toggleMic = () => {
    setIsListening(true);
    
    // Message d'écoute
    setChatHistory(prev => [...prev, { 
      role: 'bot', 
      text: lang === 'fr' ? "🎤 Amine vous écoute..." : "🎤 أمين يسمعك..." 
    }]);
    
    // Après 2s, déclenche une requête prédéfinie
    setTimeout(() => {
      setIsListening(false);
      const voiceQuery = lang === 'fr' ? "Comment payer ma facture" : "كيفاش نخلص فاتورة";
      handleSend(voiceQuery);
    }, 2000);
  };

  // Réinitialisation de la conversation
  const resetConversation = () => {
    setChatHistory([
      { role: 'bot', text: lang === 'fr' 
        ? "Bonjour ! Je suis Amine. Comment puis-je vous aider aujourd'hui ?" 
        : "السلام عليكم！أنا أمين. كيفاش نقدر نعاونك اليوم؟" 
      }
    ]);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>
            <span style={styles.avatarEmoji}>🤖</span>
          </div>
          <div>
            <h3 style={styles.title}>Amine - Assistant Virtuel</h3>
            <div style={styles.statusBadge}>
              <ShieldCheck size={12} color="#10B981" />
              <span style={styles.statusText}>
                {lang === 'fr' ? "Session sécurisée" : "اتصال آمن"}
              </span>
            </div>
          </div>
        </div>
        <div style={styles.headerRight}>
          {/* Boutons de langue */}
          <div style={styles.langButtons}>
            <button 
              onClick={() => setLang('fr')} 
              style={lang === 'fr' ? styles.langActive : styles.langInactive}
            >
              FR
            </button>
            <button 
              onClick={() => setLang('ar')} 
              style={lang === 'ar' ? styles.langActive : styles.langInactive}
            >
              AR
            </button>
          </div>
          {!isEmbedded && onClose && (
            <button onClick={onClose} style={styles.closeBtn}>
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Zone de messages */}
      <div style={styles.messageArea}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                ...(message.role === 'user' ? styles.userBubble : styles.botBubble),
                direction: (lang === 'ar' && message.role === 'bot') ? 'rtl' : 'ltr',
                textAlign: (lang === 'ar' && message.role === 'bot') ? 'right' : 'left',
              }}
            >
              <div style={styles.messageText}>{message.text}</div>
            </div>
          </div>
        ))}
        
        {/* Indicateur de frappe */}
        {isTyping && (
          <div style={styles.typingContainer}>
            <div style={styles.typingBubble}>
              <Loader2 size={16} style={styles.spinning} />
              <span style={styles.typingText}>
                {lang === 'fr' ? "Amine analyse votre demande..." : "أمين بصدد الكتابة..."}
              </span>
            </div>
          </div>
        )}
        
        {/* Ancre pour scroll automatique */}
        <div ref={chatEndRef} />
      </div>

      {/* Boutons d'actions rapides */}
      <div style={styles.quickActions}>
        <button onClick={() => handleSend("documents")} style={styles.quickBtn}>
          <FileText size={14} /> {lang === 'fr' ? "Documents" : "الوثائق"}
        </button>
        <button onClick={() => handleSend("paiement")} style={styles.quickBtn}>
          💳 {lang === 'fr' ? "Paiements" : "الدفع"}
        </button>
        <button onClick={() => handleSend("sécurité")} style={styles.quickBtn}>
          🔒 {lang === 'fr' ? "Sécurité" : "الأمان"}
        </button>
        <button onClick={() => handleSend("suivi")} style={styles.quickBtn}>
          📋 {lang === 'fr' ? "Suivi" : "المتابعة"}
        </button>
        <button onClick={handleLocation} style={styles.quickBtn}>
          <MapPin size={14} /> {lang === 'fr' ? "Bureaux" : "المكاتب"}
        </button>
      </div>

      {/* Zone de saisie */}
      <div style={styles.inputArea}>
        <button 
          onClick={toggleMic} 
          style={isListening ? styles.micBtnActive : styles.micBtn}
          disabled={isTyping}
        >
          <Mic size={20} color={isListening ? "white" : "#64748B"} />
        </button>
        
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
          placeholder={lang === 'fr' ? "Décrivez votre demande..." : "كيف يمكنني مساعدتك؟"}
          style={styles.input}
          disabled={isTyping}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        />
        
        <button 
          onClick={() => handleSend()} 
          style={styles.sendBtn}
          disabled={isTyping || !msg.trim()}
        >
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#F8FAFC',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    background: 'white',
    padding: '16px 20px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #0056D2 0%, #003A8F 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: '22px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    color: '#1E293B',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
  },
  statusText: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: '500',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  langButtons: {
    display: 'flex',
    gap: '6px',
    background: '#F1F5F9',
    padding: '3px',
    borderRadius: '8px',
  },
  langActive: {
    background: '#1E293B',
    color: 'white',
    border: 'none',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  langInactive: {
    background: 'transparent',
    color: '#64748B',
    border: 'none',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  },
  messageArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  userBubble: {
    background: '#0056D2',
    color: 'white',
    borderRadius: '12px 12px 2px 12px',
  },
  botBubble: {
    background: 'white',
    color: '#1E293B',
    border: '1px solid #E2E8F0',
    borderRadius: '2px 12px 12px 12px',
  },
  messageText: {
    fontWeight: '500',
  },
  typingContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  typingBubble: {
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinning: {
    animation: 'spin 1s linear infinite',
  },
  typingText: {
    fontSize: '13px',
    color: '#64748B',
  },
  quickActions: {
    padding: '12px 20px',
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    borderTop: '1px solid #E2E8F0',
    background: 'white',
  },
  quickBtn: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1E293B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  inputArea: {
    padding: '16px 20px',
    background: 'white',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  micBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    background: '#EF4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulseMic 1s infinite', // ✅ Renommé pour éviter conflit
  },
  input: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    background: '#F8FAFC',
    fontFamily: 'inherit',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    background: '#0056D2',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
};

// ✅ Animation avec noms uniques pour éviter les conflits
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulseMic {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);

export default SupportAide;