/**
 * @info schema for user
 */
import { Schema, model } from "mongoose";
 
export interface IMovie {
    _id: string;
    movieName: string;
    showTime: string
        
       
    }
const schema = new Schema({
    movieName: {
        type: String,
        required: true,
    },
    showTime:{
        type: String,
        required: true
    }
});

export default model<IMovie>("movies", schema);