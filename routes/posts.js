const express = require('express');
const router = express.Router();
const TodoModel = require('../models/todomodel');

router.route('/posts').post((req, res) => {
    const name = req.body.name;
    const todo = new TodoModel({name: name})
    todo.save()
        .then(() => res.json({
            message: "Created account successfully"
        }))
        .catch(err => res.status(400).json({
            "error": err,
            "message": "Error creating account"
        }))
});

router.route('/getposts').get((req, res) => {
    TodoModel.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            return res.json(data)
        }
    })
});

router.route('/delete/:id').delete((req, res) => {
    TodoModel.findByIdAndRemove({ _id: req.params.id })
        .then((task) => {
            res.send(task);
        })
});

router.route('/put/:id').put((req, res) => {
    TodoModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new:true })
        .then((task) => {
            res.send(task);
        })
})
module.exports = router 
