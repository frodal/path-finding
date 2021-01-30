// Main 

import Astar from './Astar.js';
import Dijkstra from './Dijkstra.js';
import Grid from './Grid.js';
import State from './State.js';

const minTileNum = 3;
const maxTileNum = 200;

const startGridSize = 50;
const gridWidth = 0.8 * Math.min(window.innerWidth, window.innerHeight);
const gridHeight = 0.8 * Math.min(window.innerWidth, window.innerHeight);

const wallColor = 'black';
const startColor = 'green';
const goalColor = 'red';
const pathColor = 'blue';
const closestColor = 'cyan';
const visualizeColor = 'gray';

const shouldVisualize = true;
const visualizationDelay = 50;
const visualizationTime = 5000;


// Entry point
document.addEventListener('DOMContentLoaded', function () {
    let state = new State();
    let grid = new Grid(startGridSize, gridWidth, gridHeight);

    addMouseEvents(state, grid);

    document.getElementById("newGrid").onclick = function () {
        refresh(state, grid);

        addMouseEvents(state, grid);
    };

    document.getElementById("compute").onclick = function () {
        if (!state.selectingStartPoint && !state.selectingEndPoint) {
            if (!state.compute) {

                state.compute = true;
                let algoritm = document.querySelector('select').selectedIndex;

                let model = null;
                if (algoritm === 0) {
                    model = new Astar(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
                } else if (algoritm === 1) {
                    model = new Dijkstra(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
                } else {
                    alert('The selected algorithm is not yet implemented. I will use the A* algorithm instead.');
                    model = new Astar(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
                }

                let t0 = performance.now();

                model.solve((tile1, tile2) => {
                    return Math.sqrt(Math.pow(tile1.row - tile2.row, 2) + Math.pow(tile1.column - tile2.column, 2));
                });

                let t2 = performance.now();

                console.log(`The path was calculated in ${(t2 - t0).toPrecision(4)} ms`);
            }
        } else {
            alert('You need to select a start and end point before you can calculate a path. Press the squares in the grid.');
        }
    };
});

function refresh(state, grid) {
    state.reset();
    let z = parseInt(prompt(`How many tiles per side? (min = ${minTileNum}, max = ${maxTileNum})`));
    const N = isNaN(z) || z < minTileNum || z > maxTileNum ? grid.N : z;
    grid.clearGrid();
    grid.createGrid(N, gridWidth, gridHeight);
};

function addMouseEvents(state, grid) {
    for (let i = 0; i < grid.N; i++) {
        for (let j = 0; j < grid.N; j++) {
            const element = grid.grid[i][j].element;
            element.addEventListener('mousedown', e => {
                if (state.selectingStartPoint) {
                    state.selectingStartPoint = false;
                    state.selectingEndPoint = true;
                    let tile = grid.getTile(element);
                    tile.element.style.backgroundColor = startColor;
                    tile.isStart = true;
                    grid.startTile = tile;
                } else if (state.selectingEndPoint) {
                    let tile = grid.getTile(element);
                    if (!tile.isStart) {
                        state.selectingEndPoint = false;
                        tile.element.style.backgroundColor = goalColor;
                        tile.isEnd = true;
                        grid.endTile = tile;
                    }
                } else {
                    if (e.shiftKey) {
                        state.deletingWalls = true;
                        let tile = grid.getTile(element);
                        if (!tile.isStart && !tile.isEnd && !state.compute) {
                            tile.element.style.backgroundColor = '';
                            tile.isWall = false;
                        }
                    } else {
                        state.addingWalls = true;
                        let tile = grid.getTile(element);
                        if (!tile.isStart && !tile.isEnd && !state.compute) {
                            tile.element.style.backgroundColor = wallColor;
                            tile.isWall = true;
                        }
                    }
                }
            });
            element.addEventListener('mouseover', e => {
                if (state.addingWalls) {
                    let tile = grid.getTile(element);
                    if (!tile.isStart && !tile.isEnd && !state.compute) {
                        tile.element.style.backgroundColor = wallColor;
                        tile.isWall = true;
                    }
                } else if (state.deletingWalls) {
                    let tile = grid.getTile(element);
                    if (!tile.isStart && !tile.isEnd && !state.compute) {
                        tile.element.style.backgroundColor = '';
                        tile.isWall = false;
                    }
                }
            });
        }
    }
    window.addEventListener('mouseup', e => {
        state.addingWalls = false;
        state.deletingWalls = false;
    });
}