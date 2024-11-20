const express=require("express");
const app=express();
const mongoose=require('mongoose');
const emailvalidator=require('email-validator');
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
            unique:true,
            validate:function(){
                return emailvalidator.validate(this.email);
            }
        },
        password:{
            type:String,
            required:true,
            minLength:8
        },
        confirmPassword:{
            type:String,
            required:true,
            minLength:8,
            validate:function(){
                return this.confirmPassword==this.password
            }
        },
        username: { type: String, required: true, unique: true },
        fullName: { type: String }, 
        location: { type: String },  
        bio: { type: String },     
        
    }
);

userSchema.pre('save',function(){
    this.confirmPassword=undefined;
})


const user=mongoose.model('User',userSchema)
module.exports = user;