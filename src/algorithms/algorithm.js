import React from "react";
import {
  VISITED_NODES_ANIMATION_SPEED,
  SHORTEST_PATH_ANIMATION_SPEED,
} from "../PathfindingVisualizer/PathfindingVisualizer";
import dijkstra from "./dijkstra";

export default function algorithm(type, grid) {
  switch (type) {
    case "dijkstra":
      return dijkstra(grid);
      break;
    default:
      break;
  }
}

export function AlgorithmResult(
  nodesInVisitedOrder,
  shortestPathInOrder,
  isSuccessful = true
) {
  this.nodesInVisitedOrder = nodesInVisitedOrder;
  this.shortestPathInOrder = shortestPathInOrder;
  this.isSuccessful = isSuccessful;
  this.animateShortestPathInOrder = this.animateShortestPathInOrder.bind(this);
}

AlgorithmResult.prototype.animate = function (isPreview = false) {
  if (!this.isSuccessful) {
    //alert("unsuccessful");
  }
  this.animateVisitedNodesInOrder(isPreview);
  setTimeout(
    this.animateShortestPathInOrder.bind(this, isPreview),
    isPreview
      ? 0
      : this.nodesInVisitedOrder.length * VISITED_NODES_ANIMATION_SPEED + 10
  );
};

AlgorithmResult.prototype.animateVisitedNodesInOrder = function (
  isPreview = false
) {
  for (let i = 0; i < this.nodesInVisitedOrder.length; i++) {
    if (isPreview) {
      document.getElementById(
        `node-${this.nodesInVisitedOrder[i].x}-${this.nodesInVisitedOrder[i].y}`
      ).className += " visited";
    } else {
      //Timeout is i * ANIMATION_SPEED. See: https://coderwall.com/p/_ppzrw/be-careful-with-settimeout-in-loops
      setTimeout(() => {
        document.getElementById(
          `node-${this.nodesInVisitedOrder[i].x}-${this.nodesInVisitedOrder[i].y}`
        ).className += " visited";
      }, i * VISITED_NODES_ANIMATION_SPEED);
    }
  }
};

AlgorithmResult.prototype.animateShortestPathInOrder = function (
  isPreview = false
) {
  console.log("animate shortest path");
  for (let i = 0; i < this.shortestPathInOrder.length; i++) {
    if (isPreview) {
      document.getElementById(
        `node-${this.shortestPathInOrder[i].x}-${this.shortestPathInOrder[i].y}`
      ).className += " path";
    } else {
      setTimeout(() => {
        document.getElementById(
          `node-${this.shortestPathInOrder[i].x}-${this.shortestPathInOrder[i].y}`
        ).className += " path";
      }, i * SHORTEST_PATH_ANIMATION_SPEED);
    }
  }
};
