import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Tooltip,
  Grid,
  Paper
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const API_BASE_URL = 'http://20.244.56.144';

const PREDEFINED_STOCKS = {
  "Advanced Micro Devices, Inc.": "AMD",
  "Alphabet Inc. Class A": "GOOGL",
  "Alphabet Inc. Class C": "GOOG",
  "Amazon.com, Inc.": "AMZN",
  "Amgen Inc.": "AMGN",
  "Apple Inc.": "AAPL",
  "Berkshire Hathaway Inc.": "BRKB",
  "Booking Holdings Inc.": "BKNG",
  "Broadcom Inc.": "AVGO",
  "CSX Corporation": "CSX",
  "Eli Lilly and Company": "LLY",
  "Marriott International, Inc.": "MAR",
  "Marvell Technology, Inc.": "MRVL",
  "Meta Platforms, Inc.": "META",
  "Microsoft Corporation": "MSFT",
  "Nvidia Corporation": "NVDA",
  "PayPal Holdings, Inc.": "PYPL",
  "TSMC": "2330TW",
  "Tesla, Inc.": "TSLA",
  "Visa Inc.": "V"
};

const StockChartPage = () => {
  const [selectedTicker, setSelectedTicker] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    if (!selectedTicker) return;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/evaluation-service/stocks/${selectedTicker}?minutes=${minutes}`)
      .then((res) => {
        setStockData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stock data:', err);
        setLoading(false);
      });
  }, [selectedTicker, minutes]);

  const chartData = {
    labels: stockData.map((d) => new Date(d.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Price',
        data: stockData.map((d) => d.price),
        borderColor: 'blue',
        fill: false
      },
      {
        label: 'Average',
        data: new Array(stockData.length).fill(
          stockData.reduce((acc, d) => acc + d.price, 0) / stockData.length
        ),
        borderColor: 'orange',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Stock Prices
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select a Stock
            </MenuItem>
            {Object.entries(PREDEFINED_STOCKS).map(([name, ticker]) => (
              <MenuItem key={ticker} value={ticker}>
                {name} ({ticker})
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            fullWidth
          >
            {[10, 30, 60, 120].map((min) => (
              <MenuItem key={min} value={min}>
                Last {min} minutes
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        stockData.length > 0 && (
          <Tooltip title="Hover for price details">
            <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
              <Line data={chartData} />
            </Paper>
          </Tooltip>
        )
      )}
    </Container>
  );
};

export default StockChartPage;
