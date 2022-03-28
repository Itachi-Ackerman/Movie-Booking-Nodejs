/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
export interface IMovie {
    _id: string;
    movieName: string;
    showTime: string;
}
declare const _default: import("mongoose").Model<IMovie, {}, {}, {}>;
export default _default;
