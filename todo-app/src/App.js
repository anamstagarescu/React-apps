import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [minimized, setMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchTodos()
    const savedInput = localStorage.getItem('todoInput')
    if (savedInput) setInput(savedInput)
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

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    localStorage.setItem('todoInput', value)
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
      localStorage.removeItem('todoInput')
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

  const handleMouseDown = (e) => {
    setDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }

    const handleMouseUp = () => {
      setDragging(false)
    }

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, dragOffset])

  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  // Minimized floating widget
  if (minimized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          zIndex: 9999,
          cursor: dragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMinimized(false)
          }}
          style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: '0 8px 25px rgba(0, 153, 255, 0.5)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 12px 35px rgba(0, 153, 255, 0.7)'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 8px 25px rgba(0, 153, 255, 0.5)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          📋 {totalCount} tasks
        </button>
      </div>
    )
  }

  // Full app
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        maxWidth: '700px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Minimize Button */}
        <button
          onClick={() => setMinimized(true)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '8px 12px',
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'all 0.2s',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e0e0e0'
            e.target.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#f0f0f0'
            e.target.style.transform = 'scale(1)'
          }}
          title="Minimize"
        >
          −
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: '#1e3c72', 
            margin: '0 0 20px 0',
            fontSize: '36px',
            fontWeight: '700'
          }}>
            ✓ My Tasks
          </h1>
          {totalCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '150px',
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00d4ff 0%, #0099ff 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>
                {completedCount}/{totalCount}
              </span>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px'
        }}>
          <input
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              padding: '14px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0099ff'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <button
            onClick={addTodo}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 5px 15px rgba(0, 153, 255, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            + Add
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {loading && (
          <p style={{ textAlign: 'center', color: '#999' }}>Loading...</p>
        )}

        <div>
          {todos.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#999', 
              padding: '60px 20px'
            }}>
              <p style={{ fontSize: '18px', margin: 0 }}>
                📝 No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div>
              {todos.map((todo, index) => (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: index === todos.length - 1 ? 'none' : '1px solid #f0f0f0',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    style={{ 
                      cursor: 'pointer', 
                      width: '24px', 
                      height: '24px',
                      accentColor: '#0099ff'
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#bbb' : '#333',
                      fontSize: '16px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#ff5252'
                      e.target.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#ff6b6b'
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App