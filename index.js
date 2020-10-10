const express = require('express')
const marked = require('marked')
const fs = require('fs')
const glob = require('glob')
const config = require('./config')
const _ = require('lodash')

const app = express()

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    glob('**/*.md', { cwd: config.journalSrc }, (err, journals) => {
        res.render('pages/index', { journals: journals.map(journal => journal.replace('.md', '')) })
    })
})
app.get('/more', (req, res) => {
    res.render('pages/more')
})
app.get('/about', (req, res) => {
    res.render('pages/about')
})
app.get('/demo', (req, res) => {
    fs.readFile('./markdown.md', 'utf-8', (err, data) => {
        res.render('pages/journal', {
            journal: marked(data),
            title: 'markdown demo'
        })
    })
})

app.get('/*.html', (req, res) => {
    const path = decodeURI(req.path);
    const journalPath = `${config.journalSrc}/${path.replace('html', 'md')}`
    const title = _.last(path.split('/')).replace('.html', '')
    if (fs.existsSync(journalPath)) {
        fs.readFile(journalPath, 'utf-8', (err, data) => {
            res.render('pages/journal', { journal: marked(data), title: title })
        })
    } else {
        res.send('not exists')
    }
})
app.use(express.static('./client'))

app.listen(config.port, () => {
    console.log('server listening on ', config.port)
})
