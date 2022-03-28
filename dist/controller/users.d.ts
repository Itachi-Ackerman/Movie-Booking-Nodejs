/**
 * @info perform CRUD on user
 */
import { IUser } from "../models/users";
export default class CtrlUser {
    /**
     * creating a new user
     * @param body
     */
    static create(body: any): Promise<IUser>;
    /**
     * authenticating a user
     * @param email
     * @param password
     */
    static auth(email: string, password: string): Promise<IUser>;
    /**
     * displaying all users
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    static findAll(page: number, limit: number): Promise<IUser[]>;
    /**
     * find profile of user
     * @param userId
     */
    static userProfile(userId: string): Promise<IUser[]>;
}
