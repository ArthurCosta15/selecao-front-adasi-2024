import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    // Carrega os favoritos do localStorage
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    // Função para remover dos favoritos
    const removeFavorite = (cryptoId) => {
        const updatedFavorites = favorites.filter((crypto) => crypto.id !== cryptoId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Mensagem caso não haja favoritos
    if (favorites.length === 0) {
        return <p>Você não tem nenhuma criptomoeda nos favoritos.</p>;
    }

    return (
        <div className="favorites-list">
            <h2>Favoritos</h2>
            <div className="crypto-list">
                {favorites.map((crypto) => (
                    <div className="crypto-item" key={crypto.id}>
                        <h3>{crypto.name}</h3>
                        <p>Preço em Dólar: ${crypto.current_price}</p>
                        <p>
                            Variação (24h):{' '}
                            <span
                                className={
                                    crypto.price_change_percentage_24h > 0
                                        ? 'variation-positive'
                                        : 'variation-negative'
                                }
                            >
                                {crypto.price_change_percentage_24h !== undefined
                                    ? `${crypto.price_change_percentage_24h.toFixed(2)}%`
                                    : 'Dados não disponíveis'}
                            </span>
                        </p>
                        <Link to={`/coin/${crypto.id}`}>
                            <button className="button-details">Ver Detalhes</button>
                        </Link>
                        <button
                            className="button-remove"
                            onClick={() => removeFavorite(crypto.id)}>
                            Remover dos Favoritos
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
