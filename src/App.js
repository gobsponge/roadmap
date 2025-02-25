import React, { useState, useRef, useEffect } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import './App.css';

function App() {
  const [selected, setSelected] = useState('User experience');
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState({ visible: false, content: '', item: null, position: { x: 0, y: 0 } });
  const popupRef = useRef(null);

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

    
    const progressGroups = {
      completed: allItems.filter(item => item.progress === 100),
      inProgress: allItems.filter(item => item.progress > 0 && item.progress < 100),
      notStarted: allItems.filter(item => item.progress === 0)
    };

    
    combinedColumns.push(progressGroups.completed);
    combinedColumns.push(progressGroups.inProgress);
    combinedColumns.push(progressGroups.notStarted);

    return { columns: combinedColumns };
  };

  const showPopup = (e, item) => {
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    
    const position = {
      x: rect.right + 10,
      y: rect.top 
    };
    
    setPopup({
      visible: true,
      content: item.description || "No description available",
      item: item,
      position: position
    });
  };

  const hidePopup = () => {
    setPopup(prev => ({ ...prev, visible: false }));
  };  

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          !event.target.classList.contains('box') && 
          !event.target.classList.contains('box-content')) {
        hidePopup();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  useEffect(() => {
    hidePopup();
  }, [selected]);


  const renderRoadmapBox = (item) => {
    return (
      <div className="roadmap-box progress-box"
        onClick={(e) => showPopup(e, item)}
      >
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
            description: 'SDK for TypeScript developers to interact with the platform.',
            links: [
              { label: 'GitHub Repository', url: 'https://www.npmjs.com/package/@demox-labs/miden-sdk?activeTab=readme'},
              { label: 'Documentation', url: 'https://0xpolygonmiden.github.io/miden-docs/miden-client/index.html' }
            ],
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
            description: 'Using WebGPU to accelerate the proving process in browsers',
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
          { name: 'Wallet', progress: 60, description: 'User wallet implementation' },
          { name: 'Delegated transaction proving', 
            progress: 100, description: 'Allow transactions to be proven by delegated parties' },
          { name: 'Block explorer', progress: 60, description: 'UI to explore blocks and transactions' }
        ]
      ]
    },
    'Developer experience': {
      columns: [
        [
          { name: 'Offset-based storage', 
            progress: 40, 
            description: 'Storage system using offset-based addressing',
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
            description: 'Refactoring the decorator system for improved usability',
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
            description: 'Mapping between compiled code and source code',
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
            description: 'Software Development Kit for Miden',
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
            description: 'Rust language bindings for Miden',
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
            description: 'Memory addressing at the element level',
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
            description: 'Implementation of read-only memory segments',
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
            description: 'Templates for creating account components',
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
            description: 'Component system for accounts',
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
            description: 'Optimized implementation of ECDSA signature verification',
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
          { name: 'Developer playground', progress: 40, description: 'Interactive environment for developers' },
          { name: 'Debugging', progress: 0, description: 'Tools and infrastructure for debugging' },
          { name: 'Rust compiler', progress: 60, description: 'Compiler support for Rust language' },
          { name: 'Packaging', progress: 80, description: 'System for packaging components' },
          { name: 'Rate limits', progress: 0, description: 'Implementation of rate limiting' },
          { name: 'Oracles', progress: 25, description: 'Oracle system for external data' }
        ]
      ]
    },
    'Core protocol': {
      columns: [
        [
          { name: 'Transaction recency conditions', progress: 100, description: 'Conditions to ensure transaction recency'},
          { name: 'Foreigh procedure invocation', progress: 100, description: 'System for invoking foreign procedures' },
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
          { name: 'Airscript', 
            progress: 85,
            relations: [{
              targetId: 'Circuit evaluation chiplet',
              targetAnchor: 'middle',
              sourceAnchor: 'middle',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }]  
           },
           
          { name: 'Circuit evaluation chiplet', 
            progress: 30,
            relations: [{
              targetId: 'Recursive proof verification',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }]  
          },
        ],
        [
          { name: 'Recursive proof verification', 
            progress: 60,
            relations: [{
              targetId: 'Batch kernel',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            },
            {
              targetId: 'Efficient Keccak',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }
          ]  
          }
        ],
        [
          { name: 'Batch kernel', 
            progress: 55,
            relations: [{
              targetId: 'Block kernel',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }] 
           },
        ],
        [
          { name: 'Parallel state updates', 
            progress: 40,
            relations: [{
              targetId: 'Node performance',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }] 
           },
          { name: 'Distributed provers', 
            progress: 70,
            relations: [{
              targetId: 'Node performance',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            },
            {
              targetId: 'Execution proofs',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }
          ] 
          },
          { name: 'CUDA accleration', 
            progress: 90,
            relations: [{
              targetId: 'Execution proofs',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }]  },
          { name: 'Block kernel', 
            progress: 50,
            relations: [{
              targetId: 'Execution proofs',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }]
            },
          { name: 'Efficient Keccak', 
            progress: 20,
            relations: [{
              targetId: 'AggLayer integration',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            },
            {
              targetId: 'LxLy-bridge/DA',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              style: { 
                strokeColor: '#94a3b8',
                strokeWidth: 2,
                arrowLength: 1,
                arrowThickness: 2
              }
            }
            ]
           }
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
        <div className="box progress-box"
          onClick={(e) => showPopup(e, item)}
        >
          <div 
            className="progress-bar" 
            style={{ width: `${item.progress}%` }}
          ></div>
          <span className="box-content">{item.name}</span>
        </div>
      </ArcherElement>
    );
  };

  const renderPopup = () => {
    if (!popup.visible) return null;

    const item = popup.item;
    if (!item) return null;

    return (
      <div 
        ref={popupRef}
        className="popup"
        style={{
          position: 'absolute',
          left: popup.position.x + 'px',
          top: popup.position.y + 'px'
        }}
      >
        <div className="popup-header">
          <h3>{item.name}</h3>
          <button className="close-button" onClick={hidePopup}>×</button>
        </div>
        <div className="popup-content">
          <p className="description">{item.description || "No description available"}</p>
          {item.links && item.links.length > 0 && (
            <div className="popup-links">
              <h4 className="links-title">Related Links</h4>
              <ul className="links-list">
                {item.links.map((link, index) => (
                  <li key={index} className="link-item">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="popup-link"
                    >
                      {link.label || link.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
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

      {renderPopup()}
    </div>
  );
}

export default App;