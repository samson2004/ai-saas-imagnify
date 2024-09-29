import { model, models, Schema } from "mongoose";


const UserSchema=new Schema({
    clerkId:{type:Number,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    firstname:{type:String},
    lastname:{type:String},
    planId:{type:Number,default:1},
    creditBalance:{type:Number,default:10}
})

const User=models?.User || model('User',UserSchema);

export default User;