const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt"); 
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

// register route
router.post("/register", validInfo, async(req, res) => {
    try {
        //1. structure the req.body
        const {name, email, password} = req.body;

        //2. check if user exists (if user exists then, throw an error)
        // he uses this $1 below, because he will use the variable it represents in the second argument
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        
        if(user.rows.length !== 0) {
            return res.status(401).send("User already exists")
        }

        //3. Bcrypt user password
        const saltRound = 10;
        const salt = await bcrypt.genSalt
        (saltRound);

        const bcryptPassword = await bcrypt.hash(
            password, salt
        );

        //4.enter new user inside the database
        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) " +  
            "VALUES ($1, $2, $3)" +
            "RETURNING *", [name, email, bcryptPassword]
        );

        // this line sends the of first row as the response
        // res.json(newUser.rows[0]); 
        
        //5. generating our jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error ${err.body}`);
        throw err
    }
})

router.post("/login", validInfo, async(req, res) => {
    try {
        // 1. destructure req.body
        const {email, password} = req.body;

        // 2. check if user doesn't exists (if not, then we throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email])

        if(user.rows.length === 0) {
            return res.status(401).json("Email not registered");
        }
        
        // 3.check if incoming password is the same as the db password
       const validPassword = await bcrypt.compare(password, user.rows[0].user_password)

       if(!validPassword) {
            return res.status(401).json("Email or password is incorrect");
       } 

        // 4. give them the jwt token
       const token = jwtGenerator(user.rows[0].user_id);
       res.json({token});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}) 

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
});

module.exports = router;