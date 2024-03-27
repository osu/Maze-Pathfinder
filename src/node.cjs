class Node {
    constructor(X, Y, W, P) {
        this.x = X;
        this.y = Y;
        this.weight = W;
        this.parent = P;
    }

    compare(node) {
        if (this.x == node.x && this.y == node.y) return true;
        return false;
    }
}

module.exports = Node;
