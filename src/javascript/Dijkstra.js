// Dijkstra's path finding algorithm, see: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm

import PathFinder from './PathFinder.js';


export default class Dijkstra extends PathFinder {
    constructor(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime) {
        super(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime);
    }

    solve(estDistance) {
        // TODO: optimize: use a priority queue?
        let openSet = new Set();
        let closedSet = new Set();
        this.openSetList.length = 0;
        this.closedSetList.length = 0;

        let startTile = this.grid.startTile;
        let endTile = this.grid.endTile;

        openSet.add(startTile);
        startTile.pathCostToTile = 0;

        while (openSet.size > 0) {
            let current = this.getNextSet(openSet);
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
            for (let i = 0; i < neighbours.length; i++) {
                const neighbour = neighbours[i];
                let tentativePathCostToTile = current.pathCostToTile + 1;
                if (tentativePathCostToTile < neighbour.pathCostToTile) {
                    neighbour.cameFromTile = current;
                    neighbour.pathCostToTile = tentativePathCostToTile;
                    if (!openSet.has(neighbour)) {
                        openSet.add(neighbour);
                        closedSet.delete(neighbour);
                    }
                }
            }
            closedSet.add(current);
            openSet.delete(current);
            this.openSetList.push(new Set(openSet));
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

    getNextSet(openSet) {
        let next = null;
        let cost = Infinity;
        for (let item of openSet.values()) {
            if (item.pathCostToTile < cost) {
                next = item;
                cost = item.pathCostToTile;
            }
        }
        return next;
    }

}