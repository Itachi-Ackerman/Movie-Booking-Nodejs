import cinemas from "../models/cinemas";
import movies from "../models/movies";
// import movies from "../models/movies";
// import users from "../models/users";
import tickets, { ITickets } from "../models/tickets";


export default class CtrlTickets {
    /**
     * create new movies
     * @param body
     */
    static async bookTicket(userId: string, cinemaName1: string, numberOfSeats1: number): Promise<ITickets> {
        const cinema = await cinemas.findOne({ "cinemaName": cinemaName1 });
        if (cinema) {
            const seats = cinema.seatsAvailable;
            const cinemaId = cinema._id;
            const movieId = cinema.movieId;
            const movie = await movies.findOne({"_id": movieId});
            const showTime1 = movie.showTime;
            numberOfSeats1 = -1 * numberOfSeats1;
            if ((seats + numberOfSeats1) > -1) {
                await cinemas.updateOne({ cinemaName: cinemaName1 }, { $inc: { seatsAvailable: numberOfSeats1 } });
                return tickets.create({
                    user: userId,
                    cinema: cinemaId,
                    movie: movieId,
                    showTime: showTime1,
                    numberOfSeats: numberOfSeats1 * (-1)
                });
            }
            else
                throw new Error("Number of seats not available !!");
        }
        else
            throw new Error("Cinema Does not Exists !!");

    }

    /**
     * 
     * @param page find all tickets
     * @param limit 
     * @returns 
     */
    static async findAll(page: number, limit: number): Promise<ITickets[]> {
        return tickets
            .aggregate([
                {
                    $skip: page * limit,
                },
                {
                    $limit: limit,
                },
                {
                    $lookup: {
                        from: "movies",
                        localField: "movie",
                        foreignField: "_id",
                        as: "movie"
                    }
                },
                {
                    $lookup: {
                        from: "cinemas",
                        localField: "cinema",
                        foreignField: "_id",
                        as: "cinema"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    "password": 0
                                } 
                            }
                        ],
                        as: "users"
                    },
                },
            ])
            .exec()
    }
}