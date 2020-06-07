const path = require('path')
const express = require('express')
const { spawn } = require('child_process')

const PORT = 6006

const app = express()
app.use(express.static('dist_storybook'))

const server = app.listen(PORT, onListen)

function onListen() {
  console.log(`Start Express: serve "./dist_storybook" on port ${PORT}`)

  const child = spawn('yarn', ['test:pupp'])
  child.stdout.on('data', data => console.log(data.toString()))
  child.stderr.on('data', data => console.error(data.toString()))
  child.on('close', code => {
    if (code !== 0) {
      console.error('completed: failed test: ', code)
      process.exit(1)
    }

    console.log('completed: success test: ', code)
    process.exit(0)
  })
}
