const pool = require("../models/database")
const wjt= require('jsonwebtoken'); 
const bcrypt= require('bcrypt'); 

exports.registerUser= async (req,res)=>{
   
    const {name, mail, password, password2} = req.body; 
    const token = wjt.sign({mail:mail},'secretkey');
    const errors=[]; 

    if(!name||!mail||!password||!password2){
        errors.push({message:'Empty field detected.'});
    }

    if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(mail)){
    } 
    else {
        errors.push({message:'Invalid mail.'});
    }

    if(password.length<6){
        errors.push({message:'Password must contain min 6 chars.'});
    }

    if (password!==password2) {
        errors.push({message:'Passwords do not match.'});
    }

    if(errors.length>0){
        res.send({errors})
    }
    else {
        const hashPassword = await bcrypt.hash(password,10);  

        pool.query( `SELECT * FROM users WHERE mail=${mail}`, (err,results)=>{
            if(err){                     
                throw err
            }
            if(results.rows.length>0){
                errors.push({message:'User is already registered.'}); 
                res.send({errors})
            }
            else{ 
                pool.query(`INSERT INTO users (name_user,mail,password)
                VALUES (${name},${mail},${hashPassword}) RETURNING *`);
                return res.json({token:token});; 
            }
       })
    }
}; 

exports.loginUser= async (req, res)=>{
    const {mail, password} = req.body; 
    const hashPassword = await bcrypt.hash(password,10);
   
    const token = wjt.sign({mail:mail},'secretkey');

    const errors = []; 

    if(!email||!password){
    errors.push({message:'Empty field detected'});
    }

    const response = pool.query( `SELECT mail FROM users WHERE mail=${mail}`, (err,results)=>{
        if(err){                    
            throw err
        }
        const consult = results.rows[0].mail;   
        if(consult<0){
            errors.push({message:'User not registered'});
        }
        else{        
            if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(mail)){
                console.log('Valid mail')
            }  
            else {
                errors.push({message:'Invalid mail.'});
            }
            if(password.length<6){
                errors.push({message:'Password have at least 6 chars.'});
            }
            if(errors.length>0){
                res.send({errors})
            }
            else {      
                const response =  pool.query( `SELECT password FROM users WHERE mail=${mail}`, (err,results)=>{
                    if(err){                    
                        throw err
                    }
                    const consulta=results.rows[0].password;   
                    if(bcrypt.compareSync(hashPassword, consulta)){
                        res.status(200).send(`Token :  ${token}`)
                    }
                    else{                     
                    errors.push({message:'Invalid password'});    
                    }
                })    
            }     
        }
    })
}


exports.getUserByMail = async (req,res) => {
    try{
        const mail = req.body.mail;
        const result = await pool.query(`SELECT * FROM usuario WHERE correo_usuario=${mail}`);
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.updateUser = async (req,res) => {
    try{
        const oldmail = req.body.oldmail;
        const name = req.body.name;
        const mail = req.body.mail;
        const password = req.body.password;
        const phone_number = req.body.phone_number
        const result = await pool.query(`UPDATE usuario SET nombre_usuario=${name} ,correo_usuario=${mail} ,password=${password}, 
        phone_number=${phone_number}  WHERE correo_usuario=${oldmail} RETURNING *`);
        return res.json(result.rows[0]);
    }
    catch(error){
        return res.json(error);
    }
}

exports.deleteUser = async (req,res) => {
    try{
        const mail = req.body.mail;
        await pool.query(`DELETE FROM usuario WHERE correo_usuario=${mail}`);
        return res.json({message:"User deleted."});
    }
    catch(error){
        return res.json(error);
    }
}


