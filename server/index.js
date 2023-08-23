const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { verifySignature } = require("./services");


app.use(cors());
app.use(express.json());

const balances = {
  "647f8fa5524f9ab77f17a0b267f5d55e431a07b8": 100,
  "98947524f5e15feecaaed0e7e3cb38963cd0c4db": 50,
  "be55401533fad24e38a508a44365c1d8ae59b13a": 75,
  // KEY_N: Any amount
};


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});
app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const msg = JSON.stringify({
    recipient,
    amount
  })
  let isValid = verifySignature(signature, msg, sender);
  if (isValid === false){
    res.status(400).send({ message: "Invalid Signature!" })
    return
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

