"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    cinemaName: {
        type: String,
        unique: true,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    movieId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "movies",
        required: true
    }
});
exports.default = (0, mongoose_1.model)("cinemas", schema);
//# sourceMappingURL=cinemas.js.map