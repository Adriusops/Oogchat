import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [wisdom, setWisdom] = useState('')
  const [displayedWisdom, setDisplayedWisdom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const MAX_CHARS = 2000

  // Typewriter effect for wisdom
  useEffect(() => {
    if (wisdom && !loading) {
      let i = 0
      setDisplayedWisdom('')
      const interval = setInterval(() => {
        if (i < wisdom.length) {
          setDisplayedWisdom(wisdom.substring(0, i + 1))
          i++
        } else {
          clearInterval(interval)
        }
      }, 20)
      return () => clearInterval(interval)
    }
  }, [wisdom, loading])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wisdom)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Il faut partager ses pensées pour recevoir la sagesse.')
      return
    }

    setLoading(true)
    setError('')
    setWisdom('')

    try {
      const response = await fetch('http://localhost:7070/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      })

      if (!response.ok) {
        throw new Error('Le chemin vers la sagesse est bloqué. Le sage se repose.')
      }

      const text = await response.text()
      setWisdom(text)
    } catch (err) {
      setError(err.message || 'La connexion à l\'arbre sacré a été rompue.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="app">
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Partagez votre texte.</h1>
            <h2 className="hero-subtitle">Recevez la sagesse d'Oogway.</h2>
            <p className="hero-description">
              Confiez vos pensées au sage et découvrez la sagesse ancestrale
              qui se cache derrière chaque mot.
            </p>
          </div>

          <div className="oogway-illustration">
            <div className="oogway-glow"></div>
            <img
              src="/images/kung-fu-panda-master-oogway-character-portrait-op2vy7v01xk24mmm.png"
              alt="Maître Oogway"
              className="oogway-image"
            />
          </div>
        </div>

        <div className="input-section">
          {/* Prompt suggestions */}
          <div className="prompt-suggestions">
            <button
              className="suggestion-chip"
              onClick={() => setInput("J'ai besoin de conseils pour gérer mon stress quotidien.")}
              disabled={loading}
            >
              💭 Gérer le stress
            </button>
            <button
              className="suggestion-chip"
              onClick={() => setInput("Comment trouver ma voie et mon but dans la vie ?")}
              disabled={loading}
            >
              🎯 Trouver sa voie
            </button>
            <button
              className="suggestion-chip"
              onClick={() => setInput("Je me sens perdu, comment retrouver ma motivation ?")}
              disabled={loading}
            >
              ✨ Retrouver la motivation
            </button>
          </div>

          <div className="input-card">
            <textarea
              className="text-input"
              placeholder="Commencez à écrire votre texte..."
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInput(e.target.value)
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Zone de texte pour la sagesse"
              maxLength={MAX_CHARS}
            />

            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              aria-label={loading ? 'En attente' : 'Envoyer'}
            >
              <span className="submit-icon">→</span>
            </button>
          </div>

          {/* Character counter */}
          <div className="input-meta">
            <span className={`char-count ${input.length > MAX_CHARS * 0.9 ? 'warning' : ''}`}>
              {input.length} / {MAX_CHARS}
            </span>
          </div>
        </div>

        {loading && (
          <div className="wisdom-response loading" role="status" aria-live="polite">
            <p className="wisdom-text">
              Le sage contemple vos mots
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="wisdom-response error" role="alert">
            <p className="wisdom-text">{error}</p>
          </div>
        )}

        {wisdom && !loading && (
          <div className="wisdom-response" role="region" aria-label="Sagesse du maître">
            <button
              className="copy-button"
              onClick={handleCopy}
              aria-label={copied ? 'Copié !' : 'Copier'}
              title={copied ? 'Copié !' : 'Copier la sagesse'}
            >
              {copied ? '✓' : '📋'}
            </button>
            <p className="wisdom-text">{displayedWisdom}</p>
          </div>
        )}

        <footer className="footer">
          <p>Ctrl+Entrée pour envoyer</p>
        </footer>
      </div>
    </div>
  )
}

export default App
