"use server";
import { revalidatePath } from "next/cache";
import { connecttodatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { stringify } from "querystring";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";
import {v2 as cloudinary}  from 'cloudinary'

const populateuser=(query:any)=>query.populate({
    path:'author',
    model:User,
    select:'_id firstname lastname' 
})

//add image
export async function AddImage({userId,image,path}:AddImageParams){
    try {
        console.log(path)
        await connecttodatabase;

        const author=await User.findById(userId);
        if(!author){throw Error('User not found')}

        const newimage=await Image.create({
            ...image,
            author:author._id
        })
        revalidatePath(path);
        return JSON.parse(JSON.stringify(newimage));

    } catch (error) {
        handleError(error);
    }
}

//update

export async function UpdateImage({image,userId,path}:UpdateImageParams){
    try {
        await connecttodatabase;

        const updateimage=await Image.findById(userId);

        if(!updateimage || updateimage.author.toHexString() !=userId){
            throw  Error('Unauthorized or Image not found');
        }

        const updatedimage=await Image.findByIdAndUpdate(
            updateimage._id,
            image,
            {new:true}
        )

        revalidatePath(path);
        return JSON.parse(stringify(updatedimage));

    } catch (error) {
        handleError(error);
    }
}


//delete
export async function DeleteImage(userId:string){
    try {
        await connecttodatabase;

       await Image.findByIdAndDelete(userId);

    } catch (error) {
        handleError(error);
    }finally{
        redirect('/');
    }
}


//get by id-populate user info
export async function GetImagebyId(userId:string){
    try {
        await connecttodatabase;

        const image=await populateuser(Image.findById(userId));

        if(!image)throw Error('image not found');

        return JSON.parse(JSON.stringify(image));

    } catch (error) {
        handleError(error);
    }
}


export async function GetAllImages({limit=9,page=1,searchQuery=''}) {
    try {
        await connecttodatabase();
        cloudinary.config({
            cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_API_SECERT_KEY,
            secure:true
        });

        let expression='folder=imagify';

        if(searchQuery){
            expression+=`AND ${searchQuery}`
        }

        const {resources}=await cloudinary.search
        .expression(expression)
        .execute();

        const resourceIds=resources.map((element)=>element.public_id);
        let query={}

        if(searchQuery){
            query={
                publicId:
                {
                $in:resourceIds
            }}
        }


        const skipAmount=(Number(page)-1 * limit);
        const images=await populateuser(Image.find(query)).sort({updatedAt:-1}).limit(limit);
        const savedImages=await Image.find(query).countDocuments();
        const totalImages=await Image.find().countDocuments();
        return {
            data:JSON.parse(JSON.stringify(images)),
            totalPage:Math.ceil(totalImages/limit),
            savedImages

        }
    } catch (error) {
        handleError(error);
    }
}