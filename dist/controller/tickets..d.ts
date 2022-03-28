import { ITickets } from "../models/tickets";
export default class CtrlTickets {
    /**
     * create new movies
     * @param body
     */
    static bookTicket(userId: string, cinemaName1: string, numberOfSeats1: number): Promise<ITickets>;
    /**
     *
     * @param page find all tickets
     * @param limit
     * @returns
     */
    static findAll(page: number, limit: number): Promise<ITickets[]>;
}
