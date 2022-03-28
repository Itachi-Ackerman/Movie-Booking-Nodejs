/**
 * @info perform CRUD on user
 */
 import users, { IUser } from "../models/users";
 import Bcrypt from "../services/bcrypt";
 import mongoose from "mongoose";
 import Time from "../utils/Time";
 
 export default class CtrlUser {
     /**
      * creating a new user
      * @param body
      */
     static async create(body: any): Promise<IUser> {
         const hash = await Bcrypt.hashing(body.password);
         const data = {
             ...body,
             password: hash,
         };
         return users.create(data);
     }
 
     /**
      * authenticating a user
      * @param email
      * @param password
      */
     static async auth(email: string, password: string): Promise<IUser> {
         // fetch user from database
         const user = await users.findOne({ email }).lean();
 
         // if users exists or not
         if (user) {
             // verify the password
             const result = await Bcrypt.comparing(password, user.password);
 
             // if password is correct or not
             // if correct, return the user
             if (result) return user;
             // throw error
             else throw new Error("password doesn't match");
         }
         // throw error
         else throw new Error("user doesn't exists");
     }

     /**
      * displaying all users
      * @param page - the page number (starting from 0)
      * @param limit - no of documents to be returned per page
      */
     static async findAll(page: number, limit: number): Promise<IUser[]>{
        return users
            .aggregate([
                {
                    $skip: page*limit,
                },
                {
                    $limit: limit,
                }

            ])
            .exec()
     }

     /**
      * find profile of user
      * @param userId 
      */
     static async userProfile(userId: string): Promise<IUser[]>{
        return users
            .aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    },
                },
                {
                    $project:{
                        "password" : 0
                    }  
                },
                {
                    $lookup: {
                        from: "tickets",
                        let: { userId: "$_id"},
                        pipeline: [
                            {
                                $match: 
                                { 
                                    $expr: 
                                    {
                                        $and: 
                                        [ 
                                            {
                                                $eq: 
                                                [ "$user", "$$userId" ]
                                            }, 
                                            {
                                                $gt:
                                                ["$showTime", Time.current()]
                                            }
                                        ]
                                    }
                                }
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
                                    as: "user"
                                },
                            },
                        ],
                        as: "tickets"
                    },
                },
                
            ])
            .exec();
     }
 }

 
 