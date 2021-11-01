const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

//copy pasted updateTop5List and changed some variables
updateUser = async (req, res) => {
    const body = req.body
    console.log("updateUser: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    User.findOne({ email: req.params.id }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        if (err) {
            console.log("USER NOT FOUND")
            return res.status(404).json({
                err,
                message: 'user not found!',
            })
        }
        user.items = body
        user
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'user info updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'user info not updated!',
                })
            })
    })
}


getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email,
                items: loggedInUser.items,
                _id: loggedInUser._id
            }
        })//.send() //I got rid of it and it got rid of some bugs but idk if this is smart
    })
}

getLoggedOut = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: false,
            user: {

            }
        })//.send() //I got rid of it and it got rid of some bugs but idk if this is smart
    })
}

login = async (req, res) => {
    try{
        const { email, password} = req.body;
        const existingUser = await User.findOne({ email: email });
        if(existingUser){
            correctPassword = await (bcrypt.compare(password,existingUser.passwordHash))
                if (!correctPassword) {
                    console.log("wrong password")
                    return res
                        .status(400)
                        .json({
                            success: false,
                            errorMessage: "Invalid Email/Passwords"
                        })
                }
                else{
                    const token = auth.signToken(existingUser);
                    await res.cookie("token", token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none"
                    }).status(200).json({
                        success: true,
                        user: {
                            firstName: existingUser.firstName,
                            lastName: existingUser.lastName,
                            email: existingUser.email,
                            items: existingUser.items
                        }
                    }).send();
                }
            }
        else {
            console.log("Invalid Email/Passwords")
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
    

}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify, items} = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash,items
        });
        const savedUser = await newUser.save();
        
        // LOGIN THE USER
        const token = auth.signToken(savedUser);
        

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                items: savedUser.items
            }
        }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    login,
    getLoggedOut,
    updateUser
}