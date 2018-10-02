const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const fse = require('fs-extra')
const path = require('path')
const rp = require('request-promise')
const cors = require('cors')
const app = express()
fse.readJson(path.resolve(__dirname, 'save.json')).catch(_=>{
  return fse.writeJson(path.resolve(__dirname, 'save.json'), {
    vote: {},
    criterions: [{
      "id": "melody",
      "name": "Mélodique"
    }, {
      "id": "original",
      "name": "Original"
    }, {
      "id": "nul",
      "name": "Nul à chier"
    }, {
      "id": "top",
      "name": "Top moumoutte"
    }, {
      "id": "discovery",
      "name": "Découverte"
    }]
  })
})
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
const redirect_uri = 'http://localhost:3000/callback'
let code;
app.use(cors())
app.get('/', function (req, res) {
  if (!code) return res.redirect('/login')
  me()
  res.render('index.html')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
app.get('/trackdata', async function (req, res) {
  const json = await fse.readJson(path.resolve(__dirname, 'save.json'))
  res.json(json)
})

app.post('/vote', async function (req, res) {
  const json = await fse.readJson(path.resolve(__dirname, 'save.json'))
  if (!json.vote) json.vote = {}
  if (!json.vote[req.body.playlist]) json.vote[req.body.playlist] = {}
  if (!json.vote[req.body.playlist][req.body.id]) json.vote[req.body.playlist][req.body.id] = {}
  if (!json.vote[req.body.playlist][req.body.id][req.body.criterion]) json.vote[req.body.playlist][req.body.id][req.body.criterion] = []
  if (!json.vote[req.body.playlist][req.body.id][req.body.criterion].includes(req.body.user)) json.vote[req.body.playlist][req.body.id][req.body.criterion].push(req.body.user)
  else json.vote[req.body.playlist][req.body.id][req.body.criterion].splice(json.vote[req.body.playlist][req.body.id][req.body.criterion].indexOf(req.body.user), 1)
  await fse.writeJson(path.resolve(__dirname, 'save.json'), json, 'utf-8')
  res.json(json)

})
app.post('/addCriterion', async function (req, res) {
  const json = await fse.readJson(path.resolve(__dirname, 'save.json'))
  if (!json.criterions.filter(_crit => _crit.id === req.body.criterion.split(' ').join()).pop())
    json.criterions.push({
      id: req.body.criterion.split(' ').join(),
      name: req.body.criterion
    })
  await fse.writeJson(path.resolve(__dirname, 'save.json'), json, 'utf-8')
  res.json(json)
})
app.get('/callback', async function (req, res) {
  code = req.query.code
  const apiKey = await rp.post('https://accounts.spotify.com/api/token', {
    form: {
      client_id: '4aae8424d4b94244ad591495532d96ca',
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/callback"
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer("4aae8424d4b94244ad591495532d96ca" + ':' + process.env.SPOT_SECRET).toString('base64'))
    },
    json: true
  })
  res.send(`
  <script>
    window.opener.postMessage("${apiKey.access_token}", 'http://localhost:3000')
    window.close()
  </script>
  `)
})
app.get('/login', function (req, res) {
  var scopes = 'user-read-private, playlist-read-private, playlist-modify-public, playlist-modify-private, playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=4aae8424d4b94244ad591495532d96ca' +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});


async function me() {
  const me = await rp.get('https://api.spotify.com/v1/me')
  console.log(me)
}