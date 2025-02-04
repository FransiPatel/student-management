const express = require("express");
const bodyParser=require('body-parser');
const adminRoutes = require('./routes/admin/adminRoute');
const userRoute = require('./routes/user/userRoute');

require("dotenv").config();
const { sequelize } = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/", userRoute);

// Sync Database and Start Server
const PORT = process.env.PORT || 3000;
sequelize
    .sync() // Sync models with database
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
