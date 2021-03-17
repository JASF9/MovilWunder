const pool = require("../models/database")

exports.createNotification = async (req,res) => {
    try{
        const message = req.body.message;
        const date = req.body.date;
        const time = req.body.time;
        const sent = false;
        const id_task = req.body.id_task
        const result = await pool.query(`INSERT INTO notification (message,date,time,sent,id_task) 
        VALUES (${message},${date},${time},${sent},${id_task}) RETURNING *`);
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.getNotificationsByUser = async (req,res) => {
    try{
        const id_user = req.body.id_user;
        const result = await pool.query(`SELECT * FROM notification INNER JOIN task USING(id_task) 
        WHERE task.id_user=${id_user}`);
        return res.json(result.rows);
    }
    catch(error){
        return res.json(error);
    }
}

exports.updateNotificationByID = async (req,res) => {
    try{
        const id_notification = req.body.id_notification;
        const message = req.body.message;
        const date = req.body.date;
        const time = req.body.time;
        const result = await pool.query(`UPDATE notification SET message=${message},date=${date} ,time=${time}, 
        WHERE id_notification=${id_notification} RETURNING *`);
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.deleteNotificationByID = async (req,res) => {
    try{
        const id_notification = req.body.id_notification;
        await pool.query(`DELETE FROM notification WHERE id_notification=${id_notification}`);
        return res.json({message:"Notification deleted."});
    }
    catch(error){
        return res.json(error);
    }
}


