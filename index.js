const Queue = require('./src/queue');
const MaxHeap = require('./src/max-heap');
const Node = require('./src/node');
const h = new MaxHeap();
const node = new Node (12,50);
const q = new Queue();
window.h = h;

h.push(42, 15);
h.push(14, 32);
h.push(0, 0);
