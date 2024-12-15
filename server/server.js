const PORT = process.env.PORT ?? 8000;
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

//routes
const userRoute = require("./routes/User");
const productRoute = require("./routes/Product");
const authRoute = require("./routes/Auth");
const categoryRoute = require("./routes/Category");
const cartRoute = require("./routes/Cart");
const rateRoute = require("./routes/Rate");
const purchaseRoute = require("./routes/Purchase");
const checkoutRoute = require("./routes/Checkout");
const adminRoute = require("./routes/Manage");

app.use("/products", productRoute);
app.use("/", authRoute);
app.use("/categories", categoryRoute);
app.use("/cart", cartRoute);
app.use("/checkout", checkoutRoute);
app.use("/rate", rateRoute);
app.use("/purchase", purchaseRoute);
app.use("/manage", adminRoute);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
