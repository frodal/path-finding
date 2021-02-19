// A min heap priority queue implementation, inspired by the max heap implementation of https://codeburst.io/how-to-create-a-priority-queue-with-javascript-c56a970f29a8


const leftChild = (index) => index * 2 + 1;
const rightChild = (index) => index * 2 + 2;
const parent = (index) => Math.floor((index - 1) / 2);


class QueueElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}


export default class MinHeap {
    constructor() {
        // constructs the underlying array
        this.heap = [];
    }

    get size() {
        // this is the size/length of the heap
        return this.heap.length;
    }

    swap(firstIndex, secondIndex) {
        // swaps the two elements at the two indexes of the heap array
        const temp = this.heap[firstIndex];
        this.heap[firstIndex] = this.heap[secondIndex];
        this.heap[secondIndex] = temp;
    }

    peek() {
        // returns the queue element with the minimum priority
        return this.heap[0].element;
    }

    add(element, priority = element) {
        // creates a priority queue element and adds it to the heap
        // if no priority is given, the value of the element is its priority
        const Item = new QueueElement(element, priority);
        // push element to the end of the heap
        this.heap.push(Item);
        // the index of the element just pushed
        let index = this.size - 1;
        // if the element has less priority than its parent: swap element with its parent
        while (index !== 0 && this.heap[index].priority < this.heap[parent(index)].priority) {
            this.swap(index, parent(index));
            index = parent(index);
        }
    }

    pop() {
        // get the first queue element from the heap
        const root = this.peek();
        // put the last element to the front of the heap
        this.heap[0] = this.heap[this.size - 1];
        // remove the last element from the heap as it now sits at the front of the heap
        this.heap.pop();
        // correctly re-position the heap
        this.heapify();
        // return the first element of the heap
        return root;
    }

    heapify(index = 0) {
        let left = leftChild(index);
        let right = rightChild(index);
        let smallest = index;

        // if the left childs priority is smaller than the node we are looking at
        if (left < this.size && this.heap[smallest].priority > this.heap[left].priority) {
            smallest = left;
        }

        // if the right childs priority is smaller than the node we are looking at
        if (right < this.size && this.heap[smallest].priority > this.heap[right].priority) {
            smallest = right;
        }

        // if the value of smallest has changed, then some swapping needs to be done
        // and this method needs to be called again with the swapped element
        if (smallest != index) {
            this.swap(smallest, index);
            this.heapify(smallest);
        }
    }
}