import "./Game.css";
export type GameMap = 'black' | 'red' | 'green' | 'blue';
export enum KeyBindings {
    UP = 38,
    DOWN = 40
}


export class Jeu {

    private gameCanvas;
    private gameContext;
    public static keysPressed: boolean[] = [];
    public static playerScore: number = 0;
    public static computerScore: number = 0;
    private player1: Paddle;
    private computerPlayer: ComputerPaddle;
    private ball: Ball;
    private WINDOW_WIDHT = 700;

    constructor(gameCanvas: HTMLCanvasElement) {

        this.gameCanvas = gameCanvas;
        this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D;

        window.addEventListener("keydown", function (e) {
            Jeu.keysPressed[e.which] = true;
        });

        window.addEventListener("keyup", function (e) {
            Jeu.keysPressed[e.which] = false;
        });

        var paddleWidth: number = 20, paddleHeight: number = 60, ballSize: number = 10, wallOffset: number = 20;

        this.player1 = new Paddle(paddleWidth, paddleHeight, wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2);
        this.computerPlayer = new ComputerPaddle(paddleWidth, paddleHeight, this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2);
        this.ball = new Ball(ballSize, ballSize, this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);

    }
    private get map() {
        return this.map;
    }

    private set map(value: GameMap | undefined) {
        this.map = value || 'black';
    }

    drawBoardDetails() {

        //draw court outline
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 5;
        this.gameContext.strokeRect(10, 10, this.gameCanvas.width - 20, this.gameCanvas.height - 20);

        //draw center lines
        for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
            this.gameContext.fillStyle = "#fff";//ligne du milieu
            this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
        }

        //draw scores
        this.gameContext.fillText(Jeu.playerScore.toString(),
            this.WINDOW_WIDHT / 2 - 60, 50);
        this.gameContext.font = "50px serif"
        this.gameContext.fillText(Jeu.computerScore.toString(),
            this.WINDOW_WIDHT / 2 + 40, 50);

    }
    update() {
        this.player1.update(this.gameCanvas);
        this.computerPlayer.update(this.ball, this.gameCanvas);
        this.ball.update(this.player1, this.computerPlayer, this.gameCanvas);
    }
    draw() {
        this.gameContext.fillStyle = "#000";//couleur background
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        this.drawBoardDetails();
        this.player1.draw(this.gameContext);
        this.computerPlayer.draw(this.gameContext);
        this.ball.draw(this.gameContext);
    }
    gameLoop() {
        this.update();
        this.draw();
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                this.gameLoop();
            }, 1);
        });
    }
}


class Entity {
    width: number;
    height: number;
    x: number;
    y: number;
    xVel: number = 0;
    yVel: number = 0;
    constructor(w: number, h: number, x: number, y: number) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
    }
}

class Paddle extends Entity {

    private speed: number = 10;

    constructor(w: number, h: number, x: number, y: number) {

        super(w, h, x, y);
    }

    update(Canvas: any) {
        if (Jeu.keysPressed[KeyBindings.UP]) {
            this.yVel = -1;
            if (this.y <= 20) {
                this.yVel = 0
            }
        } else if (Jeu.keysPressed[KeyBindings.DOWN]) {
            this.yVel = 1;
            if (this.y + this.height >= Canvas.height - 20) {
                this.yVel = 0;
            }
        } else {
            this.yVel = 0;
        }

        this.y += this.yVel * this.speed;

    }
    draw(gameContext: any) {
        gameContext.fillStyle = "green";
        gameContext.fillRect(this.x, this.y, this.width, this.height);
    }
}

class ComputerPaddle extends Entity {

    private speed: number = 10;

    constructor(w: number, h: number, x: number, y: number) { super(w, h, x, y); }

    update(ball: Ball, canvas: any) {

        //chase ball
        if (ball.y < this.y && ball.xVel == 1) {
            this.yVel = -1;

            if (this.y <= 20) {
                this.yVel = 0;
            }
        }
        else if (ball.y > this.y + this.height && ball.xVel == 1) {
            this.yVel = 1;

            if (this.y + this.height >= canvas.height - 20) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }

        this.y += this.yVel * this.speed;
    }
    draw(gameContext: any) {
        gameContext.fillStyle = "green";
        gameContext.fillRect(this.x, this.y, this.width, this.height);
    }

}

class Ball extends Entity {

    private speed: number = 5;

    constructor(w: number, h: number, x: number, y: number) {
        super(w, h, x, y);
        var randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2) {
            this.xVel = 1;
        } else {
            this.xVel = -1;
        }
        this.yVel = 1;
    }

    update(player: Paddle, computer: ComputerPaddle, canvas: any) {

        //haut
        if (this.y <= 10) {
            this.yVel = 1;
        }

        //boutton
        if (this.y + this.height >= canvas.height - 10) {
            this.yVel = -1;
        }

        //bord gauche
        if (this.x <= 0) {
            this.x = canvas.width / 2 - this.width / 2;
            Jeu.computerScore += 1;
        }

        //bord droit
        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width / 2 - this.width / 2;
            Jeu.playerScore += 1;
        }
        //joueur touche
        if (this.x <= player.x + player.width) {
            if (this.y >= player.y && this.y + this.height <= player.y + player.height) {
                this.xVel = 1;
            }
        }

        //ordi touch
        if (this.x + this.width >= computer.x) {
            if (this.y >= computer.y && this.y + this.height <= computer.y + computer.height) {
                this.xVel = -1;
            }
        }
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    }
    draw(gameContext: any) {
        gameContext.fillStyle = "green";
        gameContext.fillRect(this.x, this.y, this.width, this.height);
    }
}
