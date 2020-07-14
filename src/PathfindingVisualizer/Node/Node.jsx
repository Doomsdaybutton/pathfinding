import "bootstrap/bootstrap.min.css";
import React from "react";
import "./Node.css";

export default class Node extends React.Component {
  render() {
    const {
      x,
      y,
      isVisited,
      isWall,
      isStart,
      isFinish,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;
    return (
      <div
        id={`node-${x}-${y}`}
        className={
          "node " +
          (isWall ? "wall" : isStart ? "start" : isFinish ? "finish" : "")
        }
        onMouseDown={onMouseDown.bind(this, x, y)}
        onMouseEnter={onMouseEnter.bind(this, x, y)}
        onMouseUp={onMouseUp.bind(this, x, y)}
        onDragEnd={onMouseUp}
        onDragStart={() => {
          return false;
        }}
        onDrop={() => {
          return false;
        }}
      ></div>
    );
  }
}
