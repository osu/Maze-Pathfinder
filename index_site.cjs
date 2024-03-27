const fs = require("fs");
const dijkstra = require("./src/dijkstra.cjs");
const astar = require("./src/astar.cjs");
const generator = require("./src/kruskal.cjs");
const express = require("express");
const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/generate", (req, res) => {
  const size = parseInt(req.query.size) || 99  ; // Get the size from the query parameter or default to 51

  // Delete existing maze.txt and path.txt files
  const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };

  deleteFile("maze.txt");
  deleteFile("path.txt");

  const maze = generator.data.genMaze(size);
  fs.writeFile("maze.txt", maze, (err) => {
    if (err) throw err;
    res.send(maze);
  });
});

app.get("/solve", (req, res) => {
  const size = parseInt(req.query.size) || 99 ; // Get the size from the query parameter or default to 51
  readMaze(size, (solvedMaze) => {
    res.send(solvedMaze);
  });
});

function readMaze(size, callback) {
  if (fs.existsSync("maze.txt")) {
    var maze = [];
    fs.readFile("maze.txt", "utf-8", (err, data) => {
      // converting file to string data
      if (err) throw err;
      var array = [];
      for (var i = 0; i < data.length; i++) {
        if (data.charAt(i) == "\n") {
          maze.push(array);
          array = [];
        } else {
          if (data.charAt(i) != "\r") {
            array.push(data.charAt(i));
          }
        }
      }
      maze.push(array);
      var test = function (err) {
        if (err) throw err;
        const path = dijkstra.data.dijkstraCalculateMaze(
          maze,
          { x: 0, y: 1 },
          { x: size - 1, y: size - 2 },
          astar.data.getWeight
        );
        const pathString = path.map(coord => `${coord.x},${coord.y}`).join('\n');
        fs.writeFile("path.txt", pathString, (err) => {
          if (err) throw err;
          for (let i = 0; i < path.length; i++) {
            const { x, y } = path[i];
            if (x >= 0 && x < maze.length && y >= 0 && y < maze[x].length) {
              maze[x][y] = "P";
            }
          }
          if (maze[0] && maze[0][1]) {
            maze[0][1] = "S";
          }
          if (maze[size - 1] && maze[size - 1][size - 2]) {
            maze[size - 1][size - 2] = "E";
          }
          const solvedMaze = maze.map((row) => row.join("")).join("\n");
          callback(solvedMaze);
        });
      };
      test();
    });
  } else {
    callback("Maze not found. Please generate a maze first.");
  }
}

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000/index.html");
});