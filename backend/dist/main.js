"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.use(session({
        secret: 'use random string',
        resave: false,
        saveUninitialized: false
    }));
    console.log("testing 42API");
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map