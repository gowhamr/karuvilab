export const minesweeper = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: Grid Algorithms & The Flood Fill Technique

Welcome to the engineering guide to Minesweeper. Beyond being a classic Windows game, it is a masterclass in 2D array traversal, state management, and recursive search algorithms.

---

## 1. Prerequisites: The 2D Array

The visual grid of Minesweeper (e.g., 10x10) is represented in memory as a **2D Array** (an array of arrays). 
Each cell is an object containing crucial state flags:
- \`isMine\`: Boolean (True if a bomb is here).
- \`isRevealed\`: Boolean (True if the user clicked it).
- \`isFlagged\`: Boolean (True if the user right-clicked to mark a bomb).
- \`neighborMines\`: Integer (0 to 8, the number of bombs touching this cell).

---

## 2. Engineering Challenge: The "First Click" Guarantee

Have you ever wondered why you almost never hit a bomb on your very first click in Windows Minesweeper?

**The Trick:** The game board is *not* generated when the game starts!
If the bombs were placed randomly at load time, the user would have a statistical chance of instantly losing on click #1. 

Instead, the game utilizes **Lazy Initialization**. 
1. The user clicks a random square (e.g., row 4, column 4).
2. *Then*, the engine generates the board. It randomly places bombs in the array, but explicitly runs a check to ensure that no bomb is placed at (4,4) or its immediate 8 neighbors. 
3. The game begins, guaranteeing the user a safe, satisfying opening area.

---

## 3. Mathematical Foundations: The Flood Fill Algorithm

When you click an empty square (0 neighbor mines), a massive chunk of the board instantly opens up. How does the computer do this so fast?

It uses a classic computer science algorithm called **Flood Fill** (the exact same algorithm the "Paint Bucket" tool uses in Photoshop).

**The Depth-First Search (DFS) Implementation:**
1. The user clicks a cell. If \`neighborMines == 0\`:
2. The code marks the cell as \`isRevealed = true\`.
3. The code runs a loop over all 8 adjacent neighbors.
4. For each unrevealed neighbor, it recursively calls the *exact same function*. 
5. The function spiders outward in milliseconds, instantly stopping the moment it hits a boundary (a cell with \`neighborMines > 0\`), creating the satisfying cascade effect.

---

## 4. Production Workflows

Why do software engineers study Minesweeper?
- **UI State Management:** In React, if you naively trigger a state update every time a single cell in a 400-cell grid changes, the browser will freeze. Building Minesweeper forces engineers to learn batch rendering and optimized DOM updates.
- **Pathfinding (AI):** The grid neighbor-checking math (checking rows -1 to +1, columns -1 to +1) is the exact foundational math used in AI pathfinding algorithms (like A* Search) for video games and autonomous robots mapping a room.

`,
    howTo: [
        "**Step 1:** Select a difficulty level (Grid size and Mine count).",
        "**Step 2:** Left-click to reveal a cell. The engine guarantees your first click is safe via Lazy Initialization.",
        "**Step 3:** Right-click to flag a cell you suspect contains a mine.",
        "**Step 4:** If you click an empty cell (0), observe the DFS Flood Fill algorithm instantly cascade open the surrounding safe zones."
    ],
    faq: [
        {
            question: "Is this a pure game?",
            answer: "While fully playable, this version is built to demonstrate React concurrent rendering and efficient 2D array state updates in the browser."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["Sudoku", "2048"]
};
