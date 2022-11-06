/// <reference types="multer" />
import { SampleDto } from "./dto";
export declare class UserController {
    uploadFileAndPassValidation(body: SampleDto, file: Express.Multer.File): {
        body: SampleDto;
        file: string;
    };
}
