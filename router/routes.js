const {Router}= require('express'); 
const router= Router();    
const wjt= require('jsonwebtoken'); 

const userCtrl = require("../controller/userController");
const tagCtrl = require("../controller/tagController");
const taskCtrl = require("../controller/taskController");
const notificationCtrl = require("../controller/notificationController");
 
router.post('/login',userCtrl.loginUser); 
router.post('/register',userCtrl.registerUser);  
router.get('/profile',verifyToken, (req, res)=>{
    res.send(`${req.body.mail}`)
})
router.get('/user',userCtrl.getUserByMail);
router.put('/update/user',userCtrl.updateUser);
router.delete('/delete/user',userCtrl.deleteUser);

router.post('/create/task',taskCtrl.createTask);
router.get('/task',taskCtrl.getTasksByUserID);
router.put('/update/task',taskCtrl.updateTaskByID);
router.put('/update/order/task',taskCtrl.updateTaskOrderByTasksArray);
router.delete('/delete/task',taskCtrl.deleteTaskByID);
router.post('/assign/task/tag',taskCtrl.tagTaskByIDs);

router.post('/create/tag',tagCtrl.createTag);
router.get('/tags',tagCtrl.getTagByUser);
router.delete('/delete/tag',tagCtrl.deleteTagByName);

router.post('/create/notification',notificationCtrl.createNotification);
router.get('/notification',notificationCtrl.getNotificationsByUser);
router.put('/update/notification',notificationCtrl.updateNotificationByID);
router.delete('/delete/notification',notificationCtrl.deleteNotificationByID);

module.exports= router;   
 

function verifyToken(req, res, next) {

    // console.log(req.headers.authorization)
    if (!req.headers.authorization) {
       return  res.status(401).send('Request rejected'); 
    }
    //console.log(req.headers.authorization)
   
    const token= req.headers.authorization.split(' ')[1]; 
    if (token===null) {
        return  res.status(401).send('Request rejected');  
    }

    const payload= wjt.verify(token,'secretkey'); 
    //console.log(payload)

    req.body.mail= payload.mail; 
    next(); 
}
