import express from "express";
import bodyParser from "body-parser";
import nanobuffer from "nanobuffer";
import morgan from "morgan";

// set up a limited array
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

// feel free to take out, this just seeds the server with at least one message
function pushMsg(user, text) {
  msg.push({
    user,
    text,
    time: Date.now(),
  });
}

pushMsg("ismail", "hi ismail");

// get express ready to run
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("frontend"));

app.get("/poll", function (req, res) {
  const msgs = getMsgs();
  res.status(200).json({ res: msgs });
});

app.post("/poll", function (req, res) {
  const { user, text } = req.body;
  /* console.log(data); */
  // add a new message to the server
  pushMsg(user, text);
  res.status(201).json({ res: "done" });
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`listening on http://localhost:${port}`);
