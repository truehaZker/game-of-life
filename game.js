const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;
canvas.style.imageRendering = "crisp-edges";

const ctx = canvas.getContext('2d');

const FPS = 10;

let pause = false;

let Pause = () =>  {
    pause = !pause;
    document.getElementById('pause').innerText = pause ? 'Resume' : 'Pause';
}

class GOLBoard {
    ctx;
    boardSize;
    cells;
    cellGap;

    get cellSize() {
        return this.ctx.canvas.width / this.boardSize;
    }

    constructor(ctx, boardSize, cellGap = 1) {
        this.ctx = ctx;
        this.boardSize = boardSize;
        this.cells = [];
        this.cellGap = cellGap;

        this.GenerateBoard();

        ctx.canvas.addEventListener("mousedown", (e) => {

            let cursorPos = {
                X: Math.floor((e.x - canvas.offsetLeft) / this.cellSize),
                Y: Math.floor((e.y - canvas.offsetTop) / this.cellSize)
            };

            this.cells[cursorPos.X][cursorPos.Y] = !this.cells[cursorPos.X][cursorPos.Y];
            this.DrawBoard();

            let prev = {X: cursorPos.X, Y: cursorPos.Y};

            ctx.canvas.onmousemove = (e) => {
                cursorPos = {
                    X: Math.floor((e.x - canvas.offsetLeft) / this.cellSize),
                    Y: Math.floor((e.y - canvas.offsetTop) / this.cellSize)
                };

                console.log(cursorPos, prev);

                if (cursorPos.X !== prev.X || cursorPos.Y !== prev.Y) {
                    this.cells[cursorPos.X][cursorPos.Y] = !this.cells[cursorPos.X][cursorPos.Y];
                    this.DrawBoard();
                    prev = cursorPos;
                }
            }
        });

        ctx.canvas.addEventListener("mouseup", (e) =>{
            ctx.canvas.onmousemove = null;
        });
    }

    GenerateBoard () {
        for (let i = 0; i <= this.boardSize; i++) {
            this.cells[i] = [];
            for (let j = 0; j <= this.boardSize; j++) {
                this.cells[i][j] = Math.random() > 0.8 ? 1 : 0;
            }
        }
    }

    IsAlive (posX, posY) {
        if (posX >= 0 && posX <= this.boardSize && posY >= 0 && posX <= this.boardSize) {
            return !!this.cells[posX][posY];
        }
        return false;
    }

    CountNeighbours(posX, posY) {
        let counter = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if ( i === 0 && j === 0){
                    continue;
                }
                if (this.IsAlive(posX - i, posY - j)){
                    counter++;
                }
            }
        }

        return counter;
    }

    LifeIteration() {
        let newCells = [];
        for (let i = 0; i <= this.boardSize; i++) {
            newCells[i] = [];
            for (let j = 0; j <= this.boardSize; j++) {
                if(this.IsAlive(i, j)) {
                    if ( this.CountNeighbours(i, j) > 3 || this.CountNeighbours(i, j) < 2) newCells[i][j] = 0;
                    else newCells[i][j] = 1;
                }
                else {
                    if ( this.CountNeighbours(i, j) === 3) newCells[i][j] = 1;
                    else newCells[i][j] = 0;
                }
            }
        }
        this.cells = newCells;
    }

    DrawBoard () {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let i = 0; i <= this.boardSize; i++) {
            for (let j = 0; j <= this.boardSize; j++) {
                if (this.IsAlive(i, j)) {
                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.fillRect(i * this.cellSize + this.cellGap,
                        j * this.cellSize + this.cellGap,
                        this.cellSize - this.cellGap * 2,
                        this.cellSize - this.cellGap * 2
                    );
                }
            }
        }
    }
}
let board = new GOLBoard(ctx, 100, 0);

const draw = () => {
    if (!pause) {
        board.LifeIteration();
        board.DrawBoard();
    }
}

let start = () => {
    draw();
    setInterval(draw, 1000 / FPS);
}

start();