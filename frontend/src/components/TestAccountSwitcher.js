import React, { useState } from 'react';

const TestAccountSwitcher = ({ user, onLogout, onLoginAsTestUser }) => {
  const [showOptions, setShowOptions] = useState(false);

  const testAccounts = [
    { id: '1', name: 'Job Seeker', email: 'seeker@test.com', userType: 'jobSeeker', icon: '👷' },
    { id: '2', name: 'Job Provider', email: 'provider@test.com', userType: 'jobProvider', icon: '👔' }
  ];

  const handleSwitchAccount = (account) => {
    onLoginAsTestUser(account);
    setShowOptions(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }}>
      <button onClick={() => setShowOptions(!showOptions)}
        style={{ backgroundColor: 'var(--color-accent_primary)', color: 'white', border: 'none', padding: '12px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(66, 165, 245, 0.4)', transition: 'all 0.3s' }}>
        {showOptions ? '✕' : '🔄 Switch'} Account
      </button>

      {showOptions && (
        <div style={{ position: 'absolute', bottom: '60px', right: '0', backgroundColor: 'var(--color-bg_secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', minWidth: '200px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid var(--color-border)', fontSize: '12px', fontWeight: '600', color: 'var(--color-text_secondary)', textAlign: 'center' }}>
            Test Accounts (password: test123)
          </div>
          {testAccounts.map((account, idx) => (
            <button key={account.id} onClick={() => handleSwitchAccount(account)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', backgroundColor: 'transparent', borderBottom: idx < testAccounts.length - 1 ? '1px solid var(--color-border)' : 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text_primary)', fontSize: '13px', textAlign: 'left', transition: 'background-color 0.2s' }}>
              <span style={{ fontSize: '16px' }}>{account.icon}</span>
              <div>
                <div style={{ fontWeight: '600', fontSize: '12px' }}>{account.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text_secondary)' }}>{account.email}</div>
              </div>
            </button>
          ))}
          <button onClick={onLogout}
            style={{ width: '100%', padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '0 0 8px 8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default TestAccountSwitcher;
