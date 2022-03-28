/**
* @info
*/
import { IMovie } from "../models/movies";
export default class CtrlMovies {
    /**
     * create new movies
     * @param body
     */
    static create(body: any): Promise<IMovie>;
    /**
     * find all books that belong to a user
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     * @param filterBy - field can be filtered by
     * @param order - execute in order
     *
     */
    static findAll(page: number, limit: number, filterBy: string, order: string): Promise<IMovie[]>;
}
