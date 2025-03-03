import React, { useState, useRef, useEffect } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";
import "./App.css";

function App() {
  const [selected, setSelected] = useState("User experience");
  const [isOpen, setIsOpen] = useState(false);
  // Default sidebar to have no item selected initially
  const [selectedItem, setSelectedItem] = useState(null);
  const [connectedBoxes, setConnectedBoxes] = useState([]);

  const contentRef = useRef(null);
  const archerContainerRef = useRef(null);

  const options = [
    "User experience",
    "Developer experience",
    "Core protocol",
    "ZK L2",
    "Full roadmap",
  ];

  const findConnectedBoxes = (itemName) => {
    if (!itemName) return [];

    const connected = new Set();

    // Helper function to search through all sections and columns
    const searchConnections = () => {
      // Check all sections
      Object.values(gridItems).forEach((section) => {
        // For regular views with columns
        if (section.columns) {
          section.columns.forEach((column) => {
            column.forEach((item) => {
              // Check if this item targets our selected box
              if (item.relations) {
                item.relations.forEach((relation) => {
                  if (relation.targetId === itemName) {
                    connected.add(item.name); // This item targets our selected box
                  }
                });
              }

              // Check if our selected box has this item as a target
              if (item.name === itemName && item.relations) {
                item.relations.forEach((relation) => {
                  connected.add(relation.targetId); // Our selected box targets this item
                });
              }
            });
          });
        }

        // For Full roadmap with rows
        if (section.rows) {
          section.rows.forEach((row) => {
            row.columns.forEach((column) => {
              column.forEach((item) => {
                // Check if this item targets our selected box
                if (item.relations) {
                  item.relations.forEach((relation) => {
                    if (relation.targetId === itemName) {
                      connected.add(item.name);
                    }
                  });
                }

                // Check if our selected box has this item as a target
                if (item.name === itemName && item.relations) {
                  item.relations.forEach((relation) => {
                    connected.add(relation.targetId);
                  });
                }
              });
            });
          });
        }
      });
    };

    searchConnections();
    return Array.from(connected);
  };

  const calculateAverageProgress = (items) => {
    if (!items.length) return 0;
    const sum = items.reduce((acc, item) => acc + item.progress, 0);
    return Math.round(sum / items.length);
  };

  const combineRoadmapItems = () => {
    const sections = [
      "User experience",
      "Developer experience",
      "Core protocol",
      "ZK L2",
    ];
    const combinedColumns = [];

    const allItems = sections.flatMap((section, sectionIndex) => {
      return gridItems[section].columns.flatMap((column, columnIndex) => {
        return column.map((item) => ({
          ...item,
          section,
          sectionIndex,
          columnIndex,
        }));
      });
    });

    const progressGroups = {
      completed: allItems.filter((item) => item.progress === 100),
      inProgress: allItems.filter(
        (item) => item.progress > 0 && item.progress < 100,
      ),
      notStarted: allItems.filter((item) => item.progress === 0),
    };

    combinedColumns.push(progressGroups.completed);
    combinedColumns.push(progressGroups.inProgress);
    combinedColumns.push(progressGroups.notStarted);

    return { columns: combinedColumns };
  };

  const renderRoadmapBox = (item) => {
    return (
      <div className="roadmap-box progress-box">
        <div
          className="progress-bar"
          style={{ width: `${item.progress}%` }}
        ></div>
        <div className="roadmap-content">
          <div className="box-content-wrapper">
            <span className="box-title">{item.name}</span>
            <span className="progress-indicator">{item.progress}%</span>
          </div>
          <div className="sub-items">
            {item.items.map((subItem, index) => (
              <div key={index} className="sub-item">
                <span>{subItem.name}</span>
                <div className="sub-progress">
                  <div
                    className="sub-progress-bar"
                    style={{ width: `${subItem.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const gridItems = {
    "User experience": {
      columns: [
        [
          {
            name: "Typescript SDK",
            progress: 75,
            description:
              "SDK for TypeScript developers to interact with and build applications on Miden blockchain.",
            links: [
              {
                label: "GitHub Repository",
                url: "https://www.npmjs.com/package/@demox-labs/miden-sdk?activeTab=readme",
              },
              {
                label: "Documentation",
                url: "https://0xpolygonmiden.github.io/miden-docs/miden-client/index.html",
              },
            ],
            relations: [
              {
                targetId: "Wallet",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "WebGPU proving",
            progress: 85,
            description:
              "Using WebGPU to accelerate the proving process in browsers",
            relations: [
              {
                targetId: "Wallet",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          {
            name: "Wallet",
            progress: 60,
            description: "User wallet implementation",
          },
          {
            name: "Delegated transaction proving",
            progress: 100,
            description:
              "Allow transactions to be proven by delegated parties for high throughput",
          },
          {
            name: "Block explorer",
            progress: 60,
            description: "Explore blocks and transactions on the chain",
          },
        ],
      ],
    },
    "Developer experience": {
      columns: [
        [
          {
            name: "Offset-based storage",
            progress: 40,
            relations: [
              {
                targetId: "Account components",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          {
            name: "Decorator refactoring",
            progress: 50,
            relations: [
              {
                targetId: "Debugging",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Source code mapping",
            progress: 0,
            relations: [
              {
                targetId: "Debugging",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Miden SDK",
            progress: 50,
            relations: [
              {
                targetId: "Rust compiler",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Miden Rust bindings",
            progress: 50,
            relations: [
              {
                targetId: "Rust compiler",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Element addressable memory",
            progress: 100,
            relations: [
              {
                targetId: "Rust compiler",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Read only memory",
            progress: 15,
            relations: [
              {
                targetId: "Rust compiler",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Account component templates",
            progress: 90,
            relations: [
              {
                targetId: "Packaging",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Account components",
            progress: 100,
            relations: [
              {
                targetId: "Packaging",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Efficient ECDSA signatures",
            progress: 0,
            relations: [
              {
                targetId: "Oracles",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          { name: "Developer playground", progress: 40 },
          { name: "Debugging", progress: 0 },
          { name: "Rust compiler", progress: 60 },
          { name: "Packaging", progress: 80 },
          { name: "Rate limits", progress: 0 },
          { name: "Oracles", progress: 25 },
        ],
      ],
    },
    "Core protocol": {
      columns: [
        [
          { name: "Transaction recency conditions", progress: 100 },
          { name: "Foreign procedure invocation", progress: 100 },
        ],
        [
          { name: "Computing deltas in kernel", progress: 0 },
          { name: "Storage arrays", progress: 0 },
          { name: "Account-ID size", progress: 100 },
          { name: "Fees", progress: 15 },
          { name: "STARK-based signatures", progress: 70 },
        ],
      ],
    },
    "ZK L2": {
      columns: [
        [
          {
            name: "Airscript",
            progress: 85,
            relations: [
              {
                targetId: "Circuit evaluation chiplet",
                targetAnchor: "middle",
                sourceAnchor: "middle",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 1,
                  arrowThickness: 2,
                },
              },
            ],
          },

          {
            name: "Circuit evaluation chiplet",
            progress: 30,
            relations: [
              {
                targetId: "Recursive proof verification",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 1,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          {
            name: "Recursive proof verification",
            progress: 60,
            relations: [
              {
                targetId: "Batch kernel",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 1,
                  arrowThickness: 2,
                },
              },
              {
                targetId: "Efficient Keccak",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 1,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          {
            name: "Batch kernel",
            progress: 55,
            relations: [
              {
                targetId: "Block kernel",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 1,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          {
            name: "Parallel state updates",
            progress: 40,
            relations: [
              {
                targetId: "Node performance",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Distributed provers",
            progress: 70,
            relations: [
              {
                targetId: "Node performance",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
              {
                targetId: "Execution proofs",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 81,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "CUDA accleration",
            progress: 90,
            relations: [
              {
                targetId: "Execution proofs",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 1,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Block kernel",
            progress: 50,
            relations: [
              {
                targetId: "Execution proofs",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 1,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Efficient Keccak",
            progress: 20,
            relations: [
              {
                targetId: "AggLayer integration",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
              {
                targetId: "LxLy-bridge/DA",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          { name: "Node performance", progress: 0 },
          { name: "Execution proofs", progress: 0 },
          { name: "Network transactions", progress: 0 },
          { name: "AggLayer integration", progress: 0 },
          { name: "LxLy-bridge/DA", progress: 0 },
        ],
      ],
    },
    "Full roadmap": {
      // Refactored to include rows
      rows: [
        // Row 1: User Experience
        {
          title: "User Experience",
          columns: [
            [
              {
                name: "Typescript SDK",
                progress: 75,
                description:
                  "SDK for TypeScript developers to interact with and build applications on Miden blockchain.",
                links: [
                  {
                    label: "GitHub Repository",
                    url: "https://www.npmjs.com/package/@demox-labs/miden-sdk?activeTab=readme",
                  },
                  {
                    label: "Documentation",
                    url: "https://0xpolygonmiden.github.io/miden-docs/miden-client/index.html",
                  },
                ],
                relations: [
                  {
                    targetId: "Wallet",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "WebGPU proving",
                progress: 85,
                description:
                  "Using WebGPU to accelerate the proving process in browsers",
                relations: [
                  {
                    targetId: "Wallet",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
            ],
            [
              {
                name: "Wallet",
                progress: 60,
                description: "User wallet implementation",
              },
              {
                name: "Delegated transaction proving",
                progress: 100,
                description:
                  "Allow transactions to be proven by delegated parties for high throughput",
              },
              {
                name: "Block explorer",
                progress: 60,
                description: "Explore blocks and transactions on the chain",
              },
            ],
          ],
        },
        // Row 2: Developer Experience
        {
          title: "Developer Experience",
          columns: [
            [
              {
                name: "Offset-based storage",
                progress: 40,
                relations: [
                  {
                    targetId: "Account components",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
            ],
            [
              {
                name: "Decorator refactoring",
                progress: 50,
                relations: [
                  {
                    targetId: "Debugging",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Source code mapping",
                progress: 0,
                relations: [
                  {
                    targetId: "Debugging",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Miden SDK",
                progress: 50,
                relations: [
                  {
                    targetId: "Rust compiler",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Miden Rust bindings",
                progress: 50,
                relations: [
                  {
                    targetId: "Rust compiler",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Element addressable memory",
                progress: 100,
                relations: [
                  {
                    targetId: "Rust compiler",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Read only memory",
                progress: 15,
                relations: [
                  {
                    targetId: "Rust compiler",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Account component templates",
                progress: 90,
                relations: [
                  {
                    targetId: "Packaging",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Account components",
                progress: 100,
                relations: [
                  {
                    targetId: "Packaging",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              { name: "Efficient ECDSA signatures", progress: 0 },
            ],
            [
              { name: "Developer playground", progress: 40 },
              { name: "Debugging", progress: 0 },
              { name: "Rust compiler", progress: 60 },
              { name: "Packaging", progress: 80 },
              { name: "Rate limits", progress: 0 },
              { name: "Oracles", progress: 25 },
            ],
          ],
        },
        // Row 3: Core Protocol
        {
          title: "Core Protocol",
          columns: [
            [
              {
                name: "Transaction recency conditions",
                progress: 100,
                relations: [
                  {
                    targetId: "Rate limits",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                  {
                    targetId: "Oracles",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Foreign procedure invocation",
                progress: 100,
                relations: [
                  {
                    targetId: "Oracles",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
            ],
            [
              { name: "Computing deltas in kernel", progress: 0 },
              { name: "Storage arrays", progress: 0 },
              { name: "Account-ID size", progress: 100 },
              { name: "Fees", progress: 15 },
              { name: "STARK-based signatures", progress: 70 },
            ],
          ],
        },
        // Row 4: ZK L2
        {
          title: "ZK L2",
          columns: [
            [
              {
                name: "Airscript",
                progress: 85,
                relations: [
                  {
                    targetId: "Circuit evaluation chiplet",
                    targetAnchor: "middle",
                    sourceAnchor: "middle",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Circuit evaluation chiplet",
                progress: 30,
                relations: [
                  {
                    targetId: "Recursive proof verification",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
            ],
            [
              {
                name: "Recursive proof verification",
                progress: 60,
                relations: [
                  {
                    targetId: "Batch kernel",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                  {
                    targetId: "Efficient Keccak",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                  {
                    targetId: "STARK-based signatures",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                  {
                    targetId: "Efficient ECDSA signatures",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
            ],
            [
              {
                name: "Batch kernel",
                progress: 55,
                relations: [
                  {
                    targetId: "Block kernel",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
            ],
            [
              {
                name: "Foreign procedure invocation",
                progress: 100,
                relations: [
                  {
                    targetId: "Node performance",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Distributed provers",
                progress: 70,
                relations: [
                  {
                    targetId: "Node performance",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                  {
                    targetId: "Execution proofs",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "CUDA accleration",
                progress: 90,
                relations: [
                  {
                    targetId: "Execution proofs",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Block kernel",
                progress: 50,
                relations: [
                  {
                    targetId: "Execution proofs",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
              {
                name: "Efficient Keccak",
                progress: 20,
                relations: [
                  {
                    targetId: "AggLayer integration",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                  {
                    targetId: "LxLy-bridge/DA",
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: {
                      strokeColor: "#94a3b8",
                      strokeWidth: 2,
                      arrowLength: 8,
                      arrowThickness: 2,
                    },
                  },
                ],
              },
            ],
            [
              { name: "Node performance", progress: 0 },
              { name: "Execution proofs", progress: 0 },
              { name: "Network transactions", progress: 0 },
              { name: "AggLayer integration", progress: 0 },
              { name: "LxLy-bridge/DA", progress: 0 },
            ],
          ],
        },
      ],
      // Keep the original columns for compatibility with other code
      columns: [
        [
          {
            name: "Airscript",
            progress: 85,
            relations: [
              {
                targetId: "Circuit evaluation chiplet",
                targetAnchor: "middle",
                sourceAnchor: "middle",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          {
            name: "Circuit evaluation chiplet",
            progress: 30,
            relations: [
              {
                targetId: "Debugging",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [{ name: "Recursive proof verification", progress: 60 }],
        [{ name: "Batch kernel", progress: 55 }],
        [
          {
            name: "Parallel state updates",
            progress: 40,
            relations: [
              {
                targetId: "Node performance",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
          { name: "Distributed provers", progress: 70 },
          { name: "CUDA accleration", progress: 90 },
          { name: "Block kernel", progress: 50 },
          {
            name: "Efficient Keccak",
            progress: 20,
            elations: [
              {
                targetId: "LxLy-bridge/DA",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: {
                  strokeColor: "#94a3b8",
                  strokeWidth: 2,
                  arrowLength: 8,
                  arrowThickness: 2,
                },
              },
            ],
          },
        ],
        [
          { name: "Node performance", progress: 0 },
          { name: "Execution proofs", progress: 0 },
          { name: "Network transactions", progress: 0 },
          { name: "AggLayer integration", progress: 0 },
          { name: "LxLy-bridge/DA", progress: 0 },
        ],
      ],
    },
  };

  const handleBoxClick = (item) => {
    if (selectedItem && selectedItem.name === item.name) {
      setSelectedItem(null);
      setConnectedBoxes([]);
    } else {
      setSelectedItem(item);
      setConnectedBoxes(findConnectedBoxes(item.name));
    }

    setTimeout(() => {
      if (
        archerContainerRef.current &&
        archerContainerRef.current.refreshScreen
      ) {
        archerContainerRef.current.refreshScreen();
      }
    }, 50);
  };

  useEffect(() => {
    setSelectedItem(null);
    setConnectedBoxes([]);
  }, [selected]);

  const renderBox = (item, relations = []) => {
    const isSelected = selectedItem && selectedItem.name === item.name;
    const isConnected = connectedBoxes.includes(item.name);
    const shouldFade = selectedItem && !isSelected && !isConnected;

    const styledRelations = relations.map((relation) => {
      if (
        (selectedItem && selectedItem.name === item.name) ||
        (selectedItem && selectedItem.name === relation.targetId)
      ) {
        return {
          ...relation,
          style: {
            ...relation.style,
            strokeColor: "#3b82f6",
            strokeWidth: 3,
            className: "focused-connection",
          },
        };
      }
      return relation;
    });

    return (
      <ArcherElement id={item.name} relations={styledRelations}>
        <div
          className={`box progress-box ${isSelected ? "selected" : ""} ${isConnected ? "connected" : ""} ${shouldFade ? "faded" : ""}`}
          onClick={() => handleBoxClick(item)}
        >
          <div
            className="progress-bar"
            style={{ width: `${item.progress}%` }}
          ></div>
          <div className="box-content-wrapper">
            <span className="box-content">{item.name}</span>
          </div>
        </div>
      </ArcherElement>
    );
  };

  const renderSidebar = () => {
    return (
      <aside className="permanent-sidebar">
        <div className="sidebar-header">
          <h2>{selectedItem ? selectedItem.name : "Select an item"}</h2>
        </div>

        <div className="sidebar-content">
          {selectedItem ? (
            // Content when an item is selected
            <>
              <div className="progress-indicator">
                <div className="progress-header">
                  <div className="progress-label">Progress</div>
                  <div className="progress-value-outside">
                    {selectedItem.progress}%
                  </div>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${selectedItem.progress}%` }}
                  ></div>
                </div>
              </div>
              {selectedItem.description && (
                <div className="description-section">
                  <h3>Description</h3>
                  <p>{selectedItem.description}</p>
                </div>
              )}

              {selectedItem.relations && selectedItem.relations.length > 0 && (
                <div className="relations-section">
                  <h3>Dependencies</h3>
                  <ul className="relations-list">
                    {selectedItem.relations.map((relation, index) => (
                      <li key={index} className="relation-item">
                        <div className="relation-arrow">→</div>
                        <div className="relation-name">{relation.targetId}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedItem.links && selectedItem.links.length > 0 && (
                <div className="links-section">
                  <h3>Related Links</h3>
                  <ul className="links-list">
                    {selectedItem.links.map((link, index) => (
                      <li key={index} className="link-item">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                        >
                          {link.label || link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            // Default content when no item is selected
            <div className="no-selection-message">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <path
                  d="M12 8L12 8.01"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="12"
                  x2="12"
                  y2="16"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p>Click on any item in the roadmap to view its details</p>
            </div>
          )}
        </div>
      </aside>
    );
  };
  return (
    <div className="app">
      {/* Top toolbar with the dropdown */}
      <div className="app-header">
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="button-content">
              <span>{selected}</span>
              <svg
                className={`chevron ${isOpen ? "rotate" : ""}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <path
                  d="M6 8l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>

          {isOpen && (
            <div className="dropdown-menu">
              {options.map((option) => (
                <button
                  key={option}
                  className={`menu-item ${option === selected ? "active" : ""}`}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="main-layout">
        <div className="content-area scrollable-content" ref={contentRef}>
          <ArcherContainer strokeColor="#94a3b8" ref={archerContainerRef}>
            {selected === "Full roadmap" ? (
              <div className="full-roadmap">
                {gridItems[selected].rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="roadmap-row">
                    <div className="row-header">
                      <h2 className="row-title">{row.title}</h2>
                    </div>
                    <div
                      className={`grid ${row.title === "Developer Experience" ? "four-columns" : ""}`}
                    >
                      {row.columns.map((column, columnIndex) => (
                        <div key={columnIndex} className="column">
                          {column.map((item, itemIndex) => (
                            <div key={itemIndex}>
                              {renderBox(item, item.relations || [])}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`grid ${selected === "Developer experience" ? "three-columns" : ""}`}
              >
                {gridItems[selected].columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="column">
                    {column.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        {renderBox(item, item.relations || [])}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ArcherContainer>
        </div>
        {renderSidebar()}
      </div>
    </div>
  );
}

export default App;
