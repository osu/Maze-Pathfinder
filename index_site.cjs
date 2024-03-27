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
  // Delete existing maze.txt and path.txt files
  const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };

  deleteFile("maze.txt");
  deleteFile("path.txt");

  const maze = generator.data.genMaze();
  fs.writeFile("maze.txt", maze, (err) => {
    if (err) throw err;
    res.send(maze);
  });
});

app.get("/solve", (req, res) => {
  readMaze((solvedMaze) => {
    res.send(solvedMaze);
  });
});

function readMaze(callback) {
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
        fs.readFile("path.txt", "utf-8", (err, pathData) => {
          if (err) throw err;
          const path = pathData.split("\n").map((row) => row.split(""));
          for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[i].length; j++) {
              if (path[i] && (path[i][j] === "S" || path[i][j] === "E" || path[i][j] === "P")) {
                maze[i][j] = path[i][j];
              }
            }
          }
          const solvedMaze = maze.map((row) => row.join("")).join("\n");
          callback(solvedMaze);
        });
      };
      fs.writeFile(
        "path.txt",
        dijkstra.data.dijkstraCalculateMaze(
          maze,
          { x: 0, y: 1 },
          { x: 50, y: 49 },
          astar.data.getWeight
        ),
        (err) => test(err)
      ); // calculate best path
    });
  } else {
    callback("Maze not found. Please generate a maze first.");
  }
}

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000/index.html");
});