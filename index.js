const express = require('express')
const marked = require('marked')
const fs = require('fs')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    fs.readFile('./markdown.md', 'utf-8', (err, journal) => {
        res.render('./pages/index', {
            journal: marked(journal)
        })
    })
})
app.use(express.static('client'));

app.listen(port, () => {
    console.log('server listening on ', port)
})