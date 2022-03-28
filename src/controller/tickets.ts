import cinemas, { ICinema } from "../models/cinemas";
import movies, { IMovie } from "../models/movies";
import Time from "../utils/Time";
import tickets, { ITickets } from "../models/tickets";


export default class CtrlTickets {
    /**
     * create new movies
     * @param userId - User ID
     * @param cinemaName1 - cinema name as given by user
     * @param numberOfSeats1 - required number of seats
     */
    static async bookTicket(userId: string, cinemaName1: string, numberOfSeats1: number) {

        //accessing cinema object from collection on the basis of cinemaName and then populating movieId with respective movie object
        const cinema : ICinema = await cinemas.findOne({ "cinemaName": cinemaName1 }).populate("movieId","_id showTime movieName") as ICinema;

        //checking if cinema object was found, if not throw error
        if (cinema) {

            //storing movie object referred through cinema object in movie variable 
            //and then storing other required values in respective variables
            const movie = cinema.movieId as IMovie;
            const showTime1 = movie.showTime;
            //checking if showTime has already expired
            if(showTime1<Time.current())
            {
                throw new Error("Movie showTime expired")
            }
            const seats = cinema.seatsAvailable;
            const cinemaId = cinema._id;
            const movieId = movie._id;
            //checking if seatsAvailable>=0 even after subtracting required seats
            if ((seats + numberOfSeats1) > -1) {
                //decrementing seatsAvailable in database
                await cinemas.updateOne({ cinemaName: cinemaName1 }, { $inc: { seatsAvailable: -numberOfSeats1 } });
                await tickets.create({
                    user: userId,
                    cinema: cinemaId,
                    movie: movieId,
                    showTime: showTime1,
                    numberOfSeats: numberOfSeats1
                });
                return { success: true, message: `Ticket for the movie ${movie.movieName} at ${cinemaName1} booked successfully` };
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
        //skipping and limiting before displaying list
        return tickets
            .aggregate([
                {
                    $skip: page * limit,
                },
                {
                    $limit: limit,
                },
                {
                    //looking up from movie collection with movieId as reference
                    $lookup: {
                        from: "movies",
                        localField: "movie",
                        pipeline: [
                            {
                                $project: {
                                    "__v":0
                                } 
                            }
                        ],
                        foreignField: "_id",
                        as: "movie"
                    }
                },
                {
                    //looking up from cinemas collection with cinemaId as reference
                    $lookup: {
                        from: "cinemas",
                        localField: "cinema",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    "__v":0
                                } 
                            }
                        ],
                        as: "cinema"
                    }
                },
                {
                    //looking up from users collection with userId as reference
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    "password": 0,
                                    "__v":0
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