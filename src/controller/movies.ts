/**
* @info
*/
import movies, { IMovie } from "../models/movies";
import Time from "../utils/Time";

export default class CtrlMovies {
    /**
     * create new movies
     * @param body
     */
    static async create(body: any) {
        //checking if showTime has already expired or not
        if(body.showTime>Time.current())
        {
            await movies.create(body);
            return { success: true, message: "movie created successfully" };
        }
        else throw new Error("showTime has already passed");
    }

    /**
     * find all books that belong to a user
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     * @param filterBy - field can be filtered by
     * @param order - execute in order
     * 
     */
    static async findAll(page: number, limit: number, filterBy: string, order: string): Promise<IMovie[]> {

        //setting order value depending on user preference
        const ord = (order.toLowerCase() == "dsc") ? -1 : 1;

        //using filterBy to sort based on user reference
        if (filterBy.toLowerCase() == "showtime") {
            return movies
                .aggregate([
                    {
                        //matching to check if showTime is already expired
                        $match: {
                            $expr: { $gt: ["$showTime", Time.current()] }
                        }

                    },
                    {
                        $skip: page * limit,
                    },
                    {
                        $limit: limit,
                    },
                    {
                        $project:{
                            "__v": 0
                        }
                    },
                    {
                        //sorting on the basis of showTime
                        $sort: {
                            showTime: ord,
                        }
                    },
                ])

                .exec()
        }
        else {
            return movies
                .aggregate([
                    {
                        //matching to check if showTime is already expired
                        $match: {
                            $expr: { $gt: ["$showTime", Time.current()] }
                        }

                    },
                    {
                        $skip: page * limit,
                    },
                    {
                        $limit: limit,
                    },
                    {
                        $project:{
                            "__v": 0
                        }
                    },
                    {
                        //sorting on the basis of movieName
                        $sort: {
                            movieName: ord,
                        }
                    },
                ])

                .exec()
        }
    }


}