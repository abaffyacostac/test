// importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// setups
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://abaffyacostac:yAjh2GwjRXwgIDYK@cluster0.d0mojbq.mongodb.net/User?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start your Express server once connected to MongoDB
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const userSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: false },
});

const User = mongoose.model("User", userSchema);

const router = express.Router();

// Mount the router middleware at a specific path
app.use('/api', router);

router.route("/getusers")
    .get((req, res) => {
        try {
            User.find()
                .then((users) => {
                    if (users.length == 0) { res.json("no users found") } else { res.json(users) }
                })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/getuser/:id")
    .get((req, res) => {
        try {
            User.findById(req.params.id)
                .then((user) => { if (user == null) { res.json("no record found") } else { res.json(user) } })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route("/newuser")
    .post((req, res) => {

        try {
            if (req.body.email == null) {
                res.json("Please submit email")
            } else {
                const email = req.body.email;
                const username = req.body.username;
                
                // create a new User object 
                const newUser = new User({
                    email,
                    username
                });

                // save the new object (newUser)
                newUser
                    .save()
                    .then(() => res.json("User added!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        } catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/user/:id")
    .put((req, res) => {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    if (user == null) { res.json("no record found") }
                    else {
                        user.email = req.body.email;
                        user.username = req.body.username;

                        user
                            .save()
                            .then(() => res.json("User updated!"))
                            .catch((err) => res.status(400).json("Error: " + err));
                    }
                })
                .catch((err) => res.status(400).json("Error: " + err));
        } catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/user/:id")
    .delete((req, res) => {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    if (user == null) { res.json("no record found") }
                    else {
                        User.findByIdAndDelete(req.params.id)
                            .then(() => {                              
                                res.json("User deleted.")
                            })
                    }
                })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }

    });
 
    router.route("/getrandomuser")
    .get((req, res) => {
        try {
            User.find()
                .then((users) => {
                    if (users.length == 0) { 
                        res.json("no users found") 
                    } else { 
                        let randomIndex = Math.floor(Math.random() * users.length);
                        let randomUser = users[randomIndex];
                        res.json(randomUser) }
                })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

