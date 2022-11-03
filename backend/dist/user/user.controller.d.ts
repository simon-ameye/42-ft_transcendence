/// <reference types="multer" />
/// <reference types="express" />
export declare class UserController {
    uploadImage(file: Express.Multer.File): import("express").Response<any, Record<string, any>>;
}
