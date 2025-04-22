import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Items laden beim Start
  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then(res => res.json())
      .then(data => setItems(data.items));
  }, []);

  // Neues Item an Backend senden
  const addItem = () => {
    if (!newItem.trim()) return;

    fetch(`${API_BASE}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem })
    })
      .then(res => res.json())
      .then(addedItem => {
        setItems([...items, addedItem]);
        setNewItem('');
      });
  };

  return (
    <div className="App">
      <h1>Meine Liste</h1>
      <input
        type="text"
        placeholder="Neues Item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={addItem}>Hinzufügen</button>

      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
