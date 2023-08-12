const express = require('express');
const productsRoute = require('../routes/products.js')
const app = express();
//Middleware
const compression = require('compression');
const apicache = require('apicache');
const helmet = require('helmet');
const cors = require('cors');

const PORT = 3003;
const cache = apicache.middleware;

app.use(express.json());
app.use(cache('10 minutes'));
app.use(compression());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

app.use("/products", productsRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
