import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (crypto) => {
        setFavorites((prev) => [...prev, crypto]);
    };

    const removeFavorite = (id) => {
        setFavorites((prev) => prev.filter(crypto => crypto.id !== id));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
