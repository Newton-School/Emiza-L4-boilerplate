const tasks   = require("../models/task.js");

function isowner() {
    try {
        return function (req, res, next) {

            const {task_id, user_id} = req.body;
            console.log(task_id);

            tasks.findById(task_id).then((task)=> {

                if(String(task.creator_id) == user_id){
                    next();
                }
                else{
                    res.status(404).json({
                        'status': 'fail',
                        'message': 'Access Denied'
                    })
                }
            }).catch((err) => {
                res.status(403).json({
                    "status": 'fail',
                    'message': 'Given task doesnot exist'
                })
            });
            
        }
    } catch (err) {
        return res.status(400).json({
            'status': "error",
            'message': "Unable to check"
        })
    }
}

module.exports = { isowner };