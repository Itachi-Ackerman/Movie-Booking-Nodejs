/**
* @info
*/
import { ICinema } from "../models/cinemas";
export default class CtrlCinemas {
    /**
     * create new movies
     * @param body
     */
    static create(body: ICinema): Promise<ICinema>;
    /**
     * find all books that belong to a user
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    static findAll(page: number, limit: number): Promise<ICinema[]>;
    /**
     * find all cinemas where a particular movie is airing
     * @param movie - Name of the movie
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
 
     */
    static findByMovieName(page: number, limit: number, movie: string): Promise<any[]>;
}
