import React from "react";
import { FileText, ChevronRight } from "lucide-react";

const DemandeList = ({ demandes }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {demandes.map((d) => (
        <div key={d.id} className="ashal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '12px' }}>
              <FileText size={20} color="#0056D2" />
            </div>
            <div>
              <p style={{ fontWeight: '800', margin: 0, fontSize: '0.85rem', color: '#1A1D23' }}>{d.type}</p>
              <p style={{ fontSize: '0.7rem', color: '#64748B', margin: 0 }}>Délivré le {d.date}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontWeight: '800',
              background: d.status === "Prêt" ? "#D1FAE5" : "#FEF3C7",
              color: d.status === "Prêt" ? "#065F46" : "#92400E"
            }}>
              {d.status}
            </span>
            <ChevronRight size={16} color="#CBD5E1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DemandeList;