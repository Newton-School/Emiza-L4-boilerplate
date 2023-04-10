const users   = require("../models/user.js");
const tasks   = require("../models/task.js");
const bcrypt  = require('bcrypt');
const { valid } = require("joi");

const createTask =async (req, res) => {

    //creator_id is user id who have created this task.

    const { heading, description, creator_id  } = req.body;

    var newtask = {
        "heading":heading,
        "description":description,
        "creator_id": creator_id
    };

    tasks.create(newtask).then((task) => {

        users.updateOne(
            { _id: creator_id },
            { $push: { tasks: task._id } }
        ).then((user) => {});

        res.status(200).json({
            "message": 'Task added successfully',
            "task_id": task._id,
            "status": 'success'
        });
    })
    .catch((error) => {
        res.status(404).json({
            "status": 'fail',
            "message": error.message
        });
    });

}

const Taskdetail = async (req, res) => {

    const {task_id, user_id} = req.body;

    tasks.findById(task_id).then((task) => {
        res.status(200).json({
            "status": 'success',
            "data": task
        })
    }).catch((err)=> {
        res.status(404).json({
            "status": 'fail',
            "message": err.message
        })
    });

}

Taskupdate = async (req, res) => {
    
    const task_id = req.body.task_id;
    const des = req.body.description;

    const task = await tasks.findByIdAndUpdate(
        task_id,
        { $set:  req.body  }
    );
    
    const updatedtask = await tasks.findById(task_id);
    res.status(200).json({
        "status":"success",
        "data": updatedtask
    })

}

Taskdelete = async (req, res) => {

    const {task_id, user_id} = req.body;

    tasks.findByIdAndDelete(task_id).then(() => {

        users.update(
            { _id: user_id },
            { $pull: { tasks: task_id } }
        ).then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Task deleted successfully'
            });
        }).catch((err)=>{
            res.status(404).json({
                "status": 'fail',
                "message": err.message
            })
        });
    })
    .catch((err) => {
        res.status(404).json({
            "status": 'fail',
            "message": err.message
        })
    });

}

/*

req.body = {
    user_id: id
}

can be given status in query.
/ /api/v1/task/?status=pending
/ /api/v1/task/

if status is given filter only document contaning Status value as query status.

if user_id belongs to admin than show task of all user.
if user_id belongs to any other user than show task belong to that user only.

response:

200 status Code
json = {
        status:'success',
        data: [//contaning all task object].
    }

and sort the return data in opposite order of creation date.
the latest data will be at the top.

*/

alltask = async (req, res) => {

    //Write your code here.
}



module.exports = { createTask, Taskdetail, Taskupdate, Taskdelete, alltask };