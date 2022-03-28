/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
/**
 * @info schema for user
 */
import { IMovie } from "./movies";
import { ICinema } from "./cinemas";
import { IUser } from "./users";
export interface ITickets {
    _id: string;
    movie: IMovie | string;
    cinema: ICinema | string;
    user: IUser | string;
    showTime: string;
    numberOfSeats: number;
}
declare const _default: import("mongoose").Model<ITickets, {}, {}, {}>;
export default _default;
