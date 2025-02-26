// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion'; // You'll need to install this
import { Loader2, Download, Send, LogOut, Settings, FileText } from 'lucide-react';
import styles from '../styles/Dashboard.module.css'; // Create this file later

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Profile fetch error:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    setChatResponse('');
    setPdfUrl('');
    setIsAnimating(true);
    
    try {
      // Get chat response
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ topic: message })
      });

      if (!chatRes.ok) {
        const errorData = await chatRes.json();
        throw new Error(errorData.message || 'Failed to get response');
      }

      const chatData = await chatRes.json();
      setChatResponse(chatData.response);
      
      // Generate PDF from response
      await generatePdf(chatData.response);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 1000); // Stop animation with delay
    }
  };

  const generatePdf = async (content) => {
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });
      
      // Get response as text first for debugging
      const responseText = await res.text();
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Invalid response format from PDF generation API');
      }
      
      if (!res.ok) {
        console.error('PDF Generation failed:', data);
        throw new Error(data.message || 'Error generating PDF');
      }
      
      setPdfUrl(data.pdfUrl);
    } catch (error) {
      console.error('PDF Generation error:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingSpinner} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <motion.div 
          className={styles.logo}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.emoji}>📃</span>
          <h1>PDFolio</h1>
          <span className={styles.emoji}>📃</span>
        </motion.div>
        
        <div className={styles.headerActions}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/settings" className={styles.settingsButton}>
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </motion.div>
          
          <motion.button
            className={styles.logoutButton}
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </header>

      <main className={styles.main}>
        <motion.div 
          className={styles.welcome}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Welcome, {user.fullName}!</h2>
          <p>Ask any question and get an AI-generated response with PDF output.</p>
        </motion.div>

        {/* 3D Card Container */}
        <motion.div 
          className={styles.card3d}
          initial={{ rotateX: 10, rotateY: -10, scale: 0.9, opacity: 0 }}
          animate={{ 
            rotateX: isAnimating ? [0, 5, 0] : 0, 
            rotateY: isAnimating ? [-5, 5, 0] : 0, 
            scale: 1, 
            opacity: 1 
          }}
          transition={{ 
            duration: isAnimating ? 1.5 : 0.8, 
            ease: "easeOut",
            opacity: { duration: 0.6 }
          }}
        >
          <div className={styles.cardInner}>
            <div className={styles.formSection}>
              <form onSubmit={handleSubmit} className={styles.chatForm}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask anything (math, stories, code, etc.)"
                    className={styles.chatInput}
                    disabled={loading}
                  />
                  <motion.button 
                    type="submit"
                    className={styles.sendButton}
                    disabled={loading || !message.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? <Loader2 className={styles.spinner} /> : <Send />}
                  </motion.button>
                </div>
              </form>

              {error && (
                <motion.div 
                  className={styles.errorMessage}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {chatResponse && (
                <motion.div 
                  className={styles.responseContainer}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3>Response:</h3>
                  <div className={styles.response}>
                    {chatResponse.split('\n').map((line, i) => (
                      <p key={i}>{line || <br />}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {pdfUrl && (
              <motion.div 
                className={styles.pdfSection}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className={styles.pdfPreview}>
                  <div className={styles.pdfHeader}>
                    <FileText size={24} />
                    <h3>Generated PDF</h3>
                  </div>
                  <div className={styles.pdfFrame}>
                    <iframe
                      src={pdfUrl}
                      className={styles.pdfIframe}
                      title="Generated PDF"
                    />
                  </div>
                  <motion.a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={18} />
                    <span>Download PDF</span>
                  </motion.a>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Made with Enthusiasm by DS4X (
          <a 
            href="https://cyberwork.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Cyberwork LLC 🏢
          </a>
          )
        </motion.p>
      </footer>
    </div>
  );
}