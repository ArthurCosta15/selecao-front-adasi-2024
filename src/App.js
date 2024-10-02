import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import Favorites from './components/Favorites';
import CryptoDetail from './components/CryptoDetail';
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);
    document.body.classList.toggle('dark-mode', savedTheme);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      document.body.classList.toggle('dark-mode', newMode);
      return newMode;
    });
  };

  // Função para buscar criptomoedas
  const fetchCryptos = async () => {
    const cachedData = localStorage.getItem('cryptos');
    const cachedTime = localStorage.getItem('cryptosCacheTime');
    const currentTime = new Date().getTime();

    if (cachedData && cachedTime && currentTime - cachedTime < 300000) {
      setCryptos(JSON.parse(cachedData));
      setError(null);
    } else {
      setLoading(true);
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        setCryptos(response.data);
        localStorage.setItem('cryptos', JSON.stringify(response.data));
        localStorage.setItem('cryptosCacheTime', currentTime);
        setError(null);
      } catch (error) {
        setError('Erro ao buscar criptomoedas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  // Manipuladores de eventos
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const retryFetchCryptos = () => {
    setError(null);
    fetchCryptos();
  };

  // Filtrar e ordenar as criptomoedas
  const filteredCryptos = useMemo(() => {
    return cryptos
      .filter((crypto) => {
        const matchesSearch = crypto.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
          filter === 'positive' ? crypto.price_change_percentage_24h > 0 :
            filter === 'negative' ? crypto.price_change_percentage_24h < 0 :
              true;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (filter) {
          case 'price': return b.current_price - a.current_price;
          case 'market_cap': return b.market_cap - a.market_cap;
          case 'percentage_change': return b.price_change_percentage_24h - a.price_change_percentage_24h;
          default: return 0;
        }
      });
  }, [cryptos, searchTerm, filter]);

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/favorites">Favoritos</Link>
        <button className='toggle-button' onClick={toggleDarkMode}>
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </nav>

      <div className="container">
        {/* Exibir filtros apenas na página principal */}
        <Routes>
          <Route path="/" element={
            <>
              <div className="filtros">
                <input
                  type="text"
                  placeholder="Buscar criptomoedas"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
                <select onChange={handleFilterChange} value={filter} className="filter-select">
                  <option value="">Todas</option>
                  <option value="positive">Positivas (Subiram)</option>
                  <option value="negative">Negativas (Caíram)</option>
                  <option value="price">Maior Preço</option>
                  <option value="market_cap">Maior Capitalização de Mercado</option>
                  <option value="percentage_change">Maior Variação Percentual (24h)</option>
                </select>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  Carregando criptomoedas...
                </div>
              ) : error ? (
                <div className="error" style={{ color: 'red' }}>
                  {error}
                  <button onClick={retryFetchCryptos} className="retry-button">Tentar Novamente</button>
                </div>
              ) : (
                <CryptoList cryptos={filteredCryptos} />
              )}
            </>
          } />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/coin/:id" element={<CryptoDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
