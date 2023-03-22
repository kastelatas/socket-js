const textarea = document.getElementById("textarea")

textarea.addEventListener("input", handleChange)

const ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`)

ws.onmessage = msg => textarea.value = msg.data

function handleChange() {
  ws.send(textarea.value)
}