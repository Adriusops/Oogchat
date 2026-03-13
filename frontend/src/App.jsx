import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [roast, setRoast] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [votes, setVotes] = useState(42)

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Tu dois au moins écrire quelque chose, champion.')
      return
    }

    setLoading(true)
    setError('')
    setRoast('')

    try {
      const response = await fetch('http://localhost:7070/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      })

      if (!response.ok) {
        throw new Error('Le serveur a refusé de te roast. Même lui en a marre.')
      }

      const text = await response.text()
      setRoast(text)
    } catch (err) {
      setError(err.message || 'Erreur réseau. Même ton Wi-Fi te lâche.')
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
        <header>
          <h1>r/TLDRizer</h1>
          <p className="subtitle">Balance tes problèmes. L'IA les résume en une vanne.</p>
        </header>

        <div className="content">
          {/* Reddit-style post card */}
          <div className="post-card">
            <div className="post-header">
              <span className="subreddit">r/TLDRizer</span>
              <span>•</span>
              <span className="post-author">Posté par u/toi_même</span>
            </div>

            <div className="post-body">
              <div className="vote-section">
                <div className="vote-arrow up">▲</div>
                <div className="vote-count">{votes}</div>
                <div className="vote-arrow down">▼</div>
              </div>

              <div className="post-content">
                <div className="post-title">J'ai besoin de parler de mes problèmes</div>
                <textarea
                  className="input-area"
                  placeholder="Écris tes problèmes ici... L'IA va te roast."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="post-actions">
              <button
                className="roast-button"
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
              >
                {loading ? 'Analyse...' : 'Poster'}
              </button>
            </div>
          </div>

          {/* Comment/Response section */}
          {error && (
            <div className="comment-card error">
              <div className="comment-header">
                <span className="comment-author">u/AutoMod</span>
                <span className="bot-badge">BOT</span>
                <span>•</span>
                <span style={{color: '#818384'}}>à l'instant</span>
              </div>

              <div className="comment-body">
                <div className="vote-section">
                  <div className="vote-arrow up">▲</div>
                  <div className="vote-count">0</div>
                  <div className="vote-arrow down">▼</div>
                </div>

                <div className="comment-content">
                  <p className="comment-text">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="comment-card loading">
              <div className="comment-header">
                <span className="comment-author">u/TLDRizer_Bot</span>
                <span className="bot-badge">BOT</span>
                <span>•</span>
                <span style={{color: '#818384'}}>en train d'écrire...</span>
              </div>

              <div className="comment-body">
                <div className="vote-section">
                  <div className="vote-arrow up">▲</div>
                  <div className="vote-count">•</div>
                  <div className="vote-arrow down">▼</div>
                </div>

                <div className="comment-content">
                  <p className="comment-text">L'IA analyse ton pathos...</p>
                </div>
              </div>
            </div>
          )}

          {roast && !loading && (
            <div className="comment-card">
              <div className="comment-header">
                <span className="comment-author">u/TLDRizer_Bot</span>
                <span className="bot-badge">BOT</span>
                <span>•</span>
                <span style={{color: '#818384'}}>à l'instant</span>
              </div>

              <div className="comment-body">
                <div className="vote-section">
                  <div className="vote-arrow up">▲</div>
                  <div className="vote-count">69</div>
                  <div className="vote-arrow down">▼</div>
                </div>

                <div className="comment-content">
                  <p className="comment-text">{roast}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer>
          <p>Ctrl+Enter pour poster • Backend brutal powered by Ollama</p>
        </footer>
      </div>
    </div>
  )
}

export default App
