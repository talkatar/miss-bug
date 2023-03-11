
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3030

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => res.send('Hello!'))



app.get('/api/bug', (req, res) => {
    console.log(req.query);
  
    const sortBy = {
        by:  'title',
        desc: +req.query.desc || 1
    }

  

    const filterby = {
        title: req.query.title || '',
        page: +req.query.page || 0,
        createdAt: req.query.createdAt || 1,
        severity: req.query.severity || 1,
        labels: req.query.labels || null
    }


    bugService.query(filterby, sortBy)
    .then(bugs => {
        res.send(bugs)
    })
    .catch((err) => {
        console.log('Error:', err)
        res.status(400).send('Cannot load bugs')
    })
})


app.put('/api/bug/:bugId', (req, res) => {
    const { _id, title,description,severity } = req.body
    const bug = { _id, title,description,severity }

    // const bug = {
    //     _id: req.query._id || null,
    //     title : req.query.title,
    //     description : req.query.description,
    //     severity :req.query.severity,
    // }

    bugService.save(bug,loggedinUser)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Cannot save bug, Error:', err)
            res.status(400).send('Cannot save bug')
        })
})

app.post('/api/bug/', (req, res) => {
    console.log('save');

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const {  title,description,severity } = req.body
    const bug = {  title,description,severity }
    // const bug = {
    //     _id: req.query._id || null,
    //     title : req.query.title,
    //     description : req.query.description,
    //     severity :req.query.severity,
    // }
    bugService.save(bug,loggedinUser)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Cannot save bug, Error:', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
  
    const visitedBugs = req.cookies.visitedBugs ||[]
    if ( !visitedBugs.includes(bugId)) visitedBugs.push(bugId);
    if (visitedBugs.length > 3) return res.status(401).send('Wait for a bit')
      res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
      console.log('User visited the following bugs:', visitedBugs)

    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load bug')
        })
})


app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove bug')
        })
})



app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    console.log(credentials);
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    console.log(req);
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})


app.get('/api/user', (req, res) => {
  
    userService.query()
    .then(users => {
        res.send(users)
    })
    .catch((err) => {
        console.log('Error:', err)
        res.status(400).send('Cannot load users')
    })
})





app.post('/api/user', (req, res) => {
    const { username, fullname, password } = req.body
    const user = { username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    console.log('werwer');
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove user')
    const { userId } = req.params
    userService.remove(userId,loggedinUser)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove user')
        })
})

app.listen(port, () => console.log('Server ready at port 3030!'))
