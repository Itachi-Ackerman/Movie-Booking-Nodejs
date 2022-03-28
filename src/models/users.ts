/**
 * @info schema for user
 */

 import { Schema, model } from "mongoose";
 
 export interface IUser {
     _id: string;
     name: string;
     email: string;
     password: string;
 }
 
 const schema = new Schema({
     name: {
         type: String,
         required: true,
     },
     email: {
         type: String,
         required: true,
         unique: true,
     },
     password: {
         type: String,
         required: true,
     },
 });
 
 export default model<IUser>("users", schema);
 