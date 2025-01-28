import React, { useEffect, useState, createContext} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./app.css";
import AuthPage from "../AuthPage";
import CoinDetailsPage from "./CoinDetailsPage";

export const AuthContext = createContext();

const HomePage = () => {
  const [coins, setcoins] = useState([]);
  const [search, setserach] = useState("");
  const { IsAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/coins")
      .then((res) => setcoins(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filtercoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleCoinClick = (coinId) => {
   navigate(`/coin/${coinId}`);
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1 className="title">Cryptocurrency Price Tracker</h1>

      <input
        className="search"
        type="text"
        placeholder="Search for any cryptocurrency..."
        value={search}
        onChange={(e) => setserach(e.target.value)}
      />

      <div className="table-container">
        <table className="coin-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>24h High</th>
              <th>24h Low</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtercoins.map((coin) => (
              <tr key={coin.id} className="coin-row">
                <td>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="coin-image"
                  />
                </td>
                <td>
                  <span className="coin-name">{coin.name}</span>
                  <span className="coin-symbol">
                    ({coin.symbol.toUpperCase()})
                  </span>
                </td>
                <td> Rs.{coin.current_price} </td>
                <td
                  className={
                    coin.price_change_24h > 0 ? "positive" : "negative"
                  }
                >
                  {coin.price_change_24h}%
                </td>
                <td>${coin.high_24h}</td>
                <td>${coin.low_24h}</td>
                <td>
                  <button
                    className="watchlist-button"
                    onClick={() => handleCoinClick(coin.id)}
                  >
                    Check Livegraph
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BlankPage=()=>{
  return(
    <div>
      <h4>This is watchlist page</h4>
    </div>
  )
}

const App = () => {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ IsAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/coin/:id" element={<CoinDetailsPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};
export default App;
