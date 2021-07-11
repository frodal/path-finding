// Dijkstra's path finding algorithm, see: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm

import PathFinder from './PathFinder.js';
import MinHeap from './MinHeap.js';


export default class Dijkstra extends PathFinder {

    // find a path from start to goal/end using the Dijkstra's path finding algorithm
    solve(estDistance) {
        let openSet = new MinHeap();
        let closedSet = new Set();
        this.openSetList.length = 0;
        this.closedSetList.length = 0;

        let startTile = this.grid.startTile;
        let endTile = this.grid.endTile;

        startTile.pathCostToTile = 0;
        let priority = 0;
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
                    priority = tentativePathCostToTile;
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