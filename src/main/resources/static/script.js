console.log("Hello, this is the chat room!");

let username = document.getElementById('name');
let connectBtn = document.getElementById('connect-btn');
let card1 = document.querySelector('.card1');
let card2 = document.querySelector('.card2');
let msgTable = document.getElementById('msgTable');
let sendBtn = document.getElementById('send-btn');
let disconnectBtn = document.getElementById('disconnect-btn');
let card2WelcomeMsg = document.getElementById('card2WelcomeMsg');
let stompClient = null;

function connect() {
    let socket = new SockJS("/server1");
    stompClient = Stomp.over(socket)
    stompClient.connect({}, () => {
        card1.style.display = 'none';
        card2.style.display = 'block';
        card2WelcomeMsg.innerHTML = 'Welcome ' + localStorage.getItem('username');
        stompClient.subscribe('/topic/return-to', (response) => {
            showMessage(JSON.parse(response.body));
        });
    })
}

function showMessage(message) {
    let prependHTML = `<tr><td><b>${message.sender}: </b>${message.content}</td></tr>`;
    msgTable.innerHTML = prependHTML + msgTable.innerHTML;
}

connectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    username = username.value;
    localStorage.setItem('username', username);
    connect();
});

function sendMessage() {
    let message = document.getElementById('message').value;
    let jsonOb = {
        sender: localStorage.getItem('username'),
        content: message
    };
    stompClient.send('/app/message', {}, JSON.stringify(jsonOb));
}
sendBtn.addEventListener('click', () => {
    sendMessage();
});

disconnectBtn.addEventListener('click', () => {
   if(stompClient != null) {
       localStorage.removeItem('username');
       stompClient.disconnect();
       card1.style.display = 'block';
       card2.style.display = 'none';
   }
});

