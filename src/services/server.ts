/**
 * @info the main entry point of express server
 */

import express, { Request } from "express";
import bodyParser from "body-parser";
import expressResponse from "../middleware/expressResponse";
import Joi from "joi";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import CtrlUser from "../controller/users";
import CtrlAdmin from "../controller/admin";
import CtrlMovies from "../controller/movies";
import CtrlCinemas from "../controller/cinema";
import CtrlTickets from "../controller/tickets";

export default class Server {
    app = express();

    async start() {
        console.log("Starting express server");
        this.app.listen(process.env.PORT);
        console.log(`Express server started at http://localhost:${process.env.PORT}`);

        this.middleware();
        this.routes();
        this.defRoutes();
    }

    /**
     * middlewares
     */
    middleware() {
        //using morgan to log requests
        this.app.use(morgan("tiny"));
        //to take input from user for post requests
        this.app.use(bodyParser.urlencoded({ extended: false }));
        //initilizing session and cookies
        this.app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                store: MongoStore.create({
                    mongoUrl: process.env.SESSION_MONGO_URL,
                }),
                cookie: {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                },
            }),
        );
    }

    /**
     * app routes
     */
    routes() {

        // USER ROUTES

        // create a user
        this.app.post(
            "/users/create",
            expressResponse(async (req: Request) => {
                //authenticating admin
                //@ts-ignore
                if (req.session && req.session.admin) {
                    // create joi schema
                    const schema = Joi.object({
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required(),
                    });

                    // validating req.body
                    const data = await schema.validateAsync(req.body);

                    // creating user
                    return CtrlUser.create(data);
                }
                else throw new Error("Admin not authenticated");
            }),
        );

        // authenticate a user
        this.app.post(
            "/users/auth",
            expressResponse(async (req: Request) => {
                // create joi schema
                const schema = Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                });

                // validating req.body
                await schema.validateAsync(req.body);

                // authenticate user
                const user = await CtrlUser.auth(req.body.email, req.body.password);

                // set the user session
                // @ts-ignore
                req.session.user = user;

                return { success: true, message: "user authenticated successfully" };
            }),
        );

        // authentication check
        this.app.get(
            "/users/me",
            expressResponse(async (req: Request) => {
                // check authentication
                // @ts-ignore
                if (req.session && req.session.user) {
                    // @ts-ignore
                    return req.session.user;
                }
                // throw error
                else throw new Error("user not authenticated");
            }),
        );

        // display all users
        this.app.get(
            "/users/findAll",
            expressResponse(async (req: Request) => {
                // check admin authentication
                //@ts-ignore
                if (req.session && req.session.admin) {

                    const schema = Joi.object({
                        page: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(5),
                    });

                    // validate
                    const data = await schema.validateAsync(req.query);

                    return CtrlUser.findAll(data.page, data.limit);
                }

                //throw error
                else throw new Error("admin not authenticated");
            }),
        );

        // display user profile
        this.app.get(
            "/users/profile",
            expressResponse(async (req: Request) => {
                // check user authentication
                //@ts-ignore
                if (req.session && req.session.user) {
                    //@ts-ignore
                    return CtrlUser.userProfile(req.session.user._id);
                }

                //throw error
                else throw new Error("user not authenticated");
            }),
        );

        // logging out user
        this.app.post(
            "/users/logout",
            expressResponse((req: Request) => {
                // destroy session
                req.session.destroy(() => { });

                // return success to user
                return { success: true, message: "user is logged out" };
            }),
        );

        // ADMIN ROUTES

        // authenticate a admin
        this.app.post(
            "/admin/auth",
            expressResponse(async (req: Request) => {
                // create joi schema
                const schema = Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                });

                // validating req.body
                await schema.validateAsync(req.body);

                // authenticate admin
                const admin = await CtrlAdmin.auth(req.body.email, req.body.password);

                // set the admin session
                // @ts-ignore
                req.session.admin = admin;

                return { success:true, message:"Admin authenticated successfully" };
            }),
        );

        // logging out admin
        this.app.post(
            "/admin/logout",
            expressResponse((req: Request) => {
                // destroy session
                req.session.destroy(() => { });

                // return success to admin
                return { success: true, message: "admin is logged out" };
            }),
        );

        // MOVIE ROUTES

        // create a movie
        this.app.post(
            "/movies/create",
            expressResponse(async (req: Request) => {

                // check admin authentication
                //@ts-ignore
                if (req.session && req.session.admin) {
                    // create joi schema
                    const schema = Joi.object({
                        movieName: Joi.string().required(),
                        showTime: Joi.string().required(),
                    });

                    // validating req.body
                    await schema.validateAsync(req.body);
                    // creating movie
                    return CtrlMovies.create(req.body);
                }
                else
                    throw new Error("Admin not authenticated");

            }),
        );

        // display all movies
        this.app.get(
            "/movies/findAll",
            expressResponse(async (req: Request) => {
                //creating joi schema 
                const schema = Joi.object({
                    page: Joi.number().integer().default(0),
                    limit: Joi.number().integer().default(5),
                    filterBy: Joi.string().default("movieName"),
                    order: Joi.string().default("asc"),
                });

                // validate
                const data = await schema.validateAsync(req.query);
                //displaying all movies
                return CtrlMovies.findAll(data.page, data.limit, data.filterBy, data.order);

            }),
        );

        // CINEMA ROUTES

        // create a cinema
        this.app.post(
            "/cinema/create",
            expressResponse(async (req: Request) => {

                // check admin authentication
                //@ts-ignore
                if (req.session && req.session.admin) {
                    // create joi schema
                    const schema = Joi.object({
                        cinemaName: Joi.string().required(),
                        location: Joi.string().required(),
                        seatsAvailable: Joi.number().default(30),
                        movieId: Joi.string().required(),
                    });

                    // validating req.body
                    await schema.validateAsync(req.body);

                    // creating cinema
                    return CtrlCinemas.create(req.body);
                }
                else
                    throw new Error("Admin not authenticated");

            }),
        );

        // display all cinema
        this.app.get(
            "/cinema/findAll",
            expressResponse(async (req: Request) => {

                //creating joi schema
                const schema = Joi.object({
                    page: Joi.number().integer().default(0),
                    limit: Joi.number().integer().default(5),
                });

                // validate
                const data = await schema.validateAsync(req.query);

                //displaying list of cinemas
                return CtrlCinemas.findAll(data.page, data.limit);

            }),
        );

        // display cinema by movie name
        this.app.get(
            "/cinema/findByMovieName",
            expressResponse(async (req: Request) => {

                //creating joi schema
                const schema = Joi.object({
                    page: Joi.number().integer().default(0),
                    limit: Joi.number().integer().default(5),
                    movie: Joi.string().required()
                });

                // validate
                const data = await schema.validateAsync(req.query);

                //displaying movie list by Name
                return CtrlCinemas.findByMovieName(data.page, data.limit, data.movie);

            }),
        );

        // TICKETS ROUTES

        // book tickets
        this.app.post(
            "/tickets/bookTickets",
            expressResponse(async (req: Request) => {
                // check user authentication
                // @ts-ignore
                if (req.session && req.session.user) {
                    const schema = Joi.object({
                        cinemaName: Joi.string().required(),
                        numberOfSeats: Joi.number().required(),
                    });

                    // validate
                    const data = await schema.validateAsync(req.body);

                    //booking ticket
                    //@ts-ignore
                    return CtrlTickets.bookTicket(req.session.user._id, data.cinemaName, data.numberOfSeats);
                }
                else
                    throw new Error("user not authenticated");
            }),
        );

        // display all tickets
        this.app.get(
            "/tickets/findAll",
            expressResponse(async (req: Request) => {
                // check admin authentication
                //@ts-ignore
                if (req.session && req.session.admin) {

                    const schema = Joi.object({
                        page: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(5),
                    });

                    // validate
                    const data = await schema.validateAsync(req.query);
                    
                    //display list of tickets
                    return CtrlTickets.findAll(data.page, data.limit);
                }

                //throw error
                else throw new Error("admin not authenticated");
            }),
        );

    }

    /**
     * default routes
     */
    defRoutes() {
        // check if server running
        this.app.all("/", (req, resp) => {
            resp.status(200).send({ success: true, message: "Server is working" });
        });

        this.app.all("*", (req, resp) => {
            resp.status(404).send({ success: false, message: `given route [${req.method}] ${req.path} not found` });
        });
    }
}
