// State class


export default class State {
    constructor() {
        this.reset();
    }

    reset() {
        this.selectingStartPoint = true;
        this.selectingEndPoint = false;

        this.addingWalls = false;
        this.deletingWalls = false;

        this.compute = false;
    }
}