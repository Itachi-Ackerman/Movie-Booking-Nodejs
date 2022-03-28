"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    movie: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "movies",
        required: true
    },
    cinema: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "cinemas",
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
    numberOfSeats: {
        type: Number,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("tickets", schema);
//# sourceMappingURL=tickets.js.map