const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  Array.from(chat.elements).forEach((elem) => {
    elem.value = "";
  });
});

async function postNewMsg(user, text) {
  // post to /poll a new message
  try {
    await fetch("http://localhost:3000/poll", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, text }),
    });
  } catch (e) {
    console.error("polling error :", e);
  }
}

async function getNewMsgs() {
  // poll the server
  let data;
  try {
    const res = await fetch("http://localhost:3000/poll");
    data = await res.json();
  } catch (e) {
    console.error("polling error :", e);
  }
  allChat = data.res;
  render();
  setTimeout(getNewMsgs, INTERVAL);
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// make the first request
getNewMsgs();
