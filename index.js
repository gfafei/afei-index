const express = require('express')
const marked = require('marked')
const fs = require('fs')
const glob = require('glob')
const config = require('./config')

const app = express()

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    glob('**/*.md', { cwd: config.journalSrc }, (err, journals) => {
        res.render('pages/index', { journals: journals.map(journal => journal.replace('.md', '')) })
    })
})
app.get('/*.html', (req, res) => {
    const path = req.path;
    const file = path.replace('html', 'md')
    const journalPath = `${config.journalSrc}/${file}`
    if (fs.existsSync(journalPath)) {
        fs.readFile(journalPath, 'utf-8', (err, data) => {
            console.log(data);
            res.render('pages/journal', { journal: marked(data) })
        })
    } else {
        res.send('not exists')
    }
})
app.use(express.static('./client'))

app.listen(config.port, () => {
    console.log('server listening on ', config.port)
})