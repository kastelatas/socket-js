import { readFileSync } from "fs"
import { createServer } from "http"
import { WebSocketServer } from "ws"

const PORT = process.env.PORT || 8000
const wsConnections = []
const server = createServer(handleRequest)
const wss = new WebSocketServer({ noServer: true })

const html = readFileSync("./public/index.html", 'utf8')
const css = readFileSync("./public/style.css")
const ico = readFileSync("./public/favicon.ico")
const js = readFileSync("./public/script.js", 'utf8')

let text = ""

server.listen(PORT, () => console.log("http://localhost:" + PORT))

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    ws.onclose = () => wsConnections.splice(wsConnections.indexOf(ws), 1)
    ws.onmessage = msg => wsConnections.filter(wsc => wsc != ws).forEach(wsc => wsc.send(text = msg.data))
    wsConnections.push(ws)
  })
})

function handleRequest(req, res) {
  if (req.url == "/" || req.url == "/index.html") {
    if (req.method == "POST") {
      getBody(req)
      res.end("")
    }
    else {
      const i = html.indexOf(`</textarea>`)
      const htmlWithText = html.slice(0, i) + text + html.slice(i)
      res.end(htmlWithText)
    }
  }

  else if (req.url == "/style.css") {
    res.end(css)
  }
  else if (req.url == "/favicon.ico") {
    res.end(ico)
  }
  else if (req.url == "/script.js") {
    res.end(js)
  }
  else {
    res.end("error")
  }

}

function getBody(stream) {
  const chunks = []
  stream.addListener("data", chunk => chunks.push(chunk))
  stream.addListener("end", () => text = Buffer.concat(chunks).toString())
}