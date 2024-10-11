"use server";
import { revalidatePath } from "next/cache";
import { connecttodatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { stringify } from "querystring";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";


const populateuser=(query:any)=>query.populate({
    path:'author',
    model:User,
    select:'_id firstname lastname' 
})

//add image
export async function AddImage({userId,image,path}:AddImageParams){
    try {
        await connecttodatabase;

        const author=await User.findById(userId);
        if(!author){throw new Error('User not found')}

        const newimage=await Image.create({
            ...image,
            author:author._id
        })
        revalidatePath(path);
        return JSON.parse(stringify(newimage));

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
            throw new Error('Unauthorized or Image not found');
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

        if(!image)throw new Error('image not found');

        return JSON.parse(stringify(image));

    } catch (error) {
        handleError(error);
    }
}