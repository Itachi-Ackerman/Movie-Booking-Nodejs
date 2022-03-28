/**
 * @info schema for user
 */
import { IMovie } from "./movies";
import { Schema, model } from "mongoose";
 
export interface ICinema {
    _id: string;
    cinemaName: string;
    location: string;
    seatsAvailable: number;
    movieId: IMovie | string;
}
const schema = new Schema({
    cinemaName: {
        type: String,
        unique: true,
        required: true,
    },
    location:{
        type: String,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        ref: "movies",
        required: true
    }
});

export default model<ICinema>("cinemas", schema);