import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithm/dijkstra";

const START_NODE_ROW = 14;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 14;
const FINISH_NODE_COL = 39;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      dijkstra: false,
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 5 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    this.setState({ dijkstra: true });
  }

  clearBoard() {
    if (this.state.dijkstra) {
      window.location.reload();
    } else {
      const grid = getInitialGrid();
      this.setState({ grid });
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="container flex">
          <div className="left-content">
            <h1>Pathfinding Visualizer</h1>
            <table className="grid">
              <tbody>
                {grid.map((row, rowIdx) => {
                  return (
                    <tr key={rowIdx}>
                      {row.map((node, nodeIdx) => {
                        const { row, col, isFinish, isStart, isWall } = node;
                        return (
                          <Node
                            key={nodeIdx}
                            col={col}
                            isFinish={isFinish}
                            isStart={isStart}
                            isWall={isWall}
                            mouseIsPressed={mouseIsPressed}
                            onMouseDown={(row, col) =>
                              this.handleMouseDown(row, col)
                            }
                            onMouseEnter={(row, col) =>
                              this.handleMouseEnter(row, col)
                            }
                            onMouseUp={() => this.handleMouseUp()}
                            row={row}
                          ></Node>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="right-content">
            <div className="informations">
              <i className="fas fa-info-circle"></i>
              <p>
                This pathfinding uses the{" "}
                <a
                  className="info-link"
                  href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dijkstra's algorithm
                </a>
                .
              </p>
              <p>Hold & Drag on white grids to place Walls.</p>
            </div>
            <div className="legend">
              <div className="legend-one">
                <div>
                  <div className="node start node-legend"></div>
                  Start
                </div>
                <div>
                  <div className="node end node-legend"></div>
                  End
                </div>
                <div>
                  <div className="node wall node-legend"></div>
                  Wall
                </div>
              </div>
              <div className="legend-two">
                <div>
                  <div className="node shortest-path node-legend"></div>
                  Shortest-path
                </div>
                <div>
                  <div className="node visited node-legend"></div>
                  Visited
                </div>
              </div>
            </div>
            <div className="btn">
              <button onClick={() => this.visualizeDijkstra()}>
                Visualize
              </button>
              <button className="btn-clear" onClick={() => this.clearBoard()}>
                Clear Board
              </button>
            </div>
            <div className="socials">
              <a
                href="https://www.linkedin.com/in/lo%C3%AFc-muller-984599203/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="https://www.loicmuller.com/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-globe"></i>
              </a>
              <a
                href="https://github.com/LoicMuller/Pathfinding-visualizer"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-github-square"></i>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 29; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
