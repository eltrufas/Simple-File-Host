var form = document.forms.namedItem('uploadform')
var input = document.getElementById("filefield")
var token = document.getElementById("tokenfield")
var label = input.nextElementSibling;

input.addEventListener('change', (e) => {
  if(!input.files.length) {
    label.innerHTML = "No file specified"
    return;
  }

  if(!token.value.length) {
    label.innerHTML = "No token specified"
    return
  }

  label.innerHTML = "Uploading..."

  var req = new XMLHttpRequest()
  req.responseType = 'json'

  req.upload.addEventListener("progress", (ev) => {
    label.innerHTML = 'Uploading... ' + Math.round(ev.loaded * 100 / ev.total)
  })

  req.addEventListener("load", (ev) => {
    console.log("huh")
    console.log(req)
    if(req.status == 200) {
      var json = req.response
      result.style.display = "block"
      label.innerHTML = "Uploaded!"
      console.log('<b>Url:</b> <a href="' + json.url + '>' + json.url +'</a>')
      result.innerHTML = ('<b>Url:</b> <a href="' + json.url + '">' + json.url +'</a>')
    } else {
      console.log("pls")
      label.innerHTML = "Error uploading!"
    }
  })


  req.addEventListener("error", (ev) => {
    label.innerHTML = "Error uploading!"
  })

  req.open('post', '.?token=' + token.value, true)
  req.send(new FormData(form))

  e.preventDefault()
})

var result = document.getElementById("result")
result.style.display = "none"
