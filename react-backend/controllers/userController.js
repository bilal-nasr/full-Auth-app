const userDB = require("../database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send({ success: false, message: "please enter the correct info" })
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
        await userDB.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );
        res.send({ success: true, message: "Registered successfully!" });
    } catch (error) {
        console.error('Registration Error:', error.message);  // Log the actual error

        res
            .status(400)
            .send({ success: false, message: "Error registering user." });
    }
}

exports.signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await userDB.query("SELECT * FROM users WHERE username = ?", [
            username,
        ]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, SECRET_KEY);
            res.send({ success: true, token });
        } else {
            res.status(400).send({ success: false, message: "Invalid credentials." });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: "Error logging in." });
    }
}