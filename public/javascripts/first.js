const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close=document.getElementById('close');


if (bar) {
    bar.addEventListener("click",() =>{
            nav.classList.add('active');
        })
}

if(close){
    close.addEventListener('click',()=>{
        nav.classList.remove('active');

    })
}
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  const socket = new WebSocket('ws://localhost:2000');

  socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log(data);
      displayMessage(data.message); 
  };

 
  function sendMessage() {
   
    const messageInput = document.getElementById('messageInput');
    // console.log('Message Input Element:', messageInput); // Log the input element
    // console.log('Message Input Value:', messageInput.value); // Log the input value
    socket.send(messageInput.value); // Send the input value
  }

  function displayMessage(message) {
      const messagesDiv = document.getElementById('messages');
      messagesDiv.innerHTML += `<p>${message}</p>`;
  }



