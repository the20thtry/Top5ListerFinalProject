const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const { stringify } = require('querystring')

//copy pasted updateTop5List and changed some variables
updateUser = async (req, res) => {
    const body = req.body["0"]
    const likes=(req.body["1"])
    const author= (req.body['2'])
    const publishedDate = (req.body['3'])
    const views = (req.body['4'])
    const comments = (req.body['5'])

    //var keys = Object.keys(req);
    //console.log("req is: " + body +"\n keys: " + keys)
    console.log("User to be updated: " + JSON.stringify(body));
    if (!body) {
        console.log("body not found")
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
        console.log(body)
        user.items = body
        user.likes=likes
        user.author =author
        user.publishedDate =publishedDate
        user.views =views
        user.comments =comments

        user
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    user: user,
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

getAllUserTop5Lists =async (req, res) =>{
        await User.find({}, (err, top5Lists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5Lists.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Top 5 Lists not found` })
            }
            return res.status(200).json({ success: true, data: top5Lists })
        }).catch(err => console.log(err))
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
                _id: loggedInUser._id,
                likes:loggedInUser.likes, 
                author:loggedInUser.author,
                publishedDate:loggedInUser.publishedDate,
                views:loggedInUser.views,
                comments:loggedInUser.comments
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
                            errorMessage: "Invalid Email/Passwords?"
                        }).send()
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
                            items: existingUser.items,
                            _id: existingUser._id,
                            likes:existingUser.likes, 
                            author:existingUser.author,
                            publishedDate:existingUser.publishedDate,
                            views:existingUser.views,
                            comments:existingUser.comments
                        }
                    }).send();
                }
            }
        else {
            console.log("Invalid Email/Passwords")
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Invalid Email/Passwords"
                }).send()
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
    

}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify} = req.body;
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

        let items=[]
        let likes=[]
        let author= []
        let publishedDate=[]
        let views=[]
        let comments=[]
        const newUser = new User({
            firstName, lastName, email, passwordHash,items, likes, author, publishedDate,views,comments
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
                items: savedUser.items,
                likes:savedUser.likes, 
                author:savedUser.author,
                publishedDate:savedUser.publishedDate,
                views:savedUser.views,
                comments:savedUser.comments,
                _id: savedUser._id,
            }
        }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

getUserById = async (req, res) => {
    await User.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, user: list })
    }).catch(err => console.log(err))
}

module.exports = {
    getLoggedIn,
    registerUser,
    login,
    getLoggedOut,
    updateUser,
    getAllUserTop5Lists,
    getUserById
}