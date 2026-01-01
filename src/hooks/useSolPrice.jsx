import { useState, useEffect } from "react";

export const useSolPrice = (initialPrice) => {
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur",
        );
        const priceData = await response.json();
        if (priceData.solana && priceData.solana.eur) {
          setCurrentPrice(priceData.solana.eur);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching SOL price:", err);
        setError("Using cached price");
      } finally {
        setLoading(false);
      }
    };

    fetchSolPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchSolPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { currentPrice, loading, error };
};
