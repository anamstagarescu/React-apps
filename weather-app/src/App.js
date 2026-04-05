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
    'Tokyo': { lat: 35.6762, lon: 139.6503 },
    'Berlin': { lat: 52.5200, lon: 13.4050 },
    'Madrid': { lat: 40.4168, lon: -3.7038 },
    'Rome': { lat: 41.9028, lon: 12.4964 }
  }

  const handleSearch = async () => {
    const coords = cities[city]
    if (!coords) {
      setError('City not found. Try: Bucuresti, Paris, London, New York, Tokyo, Berlin, Madrid, Rome')
      setWeather(null)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=celsius`
      )
      const data = await response.json()
      
      setWeather({
        city,
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        code: data.current.weather_code
      })
    } catch (err) {
      setError('Error fetching weather')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Weather App</h1>
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter city name"
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button 
          onClick={handleSearch}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Search
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {weather && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h2>{weather.city}</h2>
          <p><strong>Temperature:</strong> {weather.temp}°C</p>
          <p><strong>Humidity:</strong> {weather.humidity}%</p>
          <p><strong>Weather Code:</strong> {weather.code}</p>
        </div>
      )}
    </div>
  )
}

export default App