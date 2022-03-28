/**
* @info
*/
import cinemas, { ICinema } from "../models/cinemas";
import movies from "../models/movies";

export default class CtrlCinemas {
    /**
     * create new movies
     * @param body
     */
    static async create(body: ICinema): Promise<ICinema> {
        const movie = await movies.findOne({ "_id": body.movieId })
        
        if (movie)
            return cinemas.create(body);
        else
            throw new Error("Movie does not exist in the database");
    }

    /**
     * find all books that belong to a user
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    static async findAll(page: number, limit: number): Promise<ICinema[]> {

        return cinemas
            .aggregate([
                {
                    $skip: page * limit,
                },
                {
                    $limit: limit,
                },
                {
                    $sort: {
                        cinemaName: 1,
                    }
                },
                {
                    $lookup: {
                        from: "movies",
                        localField: "movieId",
                        foreignField: "_id",
                        as: "movie"
                    }
                }
            ])

            .exec()
    }

    /**
     * find all cinemas where a particular movie is airing 
     * @param movie - Name of the movie
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
 
     */
    static async findByMovieName(page: number, limit: number, movie: string) {

        const movies1 = await movies.find({ "movieName": movie });
        let moviesId = []
        movies1.forEach(element => {
            moviesId.push(element._id)
        });

        return cinemas
            .aggregate([
                {
                    $match: {
                        "movieId": {
                            $in: moviesId,
                        } ,
                    }
                },
                {
                    $skip: page * limit,
                },
                {
                    $limit: limit,
                },
                {
                    $sort: {
                        cinemaName: 1,
                    }
                },
                {
                    $lookup: {
                        from: "movies",
                        let: { mid: "$movieId" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {

                                        $eq: ["$movieName", movie]
                                    }
                                }
                            }
                        ],
                        as: "movie"
                    }
                },
                {
                    $project:{
                        "movieId":0
                    } 
                }
            ])
            .exec()
    }
}