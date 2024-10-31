const express=require("express");
const app=express();
const mongoose=require('mongoose');
const db_link='mongodb+srv://sakshimalde:7a4u5g14JdDJ3hYm@cluster0.hyyfr.mongodb.net/';
mongoose.connect(db_link)
.then(function(db){
    console.log(db);
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            minLength:8
        },
        confirmPassword:{
            type:String,
            required:true,
            minLength:8
        }
    }
);

const user=mongoose.model('user',userSchema)
module.exports = user;