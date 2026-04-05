import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }
    
    setLoading(true)
    setError(null)
    setWeather(null)
    
    try {
      // Get coordinates
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`
      )
      const geoData = await geoResponse.json()
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found')
      }
      
      const { lat, lon, display_name } = geoData[0]
      
      // Get weather
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`
      )
      const weatherData = await weatherResponse.json()
      
      const weatherDescriptions = {
        0: 'Clear sky',
        1: 'Partly cloudy',
        2: 'Mostly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        61: 'Rain',
        80: 'Rain showers',
        95: 'Thunderstorm'
      }
      
      setWeather({
        city: display_name.split(',')[0],
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        wind: Math.round(weatherData.current.wind_speed_10m),
        description: weatherDescriptions[weatherData.current.weather_code] || 'Weather data available'
      })
    } catch (err) {
      setError(err.message || 'Error fetching weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          Weather App
        </h1>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter city name..."
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: '12px 25px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
        
        {error && (
          <div style={{
            padding: '15px',
            background: '#ffe6e6',
            color: '#d32f2f',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        {weather && (
          <div style={{
            padding: '25px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '28px' }}>
              {weather.city}
            </h2>
            
            <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>
              {weather.temp}°C
            </div>
            
            <p style={{ fontSize: '18px', margin: '10px 0' }}>
              {weather.description}
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div>
                <p style={{ margin: '0 0 5px 0', opacity: 0.9 }}>Humidity</p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                  {weather.humidity}%
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', opacity: 0.9 }}>Wind Speed</p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                  {weather.wind} km/h
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!weather && !error && (
          <div style={{
            textAlign: 'center',
            color: '#999',
            padding: '40px 20px'
          }}>
            <p style={{ margin: 0 }}>Enter a city name to get weather information</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App