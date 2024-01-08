const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

tasksRouter.get('/', async (request, response) => {
  const tasks = await Task.find({}).populate('user', { username: 1, name: 1 })
  response.json(tasks)
})

tasksRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const task = new Task({
    content: body.content,
    deadline: body.deadline === undefined ? false : body.deadline,
    user: user.id
  })

  const savedTask = await task.save()
  user.tasks = user.tasks.concat(savedTask._id)
  await user.save()

  response.status(201).json(savedTask)
})

tasksRouter.get('/:id', async (request, response) => {
  const task = await Task.findById(request.params.id)
  if (task) {
    response.json(task)
  } else {
    response.status(404).end()
  }
})

tasksRouter.delete('/:id', async (request, response) => {
  await Task.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

tasksRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const task = {
    content: body.content,
    deadline: body.deadline,
  }

  await Task.findByIdAndUpdate(request.params.id, task, { new: true })
    .then(updatedTask => {
      response.json(updatedTask)
    })
    .catch(error => next(error))
})

module.exports = tasksRouter