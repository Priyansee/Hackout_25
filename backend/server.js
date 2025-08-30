const express = require("express");
const {Web3} = require("web3");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());

const web3 = new Web3("http://127.0.0.1:8545");

const contractABI = JSON.parse(fs.readFileSync("../green-hydrogen/build/contracts/GreenHydrogenCredits.json")).abi;
const contractAddress = "0xd38ACD77BA4D33F6487DAB6B40Cc20CA78d4beC5";

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.get("/balance/:address", async (req, res) => {
  try {
    let count = 0;
    const total = await contract.methods.creditCount().call();

    for (let i = 1; i <= total; i++) {
      const credit = await contract.methods.credits(i).call();
      if (credit.owner.toLowerCase() === req.params.address.toLowerCase() && !credit.retired) {
        count++;
      }
    }

    res.json({ address: req.params.address, balance: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/issue", async (req, res) => {
  try {
    const { to, amount } = req.body;
    const accounts = await web3.eth.getAccounts();

    for (let i = 0; i < amount; i++) {
      await contract.methods.issueCredits(to, amount).send({ from: accounts[0] });
    }

    res.json({ success: true, to, amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));