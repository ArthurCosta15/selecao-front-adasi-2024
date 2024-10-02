import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';

// Registrar os elementos e escalas do Chart.js
Chart.register(...registerables);

const CryptoDetail = () => {
    const { id } = useParams();
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [cryptoName, setCryptoName] = useState('');

    useEffect(() => {
        const fetchPriceData = async () => {
            try {
                // Obter dados de preços e informações da criptomoeda
                const priceResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`);
                const infoResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);

                const prices = priceResponse.data.prices;

                // Processar os dados para o gráfico
                const labels = prices.map((price) => new Date(price[0]).toLocaleDateString());
                const data = prices.map((price) => price[1]);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Preço em USD',
                            data: data,
                            fill: false,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                        },
                    ],
                });

                setCryptoName(infoResponse.data.name);
            } catch (error) {
                console.error('Erro ao buscar dados de preços', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPriceData();
    }, [id]);

    if (loading) {
        return <div>Carregando dados...</div>;
    }

    return (
        <div>
            <h2>Detalhes da Criptomoeda: {cryptoName}</h2>
            <Line data={chartData} options={{ responsive: true }} />
        </div>
    );
};

export default CryptoDetail;
