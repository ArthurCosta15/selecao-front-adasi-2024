import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CryptoList = ({ cryptos }) => {
    const [favorites, setFavorites] = useState([]);

    // Carregar favoritos do localStorage quando o componente for montado
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    // Função para adicionar ou remover favoritos
    const toggleFavorite = (crypto) => {
        let updatedFavorites;

        // Verifica se a moeda já está nos favoritos
        if (favorites.some((fav) => fav.id === crypto.id)) {
            // Remove dos favoritos
            updatedFavorites = favorites.filter((fav) => fav.id !== crypto.id);
        } else {
            // Adiciona aos favoritos
            updatedFavorites = [...favorites, crypto];
        }

        // Atualiza o estado e localStorage
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="crypto-list">
            {cryptos.map((crypto) => (
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
                        <button className='button-details'>Ver Detalhes</button>
                    </Link>
                    <button
                        className={favorites.some((fav) => fav.id === crypto.id) ? 'button-remove' : 'button-add'}
                        onClick={() => toggleFavorite(crypto)}
                    >
                        {favorites.some((fav) => fav.id === crypto.id)
                            ? 'Remover dos Favoritos'
                            : 'Adicionar aos Favoritos'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CryptoList;
