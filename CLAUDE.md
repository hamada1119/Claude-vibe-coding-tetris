# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a classic Tetris game built with Next.js 15, React 19, and TypeScript. The application is a single-page game featuring a complete Tetris implementation with standard game mechanics, piece rotation, line clearing, scoring, and level progression.

## Development Commands

- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture

### Core Game Logic (`src/components/TetrisGame.tsx`)

The main game component is a complex React component that manages all Tetris game state and logic:

- **Game State Management**: Uses React's `useState` with a comprehensive `GameState` interface including board, current/next pieces, score, lines, level, and game status
- **Piece System**: Seven standard Tetris pieces (I, O, T, S, Z, J, L) defined as shape matrices with corresponding CSS color classes
- **Game Mechanics**:
  - Collision detection for piece placement and movement
  - Line clearing when rows are completed
  - Piece rotation using matrix transformation
  - Level progression (every 10 lines cleared)
  - Dynamic falling speed based on level

### Styling System

The project uses **custom CSS** (not Tailwind) with semantic class names:
- Game-specific classes: `.game-container`, `.game-board`, `.game-cell`
- Piece color classes: `.cell-cyan`, `.cell-yellow`, `.cell-purple`, etc.
- UI component classes: `.score-panel`, `.button-group`, `.game-button`

### App Structure (Next.js App Router)

- `src/app/layout.tsx` - Root layout with minimal metadata and global CSS import
- `src/app/page.tsx` - Home page that centers and renders the TetrisGame component
- `src/app/globals.css` - Complete styling for the game interface

## Key Implementation Details

### Game Loop
- Uses `useEffect` with `setInterval` for automatic piece falling
- Fall speed decreases as level increases: `Math.max(100, 1000 - (level - 1) * 100)`
- Game loop pauses when game is over or paused

### Controls
- **Arrow keys**: Left/right movement, down for soft drop, up for rotation
- **Space**: Hard drop (instant piece placement)
- **P**: Pause/resume toggle
- **R**: Restart game (when game over)

### State Architecture
The game state is centralized in a single state object with immutable updates. Key state transitions:
1. Piece movement → collision checking → state update or piece placement
2. Line clearing → score calculation → level progression
3. New piece generation → game over check

## Technical Notes

### Dependencies
- **Next.js 15.5.3** with App Router
- **React 19** with hooks (useState, useEffect, useCallback)
- **TypeScript 5.9.2** for type safety
- **jiti 2.5.1** for configuration loading (required for Next.js setup)

### Styling Approach
Previously used TailwindCSS but migrated to custom CSS to avoid dependency issues. The CSS is structured with:
- Reset styles and base typography
- Component-specific class hierarchies
- Color-coded piece styling system
- Responsive button and panel designs

### Performance Considerations
- Extensive use of `useCallback` for game functions to prevent unnecessary re-renders
- Efficient board rendering with key props
- Optimized collision detection algorithms

## Development Notes

When modifying game mechanics, pay attention to:
- The piece coordinate system (x,y where y=0 is top)
- Collision detection boundaries (board edges and existing pieces)
- State immutability patterns throughout the component
- CSS class naming consistency for piece colors and game elements