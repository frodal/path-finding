// Path finder base class


export default class PathFinder {
    constructor(grid, pathColor, closestColor, visualizeColor, shouldVisualize, visualizationDelay, visualizationTime) {
        this.grid = grid;

        this.shouldVisualize = shouldVisualize;
        this.visualizationTime = visualizationTime;
        this.visualizationDelay = visualizationDelay;

        this.pathColor = pathColor;
        this.closestColor = closestColor;
        this.visualizeColor = visualizeColor;

        this.openSetList = [];
        this.closedSetList = [];
    }

    breakTies(current, neighbour) {
        // Ads a small penalty to the priority of a tile in the min heap, to promote nicer looking paths
        // This will distinguishes paths with the same path length
        if (((current.column + current.row) % 2 === 0 && current.column !== neighbour.column) ||
            ((current.column + current.row) % 2 === 1 && current.row !== neighbour.row))
            return 0.001;
        return 0;
    }

    // get the closest tile in set to goal based on the distance function
    getClosest(set, goal, distance) {
        let next = null;
        let nextDistance = Infinity;
        for (let item of set.values()) {
            let itemDistance = distance(item, goal);
            if (itemDistance < nextDistance) {
                next = item;
                nextDistance = itemDistance;
            }
        }
        return next;
    }

    // visualizes the path finding algorithm based on the tiles in the open set
    async visualize(i = 0) {
        let length = this.closedSetList.length; // closedSetList and openSetList have the same length
        let stride = Math.ceil(length * this.visualizationDelay / this.visualizationTime);
        let start = i * stride;
        let end = Math.min((i + 1) * stride, length);

        for (let index = start; index < end; index++) {
            for (let item of this.openSetList[index].values()) {
                if (!item.isEnd) {
                    item.element.style.backgroundColor = this.visualizeColor;
                }
            }
        }
        for (let index = start; index < end; index++) {
            let item = this.closedSetList[index];
            if (!item.isStart) {
                item.element.style.backgroundColor = '';
            }
        }

        if (end < length) {
            setTimeout(() => {
                this.visualize(i + 1);
            }, this.visualizationDelay);
        }
        else {
            this.tracePath();
        }
    }

    // displays the path calculated
    tracePath() {
        let previous = this.goal.cameFromTile;
        if (!this.goal.isEnd) {
            this.goal.element.style.backgroundColor = this.closestColor;
        }
        while (previous.pathCostToTile !== 0) {
            previous.element.style.backgroundColor = this.pathColor;
            previous = previous.cameFromTile;
        }
    }
}
