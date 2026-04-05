import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!city) {
      setError('Enter a city name')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Step 1: Get coordinates from city name
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`
      )
      const geoData = await geoResponse.json()
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found')
      }
      
      const { lat, lon, display_name } = geoData[0]
      
      // Step 2: Get weather
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&temperature_unit=celsius`
      )
      const weatherData = await weatherResponse.json()
      
      setWeather({
        city: display_name.split(',')[0],
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m
      })
    } catch (err) {
      setError(err.message || 'Error fetching data')
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
          placeholder="Enter any city name"
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
        </div>
      )}
    </div>
  )
}

export default App