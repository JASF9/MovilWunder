const pool = require("../models/database")

exports.createTask = async (req,res) => {
    try{
        const content = req.body.content;
        const created = Date.now();
        const time_limit = req.body.time_limit;
        const date_limit = req.body.date_limit;
        const id_user = req.body.id_user;
        const result = await pool.query(`INSERT INTO task (content,created,time_limit,date_limit,id_user) 
        VALUES (${content},${created},${time_limit},${date_limit},${id_user}) RETURNING *`);
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.getTasksByUserID = async (req,res) => {
    try{
        const result = await pool.query(`SELECT * FROM task WHERE id_user=${id_user} ORDER BY order`);
        return res.json(result.rows);
    }
    catch(error){
        return res.json(error);
    }
}

exports.updateTaskByID = async (req,res) => {
    try{
        const content = req.body.content;
        const time_limit = req.body.time_limit;
        const date_limit = req.body.date_limit;
        const id_task = req.body.id_task; 
        const result = await pool.query(`UPDATE task SET content=${content}, time_limit=${time_limit}, date_limit=${date_limit}  
        WHERE id_tag=${id_task} RETURNING *`);
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.updateTaskOrderByTasksArray = async (req,res) => {
    try{
        const tasks = req.body.tasks;
        for(i=0; i<tasks.length; i++){
            await pool.query(`UPDATE task SET taskorder=${i+1} 
            WHERE id_tag=${id_task} `);    
        }
        return res.json({message:"Task order successfully updated."});
    }
    catch(error){
        return res.json(error);
    }
}

exports.tagTaskByIDs = async (req,res) => {
    try{
        const id_task = req.body.id_task;
        const id_tag = req.body.id_tag;
        
        const result =  await pool.query(`INSERT INTO task_tag (id_task,id_tag) 
            VALUES (${id_task},${id_tag}) RETURNING *`);    
        
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.deleteTaskByID= async (req,res) => {
    try{
        const id_task = req.body.id_task;
        await pool.query(`DELETE FROM task WHERE id_task=${id_task}`);
        return res.json({message:"Task deleted."});
    }
    catch(error){
        return res.json(error);
    }
}