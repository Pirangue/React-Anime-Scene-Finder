import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [previewFile, setPreviewFile] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quotaInfo, setQuotaInfo] = useState(null)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewFile(e.target.result)
        searchImage(file)
      }
      reader.readAsDataURL(file)
    } else {
      setError('Por favor, selecione uma imagem válida')
    }
  }

  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('drag-over')
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over')
    }
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const searchImage = async (imageFile) => {
    setLoading(true)
    setError('')
    setResults([])

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('https://api.trace.moe/search?anilistInfo', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Erro ao buscar')

      const data = await response.json()

      if (data.result && data.result.length > 0) {
        setResults(data.result)
        setQuotaInfo({
          used: data.limit - data.limit_ttl,
          total: data.limit,
          remaining: data.limit_ttl,
        })
      } else {
        setError('Nenhum resultado encontrado para esta imagem.')
      }
    } catch (err) {
      setError(`Erro ao buscar: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const searchByUrl = async () => {
    if (!imageUrl.trim()) {
      setError('Por favor, insira uma URL válida')
      return
    }

    setLoading(true)
    setError('')
    setResults([])

    try {
      const encodedUrl = encodeURIComponent(imageUrl)
      const response = await fetch(`https://api.trace.moe/search?url=${encodedUrl}&anilistInfo`)

      if (!response.ok) throw new Error('Erro ao buscar')

      const data = await response.json()

      if (data.result && data.result.length > 0) {
        setResults(data.result)
        setQuotaInfo({
          used: data.limit - data.limit_ttl,
          total: data.limit,
          remaining: data.limit_ttl,
        })
      } else {
        setError('Nenhum resultado encontrado para esta URL.')
      }
    } catch (err) {
      setError(`Erro ao buscar: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const clearPreview = () => {
    setPreviewFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            🔍 <span>Anime Scene Finder</span>
          </div>
          <p className="subtitle">Descubra de qual anime é aquela cena! Envie uma imagem e encontraremos o anime, episódio e momento exato.</p>
          <button
            className="btn-quota"
            title="Ver cota de uso"
            onClick={() => alert(quotaInfo ? `Usado: ${quotaInfo.used}/${quotaInfo.total}` : 'Nenhuma busca realizada ainda')}
          >
            📊 Minha Cota
          </button>
        </div>
      </header>

      <main className="main">
        <section className="card search-section">
          <h2>📤 Enviar Imagem</h2>

          <div className="tabs" role="tablist">
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
              role="tab"
            >
              📁 Upload de Arquivo
            </button>
            <button
              className={`tab ${activeTab === 'url' ? 'active' : ''}`}
              onClick={() => setActiveTab('url')}
              role="tab"
            >
              🔗 URL da Imagem
            </button>
          </div>

          {activeTab === 'upload' && (
            <div className="tab-panel active" id="panel-upload">
              <div
                ref={dropZoneRef}
                className="drop-zone"
                onClick={handleDropZoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="drop-zone-content">
                  {previewFile ? (
                    <>
                      <img src={previewFile} className="preview-thumb" alt="Preview" />
                      <button
                        className="btn-clear"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearPreview()
                        }}
                      >
                        ✕ Limpar
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="drop-icon">📂</span>
                      <p>Arraste uma imagem aqui ou <strong>clique para selecionar</strong></p>
                      <p className="drop-hint">JPG, PNG, GIF, WEBP (máx. 25MB)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-input"
                  accept="image/*"
                  hidden
                  onChange={handleFileInput}
                />
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="tab-panel active" id="panel-url">
              <div className="url-input-group">
                <input
                  type="url"
                  placeholder="Cole a URL da imagem aqui... (ex: https://example.com/image.jpg)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchByUrl()}
                />
                <button className="btn-search-url" onClick={searchByUrl}>
                  🔍 Buscar
                </button>
              </div>
            </div>
          )}

          {error && <div className="error-banner">{error}</div>}

          {loading && (
            <div className="loading-section">
              <div className="loader"></div>
              <p>Analisando sua imagem... ⏳</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="results-section">
              <h2>📺 Resultados ({results.length})</h2>
              <div className="results-grid">
                {results.map((result, idx) => (
                  <div key={idx} className={`card result-card match-${result.similarity > 0.8 ? 'good' : 'low'}`}>
                    <div className="result-header">
                      <span className="result-rank">#{idx + 1}</span>
                      <span className={`result-sim ${result.similarity > 0.8 ? 'sim-good' : 'sim-low'}`}>
                        {(result.similarity * 100).toFixed(1)}%
                      </span>
                      {result.anilist?.isAdult && <span className="badge-adult">18+</span>}
                    </div>

                    <div className="result-media">
                      <img src={result.image} alt="Scene" className="result-img" loading="lazy" />
                    </div>

                    <div className="result-info">
                      <h3>{result.anilist?.title?.english || result.anilist?.title?.romaji || 'Desconhecido'}</h3>
                      {result.anilist?.title?.native && <div className="result-native">{result.anilist.title.native}</div>}
                      {result.anilist?.title?.romaji && <div className="result-romaji">{result.anilist.title.romaji}</div>}

                      <div className="result-details">
                        {result.episode && (
                          <div className="detail">
                            <span className="detail-label">Episódio</span>
                            <span className="detail-value">EP {result.episode}</span>
                          </div>
                        )}
                        {result.anilist?.episodes && (
                          <div className="detail">
                            <span className="detail-label">Total</span>
                            <span className="detail-value">{result.anilist.episodes} episódios</span>
                          </div>
                        )}
                        {result.from !== undefined && (
                          <div className="detail">
                            <span className="detail-label">Timestamp</span>
                            <span className="detail-value">
                              {Math.floor(result.from / 60)}:{String(Math.floor(result.from % 60)).padStart(2, '0')}
                            </span>
                          </div>
                        )}
                        {result.anilist?.season && (
                          <div className="detail">
                            <span className="detail-label">Temporada</span>
                            <span className="detail-value">{result.anilist.season} {result.anilist.seasonYear}</span>
                          </div>
                        )}
                      </div>

                      <div className="result-actions">
                        <button className="btn-preview" onClick={() => window.open(result.video, '_blank')}>
                          ▶️ Preview
                        </button>
                        {result.anilist?.id && (
                          <button className="btn-anilist" onClick={() => window.open(`https://anilist.co/anime/${result.anilist.id}`, '_blank')}>
                            📖 AniList
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Powered by Trace.moe API</p>
        <p className="footer-hint">Todos os direitos dos animes pertencem aos seus respectivos criadores e distribuidoras.</p>
      </footer>
    </div>
  )
}

export default App
