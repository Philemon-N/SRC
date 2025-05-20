const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/ussd", (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;
  const inputs = text.split("*");
  let response = "";

  if (text === "") {
    response = `CON Welcome to TastyBites Restaurant
1. View Menu
2. Place Order
3. My Orders
4. Contact Us`;
  }
  // View Menu
  else if (text === "1") {
    response = `END Today's Menu:
1. Chicken Burger - $5
2. Beef Pizza - $7
3. Veggie Wrap - $4`;
  }
  // Place Order - Step 1: Choose item
  else if (text === "2") {
    response = `CON Choose item to order:
1. Chicken Burger
2. Beef Pizza
3. Veggie Wrap`;
  }
  // Place Order - Step 2: Enter quantity
  else if (inputs.length === 2 && inputs[0] === "2") {
    response = `CON Enter quantity:`;
  }
  // Place Order - Step 3: Confirm
  else if (inputs.length === 3 && inputs[0] === "2") {
    const item =
      inputs[1] === "1"
        ? "Chicken Burger"
        : inputs[1] === "2"
        ? "Beef Pizza"
        : inputs[1] === "3"
        ? "Veggie Wrap"
        : "Unknown";
    const qty = inputs[2];
    response = `CON Confirm order: ${qty} x ${item}
1. Confirm
2. Cancel`;
  }
  // Order Confirmed
  else if (inputs.length === 4 && inputs[0] === "2" && inputs[3] === "1") {
    response = `END Order placed! We'll deliver soon.`;
  }
  // Order Cancelled
  else if (inputs.length === 4 && inputs[0] === "2" && inputs[3] === "2") {
    response = `END Order cancelled.`;
  }
  // My Orders
  else if (text === "3") {
    response = `END You have 1 order in progress. Check SMS for details.`;
  }
  // Contact Us
  else if (text === "4") {
    response = `END Call us on 9876 or visit tastybites.com`;
  } else {
    response = `END Invalid option`;
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

app.listen(3000, () => {
  console.log("TastyBites USSD server running on http://localhost:3000/ussd");
});
