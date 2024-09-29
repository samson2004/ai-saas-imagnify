/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose,{Mongoose} from "mongoose";

const mongodb_url=process.env.MONGO_URL;


interface MongooseConnection{
    conn:Mongoose|null;
    promise:Promise<Mongoose>|null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached:MongooseConnection=(global as any).mongoose

if(!cached){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cached=(global as any).mongoose={
        conn:null,
        promise:null
    }
}
export const connecttodatabase =async ()=>{
    if(cached.conn) return cached.conn;
    if(!mongodb_url) throw new Error('missing  mongo_db_urld');
    cached.promise= cached.promise|| mongoose.connect(
        mongodb_url,{
            dbName:'imagnify ',
            bufferCommands:false
        })

    cached.conn=await cached.promise

    return cached.conn
}