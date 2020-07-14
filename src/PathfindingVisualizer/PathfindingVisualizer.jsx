import "bootstrap/bootstrap.min.css";
import "./PathfindingVisualizer.css";
import React from "react";
import Node from "./Node/Node";
import algorithm from "../algorithms/algorithm";

//X and Y values are just the initial values
const START_NODE_X = 4,
  START_NODE_Y = 9,
  FINISH_NODE_X = 25,
  FINISH_NODE_Y = 9,
  COLS = 30,
  ROWS = 19;

export const VISITED_NODES_ANIMATION_SPEED = 10,
  SHORTEST_PATH_ANIMATION_SPEED = 5;

export default class PathfindingVisualizer extends React.Component {
  constructor() {
    super();
    this.cols = COLS;
    this.rows = ROWS;
    this.state = {
      grid: null,
      isMousePressed: false,
      isAddingWalls: true,
      isVisualizing: false,
      algorithm: "dijkstra",
      dragNode: null,
      startNode: { x: START_NODE_X, y: START_NODE_Y },
      finishNode: { x: FINISH_NODE_X, y: FINISH_NODE_Y },
      replaceDragNodeWithWall: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.visualizeAlgorithm = this.visualizeAlgorithm.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.dragNode = this.dragNode.bind(this);
  }

  componentWillMount() {
    this.setState({ grid: this.createGrid(this.cols, this.rows) });
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

  //Clears the Grid for a new Visualization. Doesn't remove walls
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

  //Completely clears the board.
  clearBoard() {
    this.clearGrid();
    this.setState({ grid: this.createGrid(COLS, ROWS) });
  }

  createGrid(cols, rows) {
    var grid = new Array(parseInt(cols, 10))
      .fill(null)
      .map(() => new Array(parseInt(rows, 10)).fill(null));
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        console.log(this);
        grid[x][y] = this.createNode(x, y);
      }
    }
    return grid;
  }

  createNode(x, y) {
    const { startNode, finishNode } = this.state;
    return {
      x,
      y,
      isVisited: false,
      isWall: false,
      isStart: x === startNode.x && y === startNode.y,
      isFinish: x === finishNode.x && y === finishNode.y,
      distance: Infinity,
      previousNode: null,
    };
  }

  handleMouseDown(x, y, e) {
    const grid = this.state.grid;
    const node = grid[x][y];

    if (node.isStart || node.isFinish) {
      //Drag Start- / Finish-Node
      console.log("Drag!");
      this.setState({ dragNode: node.isStart ? "start" : "finish" });
    } else {
      //Add / Subtract Walls
      var isAddingWalls, newGrid;
      if (node.isWall) {
        isAddingWalls = false;
      } else {
        isAddingWalls = true;
      }
      if (this.state.isVisualizing) {
        newGrid = grid;
      } else {
        newGrid = this.wall(grid, x, y, isAddingWalls);
      }

      this.setState({
        grid: newGrid,
        isMousePressed: true,
        isAddingWalls: isAddingWalls,
      });
    }

    //prevent awful drag
    e.preventDefault();
  }

  handleMouseEnter(x, y, e) {
    const {
      dragNode,
      grid,
      isMousePressed,
      isVisualizing,
      isAddingWalls,
    } = this.state;
    if (dragNode != null) {
      this.dragNode(dragNode, x, y);
    }
    if (isMousePressed && !isVisualizing) {
      this.setState({
        grid: this.wall(grid, x, y, isAddingWalls),
      });
    }
  }

  handleMouseUp(x, y, e) {
    const { dragNode } = this.state;
    if (dragNode != null) {
      this.dragNode(dragNode, x, y);
    }
    this.setState({ isMousePressed: false, dragNode: null });
  }

  dragNode(dragNode, x2, y2) {
    const isStart = dragNode == "start";
    const { x, y } = isStart ? this.state.startNode : this.state.finishNode;
    const newGrid = this.state.grid.slice();
    if (this.state.replaceDragNodeWithWall) {
      newGrid[x][y].isWall = true;
      this.setState({ replaceDragNodeWithWall: false });
    }
    if (newGrid[x2][y2].isWall) {
      this.setState({ replaceDragNodeWithWall: true });
      newGrid[x2][y2].isWall = false;
    }
    if (isStart) {
      newGrid[x][y].isStart = false;
      newGrid[x2][y2].isStart = true;
      this.setState({ startNode: { x: x2, y: y2 } });
    } else {
      newGrid[x][y].isFinish = false;
      newGrid[x2][y2].isFinish = true;
      this.setState({ finishNode: { x: x2, y: y2 } });
    }
    //this.setState({ grid: newGrid });
    this.previewAlgorithm();
  }

  previewAlgorithm() {
    const grid = this.clearGrid();
    const result = algorithm(this.state.algorithm, grid);
    result.animate(true);
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
          <button
            className="btn btn-danger btn-large mt-3 mb-n4 ml-3"
            onClick={this.clearBoard}
            disabled={btnDisabled}
          >
            Clear Board
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
