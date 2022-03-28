/**
 * @info schema for user
 */
import { IMovie } from "./movies";
import { ICinema } from "./cinemas";
import { IUser } from "./users";
import { Schema, model } from "mongoose";
// import { string } from "joi";

export interface ITickets {
    _id: string;
    movie: IMovie | string;
    cinema: ICinema | string;
    user: IUser|string;
    showTime: string;
    numberOfSeats: number;
}

const schema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: "movies",
        required: true
    },
    cinema: {
        type: Schema.Types.ObjectId,
        ref: "cinemas",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },    
    showTime: {
        type: String,
        required: true
    },
    numberOfSeats: {
        type: Number,
        required: true
    }
});

export default model<ITickets>("tickets", schema);