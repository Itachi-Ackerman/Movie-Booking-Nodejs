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
    static async create(body: ICinema) {

        //accessing specific movie object based on given movieId
        const movie = await movies.findOne({ "_id": body.movieId })

        //if movie exists success, else movie not in database
        if (movie) {
            await cinemas.create(body);
            return { success: true, message: "Cinema created successfully" };
        }
        else
            throw new Error("Movie does not exist in the database");
    }

    /**
     * find all books that belong to a user
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    static async findAll(page: number, limit: number): Promise<ICinema[]> {
        //skipping and limiting list before displaying all objects
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
                    //looking up using movieId as reference from the movie collection
                    $lookup: {
                        from: "movies",
                        localField: "movieId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    "__v": 0
                                }
                            }
                        ],
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

        //accessing all movie objects with the same name as given by the movie parameter
        const movies1 = await movies.find({ "movieName": movie });

        //initializing an empty array and then extracting all movie Ids from movies1 to store them in the array
        let moviesId = []
        movies1.forEach(element => {
            moviesId.push(element._id)
        });

        //skipping and limiting before displaying full list
        return cinemas
            .aggregate([
                {
                    //matching movieId of cinema objects with movieIds in the created array: movies1
                    $match: {
                        "movieId": {
                            $in: moviesId,
                        },
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
                    //looking up from movie collection using movieId as reference
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
                            },
                            {
                                $project: {
                                    "__v":0
                                }
                            }
                        ],
                        as: "movie"
                    }
                },
                //ignoring unneccesary fields before displaying
                {
                    $project: {
                        "movieId": 0,
                        "__v":0
                    }
                }
            ])
            .exec()
    }
}