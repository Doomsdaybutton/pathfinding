// Dijkstra's Algorithm
// Wikipedia: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm (Deutsch: https://de.wikipedia.org/wiki/Dijkstra-Algorithmus)

import { AlgorithmResult } from "./algorithm";

export default function dijkstra(grid) {
  console.log("↓↓GRID↓↓");
  console.log(grid);
  console.log("↑↑GRID↑↑");

  //Distance to every node is set to Infinity apart from the Startnode, which has a distance of 0.
  getStartNode(grid).distance = 0;

  var unvisitedNodes = getUnvisitedNodes(grid);
  const nodesInVisitedOrder = [];
  while (!!unvisitedNodes.length) {
    //Set the currentNode to isVisited = true
    sortNodesByDistance(unvisitedNodes);
    const currentNode = unvisitedNodes.shift();

    //Skip Walls
    if (currentNode.isWall) continue;

    //If the distance is Infinity we're trapped
    if (currentNode.distance === Infinity)
      return new AlgorithmResult(nodesInVisitedOrder, [], false);

    //Append currentNode to nodesInVisitedOrder
    currentNode.isVisited = true;
    nodesInVisitedOrder.push(currentNode);

    //If currentNode is the finishNode we're finished!
    if (currentNode.isFinish) {
      return new AlgorithmResult(
        nodesInVisitedOrder,
        getShortestPath(nodesInVisitedOrder),
        true
      );
    }

    //Update / Recalculate the distance of the unvisitedNeighbours and set their previousNode to the currentNode
    const unvisitedNeighbours = getUnvisitedNeighbours(grid, currentNode);
    console.log(unvisitedNeighbours);
    updateNeighboursDistanceAndSetPreviousNode(
      currentNode,
      unvisitedNeighbours
    );
  }
  return new AlgorithmResult(nodesInVisitedOrder, [], false);
}

function getStartNode(grid) {
  for (let col of grid) {
    for (let node of col) {
      if (node.isStart) {
        return node;
      }
    }
  }
}

function getUnvisitedNodes(grid) {
  var unvisitedNodes = [];
  for (let col of grid) {
    for (let node of col) {
      if (!node.isVisited) {
        unvisitedNodes.push(node);
      }
    }
  }
  return unvisitedNodes;
}

function sortNodesByDistance(nodes) {
  nodes.sort((a, b) => a.distance - b.distance);
}

function getUnvisitedNeighbours(grid, node) {
  const unvisitedNeighbours = [];
  const { x, y } = node;
  if (x > 0) unvisitedNeighbours.push(grid[x - 1][y]);
  if (x < grid.length - 1) unvisitedNeighbours.push(grid[x + 1][y]);
  if (y > 0) unvisitedNeighbours.push(grid[x][y - 1]);
  if (y < grid[0].length - 1) unvisitedNeighbours.push(grid[x][y + 1]);
  return unvisitedNeighbours.filter((node) => !node.isVisited);
}

function updateNeighboursDistanceAndSetPreviousNode(
  currentNode,
  unvisitedNeighbours
) {
  for (let unvisitedNeighbour of unvisitedNeighbours) {
    let temp = 1 + currentNode.distance;
    if (temp < unvisitedNeighbour.distance) {
      unvisitedNeighbour.distance = temp;
      unvisitedNeighbour.previousNode = currentNode;
    }
  }
}

function getShortestPath(nodesInVisitedOrder) {
  const shortestPathReversed = [];
  var currentNode = nodesInVisitedOrder[nodesInVisitedOrder.length - 1];
  while (currentNode != null) {
    shortestPathReversed.push(currentNode);
    currentNode = currentNode.previousNode;
  }
  return shortestPathReversed.reverse();
}
