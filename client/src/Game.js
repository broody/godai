import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text } from '@react-three/drei';
import './Game.css';

// Mock game state
const MOCK_GAME_STATE = {
  gridSize: { x: 20, y: 20, z: 20 },
  players: [
    {
      id: 'player1',
      name: 'Your Serpent',
      element: 'Fire',
      color: '#ff4444',
      links: [
        { x: 10, y: 0, z: 10 },
        { x: 11, y: 0, z: 10 },
        { x: 12, y: 0, z: 10 },
        { x: 13, y: 0, z: 10 },
      ],
    },
    {
      id: 'bot1',
      name: 'Earth Wyrm',
      element: 'Earth',
      color: '#44ff44',
      links: [
        { x: 5, y: 0, z: 15 },
        { x: 5, y: 0, z: 14 },
        { x: 5, y: 0, z: 13 },
        { x: 5, y: 0, z: 12 },
      ],
    },
  ],
  orbs: [
    { x: 8, y: 0, z: 8, element: 'Water', color: '#4444ff' },
    { x: 15, y: 0, z: 5, element: 'Fire', color: '#ff4444' },
    { x: 3, y: 0, z: 18, element: 'Wind', color: '#44ffff' },
    { x: 18, y: 0, z: 12, element: 'Earth', color: '#44ff44' },
    { x: 10, y: 0, z: 3, element: 'Void', color: '#ff44ff' },
  ],
};

const ELEMENTS = {
  Void: { color: '#9b59b6', beats: ['Earth'] },
  Earth: { color: '#27ae60', beats: ['Water'] },
  Water: { color: '#2980b9', beats: ['Fire'] },
  Fire: { color: '#e74c3c', beats: ['Wind'] },
  Wind: { color: '#00bcd4', beats: ['Void'] },
};

function SnakeLink({ position, color, isHead }) {
  return (
    <Box position={[position.x - 10, position.y, position.z - 10]} args={[0.9, 0.9, 0.9]}>
      <meshStandardMaterial color={color} emissive={isHead ? color : undefined} emissiveIntensity={isHead ? 0.3 : 0} />
    </Box>
  );
}

function Orb({ position, color, element }) {
  return (
    <group position={[position.x - 10, position.y + 0.5, position.z - 10]}>
      <Sphere args={[0.4, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </Sphere>
      <Text position={[0, 0.8, 0]} fontSize={0.3} color="white" anchorX="center">
        {element}
      </Text>
    </group>
  );
}

function Grid() {
  return (
    <>
      <gridHelper args={[20, 20, '#444444', '#222222']} position={[0, -0.5, 0]} />
      {/* Grid boundaries */}
      <Box position={[0, 0, -10.5]} args={[20, 1, 0.1]}>
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </Box>
      <Box position={[0, 0, 10.5]} args={[20, 1, 0.1]}>
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </Box>
      <Box position={[-10.5, 0, 0]} args={[0.1, 1, 20]}>
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </Box>
      <Box position={[10.5, 0, 0]} args={[0.1, 1, 20]}>
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </Box>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffaa00" />
      
      <Grid />
      
      {MOCK_GAME_STATE.players.map((player) =>
        player.links.map((link, index) => (
          <SnakeLink
            key={`${player.id}-${index}`}
            position={link}
            color={player.color}
            isHead={index === 0}
          />
        ))
      )}
      
      {MOCK_GAME_STATE.orbs.map((orb, index) => (
        <Orb key={index} {...orb} />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}

function HUD() {
  return (
    <div className="hud">
      <div className="hud-panel player-info">
        <h3>Your Serpent</h3>
        <div className="element-badge" style={{ backgroundColor: ELEMENTS.Fire.color }}>
          🔥 Fire
        </div>
        <div className="stats">
          <span>Links: 4</span>
          <span>Score: 120</span>
        </div>
      </div>
      
      <div className="hud-panel element-chart">
        <h3>Element Hierarchy</h3>
        <div className="elements">
          {Object.entries(ELEMENTS).map(([name, data]) => (
            <div key={name} className="element-item">
              <span className="element-dot" style={{ backgroundColor: data.color }} />
              <span>{name}</span>
              <span className="beats">→ beats {data.beats.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="hud-panel leaderboard">
        <h3>Rankings</h3>
        <ol>
          <li><span className="name" style={{ color: '#ff4444' }}>Your Serpent</span> <span>4 links</span></li>
          <li><span className="name" style={{ color: '#44ff44' }}>Earth Wyrm</span> <span>4 links</span></li>
        </ol>
      </div>
      
      <div className="controls-hint">
        <p>🖱️ Drag to rotate • 🖱️ Scroll to zoom • ⌨️ Arrow keys to move</p>
      </div>
    </div>
  );
}

function Game() {
  return (
    <div className="game-container">
      <div className="game-canvas">
        <Canvas camera={{ position: [15, 15, 15], fov: 60 }}>
          <Scene />
        </Canvas>
      </div>
      <HUD />
    </div>
  );
}

export default Game;
