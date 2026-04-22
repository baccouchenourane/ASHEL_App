// PageAide.jsx
import React from 'react';
import SupportAide from '../components/SupportAide';

const PageAide = () => {
  return (
    <div style={styles.container}>
      <h1>Centre d'Aide</h1>
      <div style={styles.chatWrapper}>
        <SupportAide isEmbedded={true} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  chatWrapper: {
    height: '600px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};

export default PageAide;