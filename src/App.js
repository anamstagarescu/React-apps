import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // City coordinates
  const cities = {
    'Bucuresti': { lat: 44.4268, lon: 26.1025 },
    'Paris': { lat: 48.8566, lon: 2.3522 },
    'London': { lat: 51.5074, lon: -0.1278 },
    'New York': { lat: 40.7128, lon: -74.0060 },
    'Tokyo': { lat: 35.6762, lon: 139.6503 }
  }

  const handleSearch = async () => {
    const coords = cities[city]
    if (!coords) {
      setError('City not found')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m&temperature_unit=celsius`
      )
      const data = await response.json()
      
      setWeather({
        city,
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m
      })
    } catch (err) {
      setError('Error fetching weather')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Weather App</h1>
      <div>
        <input 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Try: Bucuresti, Paris, London, New York, Tokyo"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {weather && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>{weather.city}</h2>
          <p><strong>Temperature:</strong> {weather.temp}°C</p>
          <p><strong>Humidity:</strong> {weather.humidity}%</p>
        </div>
      )}
    </div>
  )
}

export default App