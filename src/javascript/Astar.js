// A* path finding algorithm, see: https://en.wikipedia.org/wiki/A*_search_algorithm

import PathFinder from './PathFinder.js';
import MinHeap from './MinHeap.js';


export default class Astar extends PathFinder {
    constructor(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime) {
        super(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
    }

    solve(estDistance) {
        let openSet = new MinHeap();
        let closedSet = new Set();
        this.openSetList.length = 0;
        this.closedSetList.length = 0;

        let startTile = this.grid.startTile;
        let endTile = this.grid.endTile;

        startTile.pathCostToTile = 0;
        let priority = estDistance(startTile, endTile);
        openSet.add(startTile, priority);

        while (openSet.size > 0) {
            let current = openSet.pop();
            if (current === endTile) {
                this.goal = current;
                if (this.shouldVisualize) {
                    this.visualize();
                } else {
                    this.tracePath()
                }
                return true;
            }
            let neighbours = this.grid.getNeighbourTiles(current);
            let newOpenSet = new Set();
            for (let i = 0; i < neighbours.length; i++) {
                const neighbour = neighbours[i];
                let tentativePathCostToTile = current.pathCostToTile + 1;
                if (tentativePathCostToTile < neighbour.pathCostToTile) {
                    neighbour.cameFromTile = current;
                    neighbour.pathCostToTile = tentativePathCostToTile;
                    priority = tentativePathCostToTile + estDistance(neighbour, endTile);
                    priority += this.breakTies(current, neighbour);
                    openSet.add(neighbour, priority);
                    newOpenSet.add(neighbour);
                    closedSet.delete(neighbour);
                }
            }
            closedSet.add(current);
            this.openSetList.push(newOpenSet);
            this.closedSetList.push(current);
        }

        this.goal = this.getClosest(closedSet, endTile, estDistance);
        if (!this.goal.isStart)
            if (this.shouldVisualize) {
                this.visualize();
            } else {
                this.tracePath()
            }
        return false;
    }

}