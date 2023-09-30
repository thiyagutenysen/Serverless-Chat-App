const ngrok = require("ngrok")
const axios = require("axios")
const express = require("express")

// things to do
// 1. cursor on send bar - done
// 2. enter to send - done
// 3. move scrollbar down as you message - done
// 4. socket.io - get ip automatically - done
// 5. connect client and server - done
// 6. send and recieve message - done

function get_address() {
    friend_address = address_input_bar.value
    console.log(friend_address)
}

function scroll() {
    var last_msg = document.getElementById("message_body")
    last_msg = last_msg.children
    var last_message = last_msg[last_msg.length - 1]
    last_message.scrollIntoView({ behavior: 'smooth' })
}

function render_message(message, user) {
    if (message != "") {
        if (user == "You") {
            message_body.innerHTML += `
                <div class="row">
                    <div class="col">
                    </div>
                    <div class="col">
                        <div class="card my-1">
                            <div class="card-body">${message}</div>
                        </div>
                    </div>
                </div>
            `
        }
        else {
            message_body.innerHTML += `
                <div class="row">
                    <div class="col">
                        <div class="card my-1">
                            <div class="card-body">${message}</div>
                        </div>
                    </div>
                    <div class="col">
                    </div>
                </div>
            `
        }
        scroll()
    }
}

function send_message(event) {
    var text = msg_input_bar.value
    console.log(text)
    var message = { text: text }
    console.log(friend_address)
    axios.post(friend_address, message)
        .then(function (response) {
            console.log(response.status)
        })
        .catch(function (error) {
            console.log(error)
        })
    render_message(text, "You")
    document.getElementById("chat_input").value = ""
}

var msg_input_bar = document.getElementById("chat_input")
var message_body = document.getElementById("message_body")
var address_input_bar = document.getElementById("ip_addr")
var connect_btn = document.getElementById("connect_button")
var server_public_address_display = document.getElementById("server_public_address_display")
var friend_address
const port = 5000

connect_btn.addEventListener("click", get_address)

const server = express()
server.use(express.json())
server.post('/', (req, res) => {
    const message = req.body.text;
    console.log('Received message:', message, req.body);
    render_message(message, "Friend")
    res.send('Message received successfully');
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

(async function () {
    const public_url = await ngrok.connect(port);
    server_public_address_display.textContent = public_url
    console.log(public_url)
})();

msg_input_bar.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        console.log(event.timeStamp)
        send_message(event)
    }
})