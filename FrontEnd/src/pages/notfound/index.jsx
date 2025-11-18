import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './index.scss' // Mude para .scss

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="not-found-container">
      <Header />
      
      <div className="not-found-content">
        <div className="not-found-animation">
          <div className="ghost">
            <div className="ghost-body">
              <div className="face">
                <div className="eye left"></div>
                <div className="eye right"></div>
                <div className="mouth"></div>
              </div>
            </div>
            <div className="shadow"></div>
          </div>
        </div>

        <div className="not-found-text">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Página não encontrada</h2>
          <p className="error-description">
            Oops! A página que você está procurando foi removida, renomeada 
            ou está temporariamente indisponível.
          </p>
          
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleGoBack}>
              ← Voltar
            </button>
            <button className="btn btn-secondary" onClick={handleGoHome}>
              Página Inicial
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NotFound