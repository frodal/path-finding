//  Tile and Grid class


class Tile {
    constructor(tileElement, tileRow, tileColumn) {
        this.element = tileElement;
        this.row = tileRow;
        this.column = tileColumn;

        this.isWall = false;
        this.isStart = false;
        this.isEnd = false;

        this.cameFromTile = null;
        this.pathCostToTile = Infinity;
    }
}


export default class Grid {
    constructor(N, gridWidth, gridHeight) {
        this.container = document.getElementById("gridContainer");

        this.width = gridWidth;
        this.height = gridHeight;
        this.N = N;

        this.map = new Map();
        this.grid = null;

        this.startTile = null;
        this.endTile = null;

        this.createGrid(N, gridWidth, gridHeight);
    }

    createGrid(N, gridWidth, gridHeight) {
        this.width = gridWidth;
        this.height = gridHeight;
        this.N = N;

        this.map.clear();
        this.grid = new Array(N); // NxN grid

        this.container.style.gridTemplateColumns = `repeat(${N}, 1fr)`;

        const width = gridWidth / N;
        const height = gridHeight / N;

        for (let row = 0; row < N; row++) {
            this.grid[row] = new Array(N);
            for (let column = 0; column < N; column++) {
                const element = document.createElement('div');
                element.className = 'tile';
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
                this.container.appendChild(element);
                this.grid[row][column] = new Tile(element, row, column);
                this.map.set(element, this.grid[row][column]);
            };
        };
    }

    clearGrid() {
        for (let row = 0; row < this.N; row++) {
            for (let column = 0; column < this.N; column++) {
                this.grid[row][column].element.remove();
            }
        }
        this.grid = null;
        this.map.clear();

        this.width = 0;
        this.height = 0;
        this.N = 0;

        this.startTile = null;
        this.endTile = null;
    };

    getTile(element) {
        return this.map.get(element);
    }

    getNeighbourTiles(tile) {
        let delta = [1, -1];
        let neighbours = [];
        if (!tile.isWall) {
            for (let i = 0; i < delta.length; i++) {
                let x = tile.row + delta[i];
                let y = tile.column;
                if (x >= 0 && x < this.N) {
                    let neighbourTile = this.grid[x][y];
                    if (!neighbourTile.isWall)
                        neighbours.push(neighbourTile);
                }
            }
            for (let i = 0; i < delta.length; i++) {
                let x = tile.row;
                let y = tile.column + delta[i];
                if (y >= 0 && y < this.N) {
                    let neighbourTile = this.grid[x][y];
                    if (!neighbourTile.isWall)
                        neighbours.push(neighbourTile);
                }
            }
        }
        return neighbours;
    }

}