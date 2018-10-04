const express = require('express')

const app = express()
app.get('/', (req, res) => {
	res.redirect('/timeline')
})
app.use('/timeline', express.static('./build'))
app.listen(3000, () => console.log(`Listening on port 3000.`))