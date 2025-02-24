import React, { useState } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import './App.css';

function App() {
  const [selected, setSelected] = useState('User experience');
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    'User experience',
    'Developer experience',
    'Core protocol',
    'ZK L2',
    'Full roadmap'
  ];

  
  const calculateAverageProgress = (items) => {
    if (!items.length) return 0;
    const sum = items.reduce((acc, item) => acc + item.progress, 0);
    return Math.round(sum / items.length);
  };

  const combineRoadmapItems = () => {
    const sections = ['User experience', 'Developer experience', 'Core protocol', 'ZK L2'];
    const combinedColumns = [];
    
    // First, collect all items with their section info
    const allItems = sections.flatMap((section, sectionIndex) => {
      return gridItems[section].columns.flatMap((column, columnIndex) => {
        return column.map(item => ({
          ...item,
          section,
          sectionIndex,
          columnIndex
        }));
      });
    });

    // Group items by their progress range
    const progressGroups = {
      completed: allItems.filter(item => item.progress === 100),
      inProgress: allItems.filter(item => item.progress > 0 && item.progress < 100),
      notStarted: allItems.filter(item => item.progress === 0)
    };

    // Create columns based on progress groups
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
          <span className="box-title">{item.name}</span>
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
    'User experience': {
      columns: [
        [
          { name: 'Typescript SDK', 
            progress: 75,
            relations: [{
              targetId: 'Wallet',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }] 
          },
          { name: 'WebGPU proving', 
            progress: 85,
            relations: [{
              targetId: 'Wallet',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }]   
          }
        ],
        [
          { name: 'Wallet', progress: 60 },
          { name: 'Delegated transaction proving', 
            progress: 100 },
          { name: 'Block explorer', progress: 60 }
        ]
      ]
    },
    'Developer experience': {
      columns: [
        [
          { name: 'Offset-based storage', 
            progress: 40, 
            relations: [{
              targetId: 'Account components',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
            }
          }]  
        },
        ],
        [
          { name: 'Decorator refactoring', 
            progress: 50, 
            relations: [{
              targetId: 'Debugging',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
            }
          }]  
           },
          { name: 'Source code mapping', 
            progress: 0, 
            relations: [{
              targetId: 'Debugging',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
            }
          }]   
        },
          { name: 'Miden SDK', 
            progress: 50, 
            relations: [{
            targetId: 'Rust compiler',
            targetAnchor: 'left',
            sourceAnchor: 'right',
            style: { 
              strokeColor: '#94a3b8',
              strokeWidth: 2,
              arrowLength: 8,
              arrowThickness: 2
          }
        }]    
        },
          { name: 'Miden Rust bindings', 
            progress: 50,
            relations: [{
              targetId: 'Rust compiler',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }]    
          },
          { name: 'Element addressable memory', 
            progress: 100, 
            relations: [{
              targetId: 'Rust compiler',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }]   
           },
          { name: 'Read only memory', 
            progress: 15, 
            relations: [{
              targetId: 'Rust compiler',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }]    
          },
          { name: 'Account component templates', 
            progress: 90, 
            relations: [{
              targetId: 'Packaging',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }]    
           },
          { name: 'Account components', 
            progress: 100, 
            relations: [{
              targetId: 'Packaging',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }]   
           },
          { name: 'Efficient ECDSA signatures', 
            progress: 0,
            relations: [{
              targetId: 'Oracles',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 8,
                arrowThickness: 2
              }
            }]   
          }
        ],
        [
          { name: 'Developer playground', progress: 40 },
          { name: 'Debugging', progress: 0 },
          { name: 'Rust compiler', progress: 60 },
          { name: 'Packaging', progress: 80 },
          { name: 'Rate limits', progress: 0 },
          { name: 'Oracles', progress: 25 }
        ]
      ]
    },
    'Core protocol': {
      columns: [
        [
          { name: 'Transaction recency conditions', progress: 100 },
          { name: 'Foreigh procedure invocation', progress: 100 },
        ],
        [
          { name: 'Computing deltas in kernel', progress: 0 },
          { name: 'Storage arrays', progress: 0 },
          { name: 'Account-ID size', progress: 100 },
          { name: 'Fees', progress: 15 },
          { name: 'STARK-based signatures', progress: 70 }
        ]
      ]
    },
    'ZK L2': {
      columns: [
        [
          { name: 'Airscript', progress: 85 },
          { name: 'Circuit evaluation chiplet', progress: 30 },
        ],
        [
          { name: 'Recursive proof verification', progress: 60 }
        ],
        [
          { name: 'Batch kernel', progress: 55 },
        ],
        [
          { name: 'Parallel state updates', progress: 40 },
          { name: 'Distributed provers', progress: 70 },
          { name: 'CUDA accleration', progress: 90 },
          { name: 'Block kernel', progress: 50 },
          { name: 'Efficient Keccak', progress: 20 }
        ],
        [
          { name: 'Node performance', progress: 0 },
          { name: 'Execution proofs', progress: 0 },
          { name: 'Network transactions', progress: 0 },
          { name: 'AggLayer integration', progress: 0 },
          { name: 'LxLy-bridge/DA', progress: 0 }
        ]
      ]
    }
  };

  gridItems['Full roadmap'] = combineRoadmapItems();
  
  const renderBox = (item, relations = []) => {
    return (
      <ArcherElement
        id={item.name}
        relations={relations}
      >
        <div className="box progress-box">
          <div 
            className="progress-bar" 
            style={{ width: `${item.progress}%` }}
          ></div>
          <span className="box-content">{item.name}</span>
        </div>
      </ArcherElement>
    );
  };

  return (
    <div className="app">
      <div className="dropdown">
        <button 
          className="dropdown-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="button-content">
            <span>{selected}</span>
            <svg 
              className={`chevron ${isOpen ? 'rotate' : ''}`}
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
            {options.map(option => (
              <button
                key={option}
                className={`menu-item ${option === selected ? 'active' : ''}`}
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

      <ArcherContainer strokeColor="#94a3b8">
        <div className={`grid ${selected === 'Developer experience' ? 'three-columns' : ''}`}>
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
      </ArcherContainer>
    </div>
  );
}

export default App;