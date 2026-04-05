import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/todos')
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError('Error fetching todos')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!input.trim()) return

    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input })
      })
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setInput('')
    } catch (err) {
      setError('Error adding todo')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, { method: 'DELETE' })
      setTodos(todos.filter(t => t.id !== id))
    } catch (err) {
      setError('Error deleting todo')
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id)
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      })
      const updated = await response.json()
      setTodos(todos.map(t => t.id === id ? updated : t))
    } catch (err) {
      setError('Error updating todo')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Todo App</h1>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={addTodo}
            style={{
              padding: '12px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Add
          </button>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

        <div>
          {todos.map(todo => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #eee',
                gap: '10px'
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#999' : '#333'
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: '5px 10px',
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App