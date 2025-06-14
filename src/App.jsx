import { useState, useCallback } from 'react';
import './App.css';


const debounce = (func, delay) => {
  let timer;
  return (args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, delay);
  };
};

function App() {
  const [prodotti, setProdotti] = useState([]);
  const [cerca, setCerca] = useState("");


  const fetchProducts = (searchTerm) => {
    if (!searchTerm.trim()) {
      setProdotti([]);
      return;
    }

    fetch(`http://localhost:3333/products?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setProdotti(data);
      })
      .catch((error) => {
        console.error("Errore durante la chiamata API:", error);
      });
  };


  const debouncedFetchProducts = useCallback(
    debounce(fetchProducts, 800),
    []
  );


  const cercaHandler = (event) => {
    const value = event.target.value;
    setCerca(value);
    debouncedFetchProducts(value);
  };

  return (
    <div>
      <input
        type="text"
        value={cerca}
        onChange={cercaHandler}
        placeholder="Cerca prodotti"
      />
      <ul>
        {prodotti.map((prodotto) => (
          <li key={prodotto.id}>{prodotto.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
