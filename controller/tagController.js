const pool = require("../models/database")

exports.createTag = async (req,res) => {
    try{
        const name_tag = req.body.name_tag;
        const id_user = req.body.id_user;
        const result = await pool.query(`INSERT INTO tag (name_tag,id_user) 
        VALUES (${name_tag},${id_user}) RETURNING *`);
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.getTagByUser = async (req,res) => {
    try{
        const id_user = req.body.id_user;
        const result = await pool.query(`SELECT * FROM tag WHERE tag.id_user=${id_user}`);
        return res.json(result.rows);
    }
    catch(error){
        return res.json(error);
    }
}

exports.deleteTagByName = async (req,res) => {
    try{
        const name_tag = req.body.name_tag;
        await pool.query(`DELETE FROM tag WHERE name_tag=${name_tag}`);
        return res.json({message:"Menu eliminado."});
    }
    catch(error){
        return res.json(error);
    }
}