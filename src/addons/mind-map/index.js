/**
 * Mind Map Addon
 * Simple visual brainstorming tool
 */
import React, { useState, useEffect, useRef } from 'react';
import { Network, PlusCircle, Link, Trash2, Edit3, Download, Share2 } from 'lucide-react';

import './styles.css';

const MindMap = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [newNodeText, setNewNodeText] = useState('');
  const [mapTitle, setMapTitle] = useState('New Mind Map');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const mapContainerRef = useRef(null);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Initialize with a default central node
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([
        { id: 1, text: 'Central Idea', x: 200, y: 150, color: '#8B5CF6' }
      ]);
    }
  }, [nodes.length]);
  
  // Load saved map
  useEffect(() => {
    const savedMap = localStorage.getItem('mindMap');
    if (savedMap) {
      try {
        const { title, nodes, connections } = JSON.parse(savedMap);
        setMapTitle(title || 'Mind Map');
        setNodes(nodes || []);
        setConnections(connections || []);
      } catch (err) {
        console.error('Failed to load mind map:', err);
      }
    }
  }, []);
  
  // Save map when it changes
  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem('mindMap', JSON.stringify({
        title: mapTitle,
        nodes,
        connections
      }));
    }
  }, [mapTitle, nodes, connections]);
  
  // Add a new node
  const addNode = (e) => {
    e.preventDefault();
    
    if (!newNodeText.trim()) return;
    
    // Get random position near the center if no parent node
    let newX = 150 + Math.random() * 100 - 50;
    let newY = 150 + Math.random() * 100 - 50;
    
    // If a node is selected, position the new node relative to it
    if (selectedNode) {
      const parent = nodes.find(n => n.id === selectedNode);
      if (parent) {
        newX = parent.x + 120 + Math.random() * 40 - 20;
        newY = parent.y + Math.random() * 100 - 50;
      }
    }
    
    // Get random color from a creative palette
    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create new node
    const newNode = {
      id: Date.now(),
      text: newNodeText,
      x: newX,
      y: newY,
      color: randomColor
    };
    
    setNodes([...nodes, newNode]);
    
    // If a node is selected, create a connection
    if (selectedNode) {
      setConnections([
        ...connections,
        { id: Date.now(), from: selectedNode, to: newNode.id }
      ]);
    }
    
    setNewNodeText('');
    setIsAddingNode(false);
  };
  
  // Delete a node and its connections
  const deleteNode = (nodeId) => {
    // Remove the node
    setNodes(nodes.filter(node => node.id !== nodeId));
    
    // Remove any connections involving this node
    setConnections(
      connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId)
    );
    
    // Deselect if this was the selected node
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };
  
  // Start node connection
  const startConnection = (nodeId) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
  };
  
  // Complete node connection
  const completeConnection = (nodeId) => {
    // Don't connect to self or create duplicate connections
    if (nodeId === connectionStart || 
        connections.some(c => 
          (c.from === connectionStart && c.to === nodeId) || 
          (c.from === nodeId && c.to === connectionStart)
        )) {
      setIsConnecting(false);
      setConnectionStart(null);
      return;
    }
    
    // Create new connection
    setConnections([
      ...connections,
      { id: Date.now(), from: connectionStart, to: nodeId }
    ]);
    
    // Reset connection state
    setIsConnecting(false);
    setConnectionStart(null);
  };
  
  // Handle node click
  const handleNodeClick = (nodeId) => {
    if (isConnecting) {
      completeConnection(nodeId);
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };
  
  // Handle node drag
  const handleNodeDrag = (e, nodeId) => {
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const originalNode = nodes.find(n => n.id === nodeId);
    const startNodeX = originalNode.x;
    const startNodeY = originalNode.y;
    
    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      setNodes(nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            x: startNodeX + dx,
            y: startNodeY + dy
          };
        }
        return node;
      }));
    };
    
    const handleMoveEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleMoveEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMoveEnd);
  };
  
  // Handle map drag
  const handleMapDragStart = (e) => {
    if (e.target === mapContainerRef.current) {
      setIsDraggingMap(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMapDragMove = (e) => {
    if (isDraggingMap) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      setMapPosition({
        x: mapPosition.x + dx,
        y: mapPosition.y + dy
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMapDragEnd = () => {
    setIsDraggingMap(false);
  };
  
  // Draw connection lines
  const renderConnections = () => {
    return connections.map(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return null;
      
      // Calculate line endpoints
      return (
        <line
          key={conn.id}
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke={selectedNode && (selectedNode === conn.from || selectedNode === conn.to) ? 
            '#8B5CF6' : '#4B5563'}
          strokeWidth={selectedNode && (selectedNode === conn.from || selectedNode === conn.to) ? 
            2 : 1}
          strokeDasharray={isConnecting ? "5,5" : "none"}
        />
      );
    });
  };
  
  // Export map as JSON
  const exportMap = () => {
    const dataStr = JSON.stringify({
      title: mapTitle,
      nodes,
      connections
    });
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${mapTitle.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="mind-map-addon">
      <div className="mind-map-header">
        <div className="header-title">
          <Network size={18} className="map-icon" />
          {isEditingTitle ? (
            <input
              type="text"
              value={mapTitle}
              onChange={(e) => setMapTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              className="title-input"
              autoFocus
            />
          ) : (
            <h2 
              className="map-title"
              onClick={() => setIsEditingTitle(true)}
            >{mapTitle}</h2>
          )}
        </div>
        
        <div className="map-actions">
          <button 
            className={`map-action-btn ${isAddingNode ? 'active' : ''}`}
            onClick={() => setIsAddingNode(!isAddingNode)}
            title="Add node"
          >
            <PlusCircle size={16} />
          </button>
          <button 
            className={`map-action-btn ${isConnecting ? 'active' : ''}`}
            onClick={() => setIsConnecting(!isConnecting)}
            title="Connect nodes"
            disabled={!selectedNode}
          >
            <Link size={16} />
          </button>
          <button 
            className="map-action-btn"
            onClick={exportMap}
            title="Export map"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      
      {isAddingNode && (
        <form onSubmit={addNode} className="add-node-form">
          <input
            type="text"
            placeholder="Node text..."
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            className="node-input"
            autoFocus
          />
          <button type="submit" className="add-node-btn">Add</button>
        </form>
      )}
      
      <div className="mind-map-container">
        <div 
          ref={mapContainerRef}
          className={`mind-map ${isDraggingMap ? 'dragging' : ''}`}
          onMouseDown={handleMapDragStart}
          onMouseMove={handleMapDragMove}
          onMouseUp={handleMapDragEnd}
          onMouseLeave={handleMapDragEnd}
        >
          <svg width="100%" height="100%">
            <g transform={`translate(${mapPosition.x}, ${mapPosition.y})`}>
              {/* Render connections */}
              {renderConnections()}
              
              {/* Render in-progress connection */}
              {isConnecting && connectionStart && (
                <line
                  x1={nodes.find(n => n.id === connectionStart)?.x || 0}
                  y1={nodes.find(n => n.id === connectionStart)?.y || 0}
                  x2={0}
                  y2={0}
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  className="connection-in-progress"
                />
              )}
            </g>
          </svg>
          
          {/* Render nodes */}
          <div className="nodes-container" style={{ transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)` }}>
            {nodes.map(node => (
              <div
                key={node.id}
                className={`map-node ${selectedNode === node.id ? 'selected' : ''} ${isConnecting ? 'connecting' : ''}`}
                style={{ 
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  backgroundColor: node.color
                }}
                onClick={() => handleNodeClick(node.id)}
                onMouseDown={(e) => e.stopPropagation()} // Prevent map drag when clicking node
              >
                <div 
                  className="node-drag-handle"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleNodeDrag(e, node.id);
                  }}
                >
                  <Edit3 size={12} />
                </div>
                
                <div className="node-text">{node.text}</div>
                
                {selectedNode === node.id && (
                  <button 
                    className="node-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mind-map-footer">
        <div className="map-tips">
          {selectedNode ? (
            <>
              <span className="tip-text">Node selected</span>
              <button 
                className="tip-action"
                onClick={() => startConnection(selectedNode)}
              >
                Connect
              </button>
              <button 
                className="tip-action"
                onClick={() => setIsAddingNode(true)}
              >
                Add child
              </button>
            </>
          ) : (
            <span className="tip-text">Click a node to select it</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMap;