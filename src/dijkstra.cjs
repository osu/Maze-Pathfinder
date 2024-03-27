const TinyQueue = require("tinyqueue");
const Node = require("./node.cjs");

var methods = {
  dijkstraCalculateMaze: function (maze, start, end, weightFunction) {
    if (!maze || !Array.isArray(maze) || maze.length === 0) {
      throw new Error("Invalid maze parameter");
    }

    var open = new TinyQueue(
      [new Node(start.x, start.y, 0, { x: -1, y: -1 })],
      function (a, b) {
        return a.weight - b.weight;
      }
    );

    var closed = new TinyQueue([], function (a, b) {
      return a.weight - b.weight;
    });

    var current = open.peek();

    while (!(current.x == end.x && current.y == end.y)) {
      current = open.pop();
      var neighbors = getNeighbors(maze, current);

      for (var i = 0; i < neighbors.length; i++) {
        var neighborNode = neighbors[i];
        var newNode = new Node(
          neighborNode.x,
          neighborNode.y,
          current.weight + weightFunction(current, neighborNode),
          current
        );

        if (!pqContains(open, newNode) && !pqContains(closed, newNode)) {
          open.push(newNode);
        }
      }

      closed.push(current);
    }

    var path = [];
    var step = pqGet(closed, end.x, end.y);

    while (!(step.x == start.x && step.y == start.y)) {
      path.push(step);
      step = pqGet(closed, step.parent.x, step.parent.y);
    }

    return path;
  },

  getWeight: function (node, end) {
    return 1 + node.weight;
  },
};

function getNeighbors(maze, current) {
  if (!current) {
    return [];
  }

  var neighbors = [];
  var final = [];

  neighbors.push({ x: current.x, y: current.y - 1 });
  neighbors.push({ x: current.x + 1, y: current.y });
  neighbors.push({ x: current.x - 1, y: current.y });
  neighbors.push({ x: current.x, y: current.y + 1 });

  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (
      neighbor.x >= 0 &&
      neighbor.x < maze.length &&
      neighbor.y >= 0 &&
      neighbor.y < maze[0].length &&
      maze[neighbor.x][neighbor.y] == 0
    ) {
      final.push(neighbor);
    }
  }

  return final;
}

function pqContains(pq, node) {
  var items = pq.data;
  for (var i = 0; i < items.length; i++) {
    if (items[i].compare(node)) return true;
  }
  return false;
}

function pqGet(pq, x, y) {
  var items = pq.data;
  for (var i = 0; i < items.length; i++) {
    if (items[i].x == x && items[i].y == y) return items[i];
  }
}

exports.data = methods;