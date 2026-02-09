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

#### Self Collision
- Running into your own body = **instant death**

#### Head-on Collision
- Both snakes move into the same cell simultaneously
- **Longer snake wins**, shorter snake dies instantly
- **Equal length** = both snakes die
- Winner continues moving, loser body vanishes

#### Body Attack (Fracturing)
- Any snake can attack another snake's body
- Attacker moves into defender's body cell
- **Defender is fractured** at the collision point
  - Body segments from collision point onward are **removed**
  - Head through collision segment remain (attacker becomes shorter)
  - Example: 20-segment snake cut at position 5 → keeps 6 segments (indices 0-5)
- **Attacker survives** and continues
- Strategic for cutting down long snakes to manageable size

#### On Death
- Entire body vanishes instantly (no food conversion)
- **Permadeath**: No respawning

### Food System
- **Initial Spawn**: 500 food pellets at game start
- **No Respawn**: Food disappears when eaten, never returns
- **Growth**: Eating food increases length by 1
- **Scarcity**: Food is finite resource that depletes over time

## Bot AI

### Goals (Priority Order)
1. **Head-on Dominance**: Crush shorter snakes (+2000 bonus for winning head-on)
2. **Head-on Avoidance**: Flee from longer snakes (-1000 penalty for losing head-on)
3. **Body Cutting**: Cut enemy snakes for massive damage (+500 base + 50 per segment cut)
4. **Intercept**: Block enemy's predicted path (+1500 bonus)
5. **Survival**: Avoid dangerous encounters with longer snakes
6. **Food**: Eat nearby food (+30 for eating, scaled for proximity)
7. **Aggression**: Move toward nearest enemy (-2 per distance unit)
8. **Space**: Maintain maneuvering room (open cells in 5x5 area)

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
1. **Early Game**: Rush food to gain length advantage for head-on dominance
2. **Mid Game**: Cut long snakes down to size, pick off shorter ones in head-ons
3. **Late Game**: Use length advantage to force head-ons, zone smaller snakes

### Common Mistakes
- Chasing food into longer snake's kill zone
- Attempting head-on against equal or longer snakes
- Not prioritizing body cuts (massive damage potential)
- Ignoring rate limit (wasted moves)

### Meta Evolution
- Early meta: Pure food collection
- Mature meta: Length management and selective head-ons
- Advanced: Calculated body cuts and baiting into traps
- Expert: Using cuts to deliberately shorten enemies before head-on finish

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
