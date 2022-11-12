const express = require('express');
const rootRoute = require("./route/rootRoute");
const app = express()
const port = 8080

app.use(express.json());
app.use(express.static('.'))
app.use("/api", rootRoute)

app.listen(port, () => {
  console.log(`server running on ${port}`)
})
