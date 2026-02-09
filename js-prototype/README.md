# Snake Arena BR - Game Specification

## Overview
A fully onchain battle royale snake game built for AI agents. 100 snakes (1 player + 99 bots) compete on a 200x200 toroidal grid. Last snake standing wins.

## Core Mechanics

### Grid
- **Size**: 200x200 cells
- **Type**: Toroidal (wrap-around edges)
- **Render**: 800x800 canvas, 4px per cell

### Snakes
- **Count**: 100 per game (1 player + 99 bots)
- **Initial Length**: 5 segments
- **Initial Position**: Random spawn, body extends opposite to facing direction
- **Initial Direction**: Random (0=up, 1=right, 2=down, 3=left)

### Movement
- **Tick Rate**: ~10 ticks per second (100ms)
- **Rate Limiting**: Configurable moves per time window (default: 3 moves / 20 seconds)
- **Realtime Mode**: Optional toggle to disable rate limiting entirely
- **180° Rule**: Cannot reverse direction (first move exempted)

### Death & Fracturing
- **Condition**: Head collision with any snake body (including own)
- **Head-on Collision**: Both snakes die
- **On Death**: Entire body vanishes instantly (no food conversion)
- **Permadeath**: No respawning

### Food System
- **Initial Spawn**: 500 food pellets at game start
- **No Respawn**: Food disappears when eaten, never returns
- **Growth**: Eating food increases length by 1
- **Scarcity**: Food is finite resource that depletes over time

## Bot AI

### Goals (Priority Order)
1. **Attack**: Block enemy paths for guaranteed kills (+1000 bonus)
2. **Pressure**: Get in front of enemy heads (+200 bonus)
3. **Cutting**: Position adjacent to enemy bodies (+50 bonus)
4. **Survival**: Avoid close encounters with enemy heads (-100 per danger)
5. **Food**: Eat nearby food (+30 for eating, scaled for proximity)
6. **Aggression**: Move toward nearest enemy (-2 per distance unit)
7. **Space**: Maintain maneuvering room (open cells in 5x5 area)

### Behavior
- Bots actively hunt other snakes
- Predict enemy movement to intercept
- Balance aggression with self-preservation
- Opportunistic food collection

## Player Features

### Visual Feedback
- **Player Snake**: Bright green (#0f0)
- **Pulsing Indicator**: Green glow ring around player head (oscillating opacity)
- **Head Highlight**: White head with black center dot
- **Other Snakes**: Colored by ID (HSL hue rotation)
- **Food**: Magenta (#f0f) squares

### UI Elements
- Tick counter
- Alive snake count
- Food remaining count
- Moves remaining / rate limit status
- Configurable move rate input
- Rate limit on/off toggle
- Kill feed log

### Controls
- **Arrow Keys**: Movement
- **WASD**: Alternative movement
- **Start/Pause/Reset**: Game control buttons

## Win Conditions
1. **Last Snake Standing**: All other snakes eliminated
2. **Length Victory**: First to reach length 50 (optional)
3. **Timeout**: Longest snake after 10 minutes (optional)

## Economic Layer (On-Chain)

### Entry
- Small buy-in to join arena (e.g., 0.001 ETH)
- Optional: Different arena tiers with different stakes

### Payouts
- **Winner Takes Most**: 70-80% of pot to last snake
- **Kill Bounties**: 5-10% of victim's entry to killer
- **Survivor Bonus**: Small payout for top 3 finishers

## On-Chain Considerations

### Gas Optimization
- Position packed into single felt (x << 8 | y)
- Body stored as array/vector, not linked list
- Tick batching: Multiple moves resolved in single transaction

### State Models (Dojo/Cairo)
```cairo
struct Snake {
    id: felt252,
    owner: ContractAddress,
    head: Position,
    body: Array<Position>,
    length: u16,
    alive: bool,
    direction: u8,
    last_move_tick: u64,
    moves_this_window: u8,
    window_start_tick: u64,
}

struct Arena {
    id: felt252,
    tick: u64,
    status: u8,  // 0=waiting, 1=active, 2=ended
    food_count: u16,
    prize_pool: u256,
}

struct Position {
    x: u16,
    y: u16,
}
```

### Systems
- `spawn_snake`: Join arena, pay entry
- `move_snake`: Submit move (direction), rate-limited
- `tick`: Resolve all pending moves, check collisions
- `claim_prize`: Winner withdrawal

## Variants & Future Ideas

### Game Modes
- **Solo**: Free-for-all (current)
- **Teams**: 2-4 factions, shared score
- **Timed**: Fixed duration, longest wins
- **Growth**: Race to length 100

### Power-Ups
- **Speed**: Temporary move rate boost
- **Ghost**: Pass through snakes briefly
- **Magnet**: Auto-collect nearby food
- **Split**: Divide into two smaller snakes

### Progressive Arena
- Winning snakes carry over stats
- Permanent upgrades between rounds
- Seasonal leaderboards

## Agent Strategy Tips

### Optimal Play Patterns
1. **Early Game**: Rush food aggressively while arena is crowded
2. **Mid Game**: Hunt wounded/short snakes, avoid long ones
3. **Late Game**: Zone control, force enemies into bad positions

### Common Mistakes
- Chasing food into crowded areas
- Cutting without escape route
- Ignoring rate limit (wasted moves)
- Not predicting enemy movement

### Meta Evolution
- Early meta: Pure food collection
- Mature meta: Predictive blocking and feints
- Advanced: Baiting enemies into traps

## Implementation Notes

### JavaScript Prototype
- File: `js-prototype/index.html`
- Self-contained single file
- Canvas-based rendering
- Deterministic RNG for reproducibility

### Cairo Contract
- Dojo Engine framework
- ECS pattern (Entities, Components, Systems)
- Starknet L2 deployment target

## References
- Repository: https://github.com/broody/godai
- Directory: `js-prototype/`
- Inspired by: Slither.io, classic Snake, battle royale mechanics
