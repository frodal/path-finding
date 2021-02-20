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
    // Setup state and create grid
    let state = new State();
    let grid = new Grid(startGridSize, gridWidth, gridHeight);
    // add mouse events for adding start point, goal, and handeling wall creation and deletion
    addMouseEvents(state, grid);

    // create a new grid based on user input
    document.getElementById("newGrid").onclick = function () {
        refresh(state, grid);
    };

    // Solve the path finding problem
    document.getElementById("compute").onclick = function () {
        if (state.selectingStartPoint || state.selectingEndPoint) {
            alert('You need to select a start and end point before you can calculate a path. Press the squares in the grid.');
            return
        }
        if (state.compute)
            return

        state.compute = true;

        // setup model based on the selected algorithm
        let algoritm = document.querySelector('select').selectedIndex;
        let model = null;
        switch (algoritm) {
            case 0:
                model = new Astar(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
                break;
            case 1:
                model = new Dijkstra(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
                break;
            default:
                alert('The selected algorithm is not yet implemented. I will use the A* algorithm instead.');
                model = new Astar(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
        }

        // find path using the selected algorithm and time the calculation
        let t0 = performance.now();
        model.solve((tile1, tile2) => {
            return Math.sqrt(Math.pow(tile1.row - tile2.row, 2) + Math.pow(tile1.column - tile2.column, 2));
        });
        let t1 = performance.now();

        console.log(`The path was calculated in ${(t1 - t0).toPrecision(4)} ms`);
    };
});

// create a new grid based on user input
function refresh(state, grid) {
    // get input from user
    let answer = prompt(`How many tiles per side? (min = ${minTileNum}, max = ${maxTileNum})`);
    // return if canceled by user
    if (answer == null)
        return
    // Make sure that the input is valid
    answer = parseInt(answer);
    const N = isNaN(answer) || answer < minTileNum || answer > maxTileNum ? grid.N : answer;
    // reset the path finding state, clear the grid and re-create it using new parameters
    state.reset();
    grid.clearGrid();
    grid.createGrid(N, gridWidth, gridHeight);
    addMouseEvents(state, grid);
};

// add start point and goal, and add or delete walls by bressing individual tiles
function addMouseEvents(state, grid) {
    for (let i = 0; i < grid.N; i++) {
        for (let j = 0; j < grid.N; j++) {
            let tile = grid.grid[i][j]
            tile.element.addEventListener('mousedown', e => {
                if (tile.isStart || tile.isEnd || state.compute)
                    return
                // add start point
                if (state.selectingStartPoint) {
                    state.selectingStartPoint = false;
                    state.selectingEndPoint = true;
                    tile.element.style.backgroundColor = startColor;
                    tile.isStart = true;
                    grid.startTile = tile;
                    // add goal or end point
                } else if (state.selectingEndPoint) {
                    state.selectingEndPoint = false;
                    tile.element.style.backgroundColor = goalColor;
                    tile.isEnd = true;
                    grid.endTile = tile;
                    // add or delete walls
                } else {
                    if (tile.isWall) {
                        state.deletingWalls = true;
                        tile.element.style.backgroundColor = '';
                        tile.isWall = false;
                    } else {
                        state.addingWalls = true;
                        tile.element.style.backgroundColor = wallColor;
                        tile.isWall = true;
                    }
                }
            });
            tile.element.addEventListener('mouseover', e => {
                if (tile.isStart || tile.isEnd || state.compute)
                    return
                // add or delete walls
                if (state.addingWalls) {
                    tile.element.style.backgroundColor = wallColor;
                    tile.isWall = true;
                } else if (state.deletingWalls) {
                    tile.element.style.backgroundColor = '';
                    tile.isWall = false;
                }
            });
        }
    }
    window.addEventListener('mouseup', e => {
        state.addingWalls = false;
        state.deletingWalls = false;
    });
}