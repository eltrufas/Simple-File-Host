import express from 'express'
import multer from 'multer'
import shortid from 'shortid'
import path from 'path'
import fs from 'fs'

let tokens

let storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    let extension = path.extname(file.originalname)
    cb(null, shortid.generate() + extension)
  }
})

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000
  }
})

let app = express()
let router = express.Router()

router.use(express.static('static/'))
router.use(express.static('uploads/'))

function checkAuth(req, res, next) {
  if(tokens.has(req.query.token)) {
    return next()
  }

  res.status(403).end()
}

router.post('/', checkAuth, upload.single('file'), (req, res) => {
  if(!req.file) {
    return res.status(400).send({error: "No file uploaded"})
  }

  res.json({
    url: `${req.protocol}://${req.get('host')}${req.baseUrl}/${req.file.filename}`
  })
})

app.use("/404", (req, res) => {
  fs.readFile("./static/404.html", 'utf8', (err, data) => {
    if(err) throw Error("woah")

    res.send(data)
  })
})

app.use('/i', router)

app.use((req, res, next) => {
  res.redirect('/404')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({error: "woops!"})
})

fs.readFile('./tokens.json', 'utf8', (err, data) => {
  if(err) throw Error("wow")

  tokens = new Set(JSON.parse(data).tokens)

  app.listen(3000, () => {
    console.log("Listening on 3000")
  })
})
