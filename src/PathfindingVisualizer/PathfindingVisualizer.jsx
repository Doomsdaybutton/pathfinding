import "bootstrap/bootstrap.min.css";
import "./PathfindingVisualizer.css";
import React from "react";
import Node from "./Node/Node";
import algorithm from "../algorithms/algorithm";

export const COLS = 55,
  ROWS = 25,
  START_NODE_X = 5,
  START_NODE_Y = Math.floor(ROWS / 2),
  FINISH_NODE_X = COLS - START_NODE_X - 1,
  FINISH_NODE_Y = START_NODE_Y,
  VISITED_NODES_ANIMATION_SPEED = 15,
  SHORTEST_PATH_ANIMATION_SPEED = 7;

export default class PathfindingVisualizer extends React.Component {
  constructor() {
    super();
    this.cols = COLS;
    this.rows = ROWS;
    this.state = {
      grid: this.createGrid(this.cols, this.rows),
      isMousePressed: false,
      isAddingWalls: true,
      isVisualizing: false,
      algorithm: "dijkstra",
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.visualizeAlgorithm = this.visualizeAlgorithm.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
  }

  visualizeAlgorithm() {
    const grid = this.clearGrid();
    this.setState({ isVisualizing: true });
    const result = algorithm(this.state.algorithm, grid);
    result.animate();
    setTimeout(() => {
      this.setState({ isVisualizing: false });
    }, result.nodesInVisitedOrder.length * VISITED_NODES_ANIMATION_SPEED + result.shortestPathInOrder.length * SHORTEST_PATH_ANIMATION_SPEED + 20);
  }

  clearGrid() {
    var newGrid = this.state.grid.slice();
    for (let x = 0; x < newGrid.length; x++) {
      for (let y = 0; y < newGrid[0].length; y++) {
        newGrid[x][y].isVisited = false;
        newGrid[x][y].previousNode = null;
        newGrid[x][y].distance = Infinity;
        document.getElementById(`node-${x}-${y}`).className =
          "node " +
          (newGrid[x][y].isWall
            ? "wall"
            : newGrid[x][y].isStart
            ? "start"
            : newGrid[x][y].isFinish
            ? "finish"
            : "");
      }
    }
    this.setState({ grid: newGrid });
    return newGrid;
  }

  createGrid(cols, rows) {
    var grid = new Array(parseInt(cols, 10))
      .fill(null)
      .map(() => new Array(parseInt(rows, 10)).fill(null));
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        grid[x][y] = this.createNode(x, y);
      }
    }
    return grid;
  }

  createNode(x, y, isWall = false) {
    return {
      x,
      y,
      isVisited: false,
      isWall: isWall,
      isStart: x === START_NODE_X && y === START_NODE_Y,
      isFinish: x === FINISH_NODE_X && y === FINISH_NODE_Y,
      distance: Infinity,
      previousNode: null,
    };
  }

  handleMouseDown(x, y, e) {
    var isAddingWalls;
    if (this.state.grid[x][y].isWall) {
      isAddingWalls = false;
    } else {
      isAddingWalls = true;
    }
    var newGrid;
    if (this.state.isVisualizing) {
      newGrid = this.state.grid;
    } else {
      console.log("yay");
      newGrid = this.wall(this.state.grid, x, y, isAddingWalls);
    }

    console.log(newGrid);

    this.setState({
      grid: newGrid,
      isMousePressed: true,
      isAddingWalls: isAddingWalls,
    });

    //prevent drag
    e.preventDefault();
  }

  handleMouseEnter(x, y, e) {
    if (this.state.isMousePressed && !this.state.isVisualizing) {
      this.setState({
        grid: this.wall(this.state.grid, x, y, this.state.isAddingWalls),
      });
    }
  }

  handleMouseUp(e) {
    this.setState({ isMousePressed: false });
  }

  wall(grid, x, y, isAddingWalls) {
    if (grid[x][y].isStart || grid[x][y].isFinish) {
      return grid;
    }
    var newGrid = grid.slice();
    newGrid[x][y].isWall = isAddingWalls;
    return newGrid;
  }

  render() {
    var rows = [];
    for (let y = 0; y < this.rows; y++) {
      var row = [];
      for (let x = 0; x < this.cols; x++) {
        const { isVisited, isWall, isStart, isFinish } = this.state.grid[x][y];
        let currentNode = (
          <Node
            x={x}
            y={y}
            isVisited={isVisited}
            isWall={isWall}
            isStart={isStart}
            isFinish={isFinish}
            onMouseDown={this.handleMouseDown}
            onMouseEnter={this.handleMouseEnter}
            onMouseUp={this.handleMouseUp}
          />
        );
        row.push(<td key={x}>{currentNode}</td>);
      }
      rows.push(<tr key={y}>{row}</tr>);
    }

    let btn_class = "btn btn-large btn-success mt-3 mb-n4";
    var btnDisabled = false;
    if (this.state.isVisualizing) {
      btnDisabled = true;
    }

    return (
      <>
        <div className="container text-center">
          <button
            className={btn_class}
            onClick={this.visualizeAlgorithm}
            disabled={btnDisabled}
          >
            Visualize Dijkstra's Algorithm!
          </button>
        </div>
        <div className="d-flex justify-content-center mt-5">
          <table className="grid">
            <tbody>{rows}</tbody>
          </table>
        </div>
      </>
    );
  }
}
