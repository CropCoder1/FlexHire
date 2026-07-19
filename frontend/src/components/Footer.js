import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-bg_secondary)',
      borderTop: '1px solid var(--color-border)',
      padding: '2px',
      marginTop: '40px',
      color: 'var(--color-text_primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Curved Top Border Effect */}
      <div style={{
        position: 'absolute',
        top: '-1px',
        left: '0',
        right: '0',
        height: '10px',
        background: 'var(--color-bg_primary)',
        borderRadius: '100% 100% 0 0 / 100% 100% 0 0'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: '1' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '10px'
        }}>
          {/* About Section */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: '700',
              margin: '0 0 6px 0',
              color: 'var(--color-accent_primary)'
            }}>
              About FlexHire
            </h4>
            <p style={{
              fontSize: '11px',
              lineHeight: '1.3',
              color: 'var(--color-text_secondary)',
              margin: '0'
            }}>
              Connecting talented workers with job providers in a flexible, transparent, and secure marketplace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: '700',
              margin: '0 0 6px 0',
              color: 'var(--color-accent_primary)'
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              <li style={{ marginBottom: '4px' }}>
                <a href="/" style={{
                  color: 'var(--color-text_secondary)',
                  textDecoration: 'none',
                  fontSize: '11px',
                  transition: 'color 0.3s'
                }} onMouseEnter={(e) => e.target.style.color = 'var(--color-accent_primary)'} 
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text_secondary)'}>
                  Dashboard
                </a>
              </li>
              <li style={{ marginBottom: '4px' }}>
                <a href="/blog" style={{
                  color: 'var(--color-text_secondary)',
                  textDecoration: 'none',
                  fontSize: '11px',
                  transition: 'color 0.3s'
                }} onMouseEnter={(e) => e.target.style.color = 'var(--color-accent_primary)'} 
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text_secondary)'}>
                  Blog
                </a>
              </li>
              <li style={{ marginBottom: '4px' }}>
                <a href="/profile" style={{
                  color: 'var(--color-text_secondary)',
                  textDecoration: 'none',
                  fontSize: '11px',
                  transition: 'color 0.3s'
                }} onMouseEnter={(e) => e.target.style.color = 'var(--color-accent_primary)'} 
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text_secondary)'}>
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: '700',
              margin: '0 0 6px 0',
              color: 'var(--color-accent_primary)'
            }}>
              Contact Us
            </h4>
            <div style={{
              fontSize: '11px',
              lineHeight: '1.3',
              color: 'var(--color-text_secondary)'
            }}>
              <p style={{ margin: '0 0 4px 0' }}>
                📞 <strong style={{ color: 'var(--color-text_primary)' }}>anyconect:</strong> 9878987625
              </p>
              <p style={{ margin: '0' }}>
                📧 <a href="mailto:allmeber@gmail.com" style={{
                  color: 'var(--color-accent_primary)',
                  textDecoration: 'none'
                }}>
                  allmeber@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '8px',
          marginTop: '8px'
        }}>
          {/* Team Credits */}
          <div style={{
            marginBottom: '4px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '11px',
              color: 'var(--color-text_secondary)',
              margin: '0 0 3px 0'
            }}>
              <span style={{ color: 'var(--color-accent_primary)', fontWeight: '600' }}>Created by:</span> Shubham, Shiv, Aaron, Anish
            </p>
          </div>

          {/* Copyright */}
          <div style={{
            textAlign: 'center',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '6px'
          }}>
            <p style={{
              fontSize: '10px',
              color: 'var(--color-text_tertiary)',
              margin: '0'
            }}>
              © 2026 FlexHire. All rights reserved. | Made with ❤️ by the FlexHire Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
