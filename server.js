const express = require('express');
const connectDB = require('./config/db');
const productsRouter = require('./routers/product.router');
const categoriesRouter = require('./routers/categories.router');
const usersRouter = require('./routers/user.router');
require('dotenv').config();
const cors = require("cors");
const axios = require('axios');

// اتصال قاعدة البيانات
connectDB();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

// المسارات
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use("/api/users" , usersRouter);

  

// تشغيل الخادم
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
