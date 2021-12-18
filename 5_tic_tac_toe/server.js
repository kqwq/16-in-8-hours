import { readLines } from "https://deno.land/std@0.76.0/io/bufio.ts";
(async() => {
    for await (let msg of readLines(Deno.stdin)) onInput( ...msg.split(/ (.+)/s) );
})();

// Send command to server
function sendCommand(commandName, data) {
  if (!data) console.log("!" + commandName)
  else console.log("!" + commandName + " " + JSON.stringify(data))
}

// Send message
function sendTo(recipient, data) {
  console.log("!send " + recipient + " " + JSON.stringify(data));
}


function onInput(sender, message) {
    console.log(sender, message)
    if (sender === "server") {
        let data = JSON.parse(message);
        switch (data.command) {
            case "player-join":
                sendCommand("room")
                break;
            case "room":
                setTimeout(() => sendTo("everyone", data.response), 1000)
                break;
        }
    } else {
        sendTo("everyone", JSON.parse(message))
    }
}

console.log("Server started")