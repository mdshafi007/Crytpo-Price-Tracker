import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const CoinDetailsPage = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
            .then((res) => setCoin(res.data))
            .catch((err) => console.log(err));

        axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
            params: {
                vs_currency: 'inr',
                days: '7',
            }
        }).then((res) => setHistory(res.data.prices))
            .catch((err) => console.log(err));
    }, [id]);

    const graphData = {
        labels: history.map((item) => new Date(item[0]).toLocaleDateString()),
        datasets: [
            {
                label: 'Price',
                data: history.map((item) => item[1]),
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.3, 
            },
        ],
    };

    const graphOptions = {
        responsive: true,
        maintainAspectRatio: false,
        
        plugins: {
            legend: {
                position: "top",
                labels:{
                    color: "white",
                }
            },
            title: {
                display: true,
                text: `${coin ? coin.name : "Coin"} 7-Day Price Trend`,
                font: {
                    size: 18,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7,
                },
            },
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function (value) {
                        return "Rs." + value.toFixed(2);
                    },
                },
            },
        },
    };


    const containerStyle={
        width:'100vw',
        minHeight:'100vh',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        margin:'0',
        padding:'0',
        backgroundColor: '#000',
        color:'white',
        overflow:'hidden'
    };

    const contentStyle={
        width:'100%',
        maxWidth:'100vw',
        padding:'20px 0',
        textAlign:'center'
    }

    const graphContainerStyle={
        width:'100vh',
        height: '85vh',
        margin:'0',
        padding: '0',
        backgroundColor: 'rgba(0,0,0,0.5)',
    }

    return (
        <div className='coindetails' style={containerStyle}>
            {coin ? (
                <>
                    <h1 style={contentStyle}>{coin.name}</h1>
                    <p>Check the live graph of {coin.name}</p>
                    <h3 style={{ fontWeight: "bold" }}>Price: Rs.{coin.market_data.current_price.inr.toFixed(2)}</h3>

                    <div style={graphContainerStyle}>
                        <Line data={graphData} options={graphOptions} />
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CoinDetailsPage;
