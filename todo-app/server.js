const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let todos = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Build Todo App', completed: false }
]

let nextId = 3

app.get('/todos', (req, res) => {
  res.json(todos)
})

app.post('/todos', (req, res) => {
  const { title } = req.body
  const newTodo = { id: nextId++, title, completed: false }
  todos.push(newTodo)
  res.json(newTodo)
})

app.put('/todos/:id', (req, res) => {
  const { id } = req.params
  const { completed } = req.body
  const todo = todos.find(t => t.id === parseInt(id))
  if (todo) {
    todo.completed = completed
  }
  res.json(todo)
})

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params
  todos = todos.filter(t => t.id !== parseInt(id))
  res.json({ success: true })
})

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
