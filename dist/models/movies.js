"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @info schema for user
 */
//import  Time  from "../utils/Time";
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    movieName: {
        type: String,
        required: true,
    },
    showTime: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("movies", schema);
//# sourceMappingURL=movies.js.map