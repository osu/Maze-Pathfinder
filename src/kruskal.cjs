const fs = require("fs");
let maze = [];
let output = "";
let count = 3;
let edges = [];

var methods = {
  genMaze: function (size) {
    maze = [];
    output = "";
    count = 3;
    edges = [];

    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        if (i == 0) {
          if (j == 1) row.push(0);
          else row.push(1);
        } else if (i == size - 1) {
          if (j == size - 2) row.push(0);
          else row.push(1);
        } else if (i % 2 == 0) {
          if (j == 0 || j == size - 1) row.push(1);
          else {
            let v = Math.abs((j % 2) - 2);
            if (v == 1) {
              row.push(v);
              edges.push({ i: i, j: j });
            } else if (v == 2) {
              row.push(v);
            } else {
              row.push(count);
              count++;
            }
          }
        } else {
          let v = Math.abs((j % 2) - 1);
          if (v == 1) {
            row.push(v);
            edges.push({ i: i, j: j });
          } else if (v == 2) {
            row.push(v);
          } else {
            row.push(count);
            count++;
          }
        }
      }
      maze.push(row);
    }

    edges.sort(() => Math.random() - 0.5);

    while (edges.length != 0) {
      let e = edges.pop();
      if (maze[e.i - 1][e.j] > 2) {
        let low;
        let max;
        if (maze[e.i - 1][e.j] != maze[e.i + 1][e.j]) {
          low = Math.min(maze[e.i - 1][e.j], maze[e.i + 1][e.j]);
          max = Math.max(maze[e.i - 1][e.j], maze[e.i + 1][e.j]);
          maze[e.i][e.j] = low;
          for (let x = 0; x < size; x++)
            for (let y = 0; y < size; y++)
              if (maze[x][y] == max) maze[x][y] = low;
        }
      } else {
        let low;
        let max;
        if (maze[e.i][e.j - 1] != maze[e.i][e.j + 1]) {
          low = Math.min(maze[e.i][e.j - 1], maze[e.i][e.j + 1]);
          max = Math.max(maze[e.i][e.j - 1], maze[e.i][e.j + 1]);
          maze[e.i][e.j] = low;
          for (let x = 0; x < size; x++)
            for (let y = 0; y < size; y++)
              if (maze[x][y] == max) maze[x][y] = low;
        }
      }
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let v = maze[i][j];
        if (maze[i][j] == 2) {
          if (
            maze[i - 1][j] == 3 &&
            maze[i][j - 1] == 3 &&
            maze[i + 1][j] == 3 &&
            maze[i][j + 1] == 3
          )
            v = 3;
          else v = 1;
        }
        if (v == 3) {
          v = 0;
        } else if (isNaN(v)) v = 1;
        output += v;
      }
      output += "\n";
    }

    return output;
  },
};

exports.data = methods;