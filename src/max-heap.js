//all is done 100%

const Node = require('./node');

class MaxHeap {
	
	constructor() {
		this.root = null;
		this.queue = 0;
		this.parentNodes = [];
		this.supportNodes = [];
		this.sizeOf = 0;
		this.lastInsertedNode = null;
		this.currentNode = null;
		this.counter = 0;
		this.insertCounter = 0;
	}

	push(data, priority) {
		let node = new Node (data, priority);
		this.insertNode(node);
		for (var i = 0; i < this.supportNodes.length; i++) {
			this.parentNodes[i] = this.supportNodes[i];
		}
		this.root = this.parentNodes[0];
		if (this.queue == 0) {
			this.shiftNodeUp(node);
		}
	}

	pop() {
		if (this.root != null) {
			var tempRoot = this.detachRoot();
			this.restoreRootFromLastInsertedNode(tempRoot);
			if (this.root != null && this.queue == 0) {
				this.shiftNodeDown(this.root);
			}
			this.sizeOf--;
			return tempRoot.data;
		}
	}

	detachRoot() {
		let root = this.root;
		this.root = null;
		return root;
	}

	restoreRootFromLastInsertedNode(detached) {
		this.parentNodes.shift();
		if (this.parentNodes.length != 0 && this.queue == 0) {
			let root = detached;
			let lastInsertedNode = this.parentNodes.pop();
			this.root = lastInsertedNode;
			if (this.root.left != null) {
				this.parentNodes[0] = this.root;
				this.parentNodes[1] = this.root.left;
			} else if (this.parentNodes.length != 0) {
				this.parentNodes.unshift(lastInsertedNode);
				this.root.left = this.parentNodes[1];
				this.root.left.parent = lastInsertedNode;
			}
			return this.root;
		} else if (this.parentNodes.length != 0 && this.queue != 0) {
			let root = detached;
			let supportData = [];
			let supportPriority = [];
			for (var i = 0; i < this.parentNodes.length; i++) {
				supportData[i] = this.parentNodes[i].data;
				supportPriority[i] = this.parentNodes[i].priority;
			}
			this.parentNodes = [];
			this.supportNodes = [];
			for (var i = 0; i < supportData.length; i++) {
				this.push(supportData[i],supportPriority[i]);
				this.sizeOf--;
			}
			this.root = this.parentNodes[0];
			return this.root;
		}	
	}

	size() { 
		return this.sizeOf;
	}

	isEmpty() {
		if (this.root == null) {
			return true;
		} else {
			return false;
		}
	}

	clear() {
		this.root = null;
		this.queue = 0;
		this.parentNodes = [];
		this.supportNodes = [];
		this.sizeOf = 0;
		this.lastInsertedNode = null;
		this.currentNode = null;
		this.insertCounter = null;
		this.counter = 0;
	}

	insertNode(node) {
		this.findCurrentNode();
		if (this.sizeOf == 0) {
			node.parent = null;
			node.left = null;
			node.right = null;
			this.root = node;
			this.parentNodes.push(node);
			this.supportNodes.push(node);
		} else {
			this.parentNodes.push(node);
			this.supportNodes.push(node);
			this.appendNode(node);
			this.parentNodes[0].parent = null;
			this.supportNodes[0].parent = null;
		}
		this.lastInsertedNode = this.parentNodes[this.parentNodes.length-1];
		this.sizeOf++;
		if ((this.insertCounter%2) == 0 && this.insertCounter != 0) {
			this.parentNodes.shift();
		}
		this.insertCounter++;
	}

	shiftNodeUp(node) {
		if (this.root != node) {
			if (node.parent != this.root && node.parent != null && node.parent.parent != null && node.parent.parent.right != null) {
				let right = this.root.right;
				node.swapWithParent();
				let parent = node.parent;
				parent.left = null;
				parent.parent = node;
				node.left = parent;
				node.parent = this.root;
				this.root.left = node;
				this.root.right = right;
				this.shiftNodeUp(node);
			} else if (node.parent == this.root && node.left != null && node.parent.right != null) {
				let left = node.left;
				node.swapWithParent();
				let parent = this.root;
				parent.left = left;
				parent.left.parent = parent;
				parent.right = null;
				node.right.parent = node;
				node.parent = null;
				node.left.parent = node;
				node.left = parent;
				this.root = node;
				this.parentNodes[2] = this.parentNodes[0];
				this.parentNodes[0] = this.root.left;
				this.shiftNodeUp(node);
			}
		}
	}

	shiftNodeDown(node) {
		if (node.left != null) {
			if (node.right != null && node.right.priority > node.left.priority && node.right.priority <= node.priority) {
				if (this.root == node) {
					let parent = node;
					this.root = this.root.right;
					this.root.parent = null;
					this.root.right = null;
					this.root.left = parent.left;
					this.root.left.parent = this.root;
					this.root.left.left.parent = this.root.left;
				}
				node.right.swapWithParent();
				this.shiftNodeDown(this.root);
			}
			if (node.priority < node.left.priority) {
				if (node.left.left != null && node.parent == null) {
					node.left.swapWithParent();
					let parent = this.root.left.parent;
					parent.left = this.root;
					parent.right = this.root.right;
					parent.parent = null;
					let root = this.root;
					root.left = this.root.left; 
					root.right = null;
					root.parent = parent;
					this.root.left.parent = root;
					this.root = parent;
					this.root.right.parent = this.root;
					this.root.left = root;
					this.shiftNodeDown(root);
				} else if (node.left.left == null && node.parent != null && node.parent.parent == null) {
					let right = this.root.right;
					node.left.swapWithParent();
					let parent = node.left;
					parent.left = node;
					parent.right = node.right;
					parent.parent = this.root;
					let root = node;
					root.left = null; 
					root.right = null;
					root.parent = parent;
					this.root.left = parent;
					this.root.right = right;
					this.root.left.left = root;
					this.parentNodes[0] = this.root.left;
					this.parentNodes[1] = this.root.right;
					this.parentNodes[2] = this.root.left.left;
					this.shiftNodeDown(root);
				}
			}
		}
	}

	appendNode(node) {
		this.parentNodes[this.parentNodes.length-1].parent = null;
		for (var i = 0; i < this.parentNodes.length; i++) {
			if (this.parentNodes[i] == this.currentNode) {
				if (this.counter == 0 ) {
					this.parentNodes[i].left = null;
					this.counter += 2;
				} else if (this.counter == 1 || this.counter == 2) {
					if (this.counter == 1) {
						this.parentNodes[i].left = null;
						this.counter += 2;
					} else if (this.counter == 2) {
						this.parentNodes[i].left.left = null;
						this.parentNodes[i].right = null;
						this.counter++;
					}
				} else {
					this.findCurrentNode();
					this.appendNode(node);
					break;
				}
				if (this.parentNodes[i].left == null) {
					for (var j = 0; j < this.parentNodes.length; j++) {
						if (this.parentNodes[j].parent == null && j != 0) {
							this.parentNodes[i].left = this.parentNodes[j];
							this.parentNodes[j].parent = this.parentNodes[i];
							break;
						}
					}
					break;
				} else if (this.parentNodes[i].right == null ) {
					for (var k = 0; k < this.parentNodes.length; k++) {
						if (this.parentNodes[k].parent == null && k != 0) {
							this.parentNodes[i].right = this.parentNodes[k];
							this.parentNodes[k].parent = this.parentNodes[i];
							break;
						}
					}
					break;
				}
			}
		}
	}

	findCurrentNode() {
		if (this.sizeOf != 0) {
			for (var i = 0; i < this.parentNodes.length; i++) {
				if (this.parentNodes[i].left == null && this.parentNodes[i].right == null) {
					this.currentNode = this.parentNodes[i];
					this.counter = 0;
					break;
				} else if (this.parentNodes[i].left == null && this.parentNodes[i].right != null) {
					this.currentNode = this.parentNodes[i];
					this.counter = 1;
					break;
				} else if (this.parentNodes[i].left != null && this.parentNodes[i].right == null) {
					this.currentNode = this.parentNodes[i];
					this.counter = 2;
					break;
				}
			}
		} else {
			this.currentNode = null;
		}
	}
}

module.exports = MaxHeap;
