const Top5List = require('../models/publishedTop5List-model');

createTop5List = (req, res) => {
    const body = req.body;
    console.log("body is: " + body)
    console.log("creating new top5list, its body is: " + body)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({ success: false, error: err })
    }
    top5List
        .save() //something went wrong here
        .then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: 'Top 5 List Created!'
            })
        })
        .catch(error => {
            console.log("Top 5 list not created")
            return res.status(400).json({
                error,
                message: 'Top 5 List Not Created!'
            })
        })
}