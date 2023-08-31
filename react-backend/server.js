const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const quizRoutes = require("./routes/quizRoutes")
const userRoutes = require("./routes/userRoutes")

dotenv.config() //to be able to use .env file

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/quiz",quizRoutes);
app.use("/api/user",userRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`server running at port: ${process.env.PORT} `)
})