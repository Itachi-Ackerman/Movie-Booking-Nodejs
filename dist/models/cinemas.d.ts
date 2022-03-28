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
export interface ICinema {
    _id: string;
    cinemaName: string;
    location: string;
    seatsAvailable: number;
    movieId: IMovie | string;
}
declare const _default: import("mongoose").Model<ICinema, {}, {}, {}>;
export default _default;
