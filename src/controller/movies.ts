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
    static async create(body: any): Promise<IMovie> {
        return movies.create(body);
    }

    /**
     * find all books that belong to a user
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     * @param filterBy - field can be filtered by
     * @param order - execute in order
     * 
     */
    static async findAll(page: number, limit: number, filterBy: string, order:string): Promise<IMovie[]> {

        let ord;
        ord = (order.toLowerCase() == "dsc") ? -1 : 1;
        if(filterBy.toLowerCase() == "showtime"){
        return movies
            .aggregate([
               {
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
                  $sort: {
                      showTime: ord,
                  }
                },
            ])

          .exec()
        }
          else{
            return movies
            .aggregate([
                {
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
                  $sort: {
                      movieName: ord,
                  }
                },
            ])

          .exec()
          }
    }

    
}