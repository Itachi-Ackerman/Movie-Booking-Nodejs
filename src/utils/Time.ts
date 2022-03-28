/**
 * @info
 */
 import moment from "moment";
 export default class Time {
     private static format = "YYYY-MM-DD HH:mm:ss";
     static current() {
        return moment().format(this.format);
     }

     static isAfterCurrent(date: string){
        console.log(date);
        
        return date > Time.current();
     }
 }