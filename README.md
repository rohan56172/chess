# ♟️ Chess Game

A feature-rich chess application built with **Next.js 16**, **TypeScript**, and **Clean Architecture** principles. Play local multiplayer with full chess rules implementation, responsive design, and modern UI.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## 🎮 Current Build: Local Multiplayer

**Play chess locally with two players on the same device:**
- ✅ Complete chess rules (all pieces, special moves)
- ✅ Turn-based gameplay with visual feedback
- ✅ Move history with undo/redo functionality
- ✅ Fully responsive (desktop to mobile)
- ✅ Game state persistence (auto-save)

## ✨ Key Features

### Chess Rules ✅
- All piece movements (Pawn, Knight, Bishop, Rook, Queen, King)
- Special moves: **Castling**, **En Passant**, **Pawn Promotion**
- Check, checkmate, and stalemate detection
- Legal move validation and indicators

### Interactive UI ✅
- Click-to-move interface
- Visual legal move indicators
- Last move highlighting
- Selected piece feedback
- Turn-based move validation
- Invalid move notifications

### Game Controls ✅
- **Undo/Redo** - Navigate through move history
- **New Game** - Start fresh match
- **Resign** - Forfeit current game
- **Move History** - View all moves with notation
- **Auto-save** - Game state persists in browser

### Responsive Design ✅
- Desktop (1920px - 1024px)
- Tablet (1024px - 768px)
- Mobile (< 768px) with optimized layout
- Dynamic board and piece sizing
- Touch-friendly controls

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **State Management** | React Context API |
| **Storage** | LocalStorage (Repository Pattern) |
| **Architecture** | Clean Architecture + SOLID Principles |
| **Design Patterns** | Repository, Adapter, Dependency Injection |

## 🎯 Project Goals

Built as a learning project to master:
1. **Clean Architecture** - Separation of concerns (Domain, Application, Infrastructure)
2. **SOLID Principles** - Maintainable and scalable code
3. **Design Patterns** - Repository pattern, Dependency Injection
4. **TypeScript** - Type-safe development
5. **Modern React** - Context API, custom hooks, component composition

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/Daarns/chess-game.git
cd chess-game

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

### Build for Production

```bash
npm run build
npm start
```

## 🎮 How to Play

1. **Start Game** - Click "New Game" button
2. **Make Move** - Click piece → Click destination square
3. **Special Moves**:
   - **Castling**: Click King → Click 2 squares left/right
   - **En Passant**: Automatically available when valid
   - **Promotion**: Choose piece when pawn reaches end rank
4. **Undo/Redo** - Navigate move history with arrow buttons
5. **View History** - See all moves with standard chess notation

## 🗺️ Development Roadmap

### ✅ Phase 1: Local Multiplayer (COMPLETED)
- [x] Full chess rules implementation
- [x] Interactive board with legal moves
- [x] Undo/redo functionality
- [x] Move history viewer
- [x] Responsive design
- [x] Game state persistence

### 🔄 Phase 2: Enhancements (PLANNED)
- [ ] Sound effects (move, capture, check)
- [ ] Drag & drop movement
- [ ] Move timer/clock
- [ ] FEN/PGN import/export

### 🔮 Phase 3: AI Opponent (PLANNED)
- [ ] Minimax algorithm with alpha-beta pruning
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Move suggestions
- [ ] Position evaluation

### 🚀 Phase 4: Online Multiplayer (FUTURE)
- [ ] Python FastAPI backend
- [ ] WebSocket real-time games
- [ ] User authentication
- [ ] PostgreSQL database
- [ ] Docker deployment

## 📱 Responsive Breakpoints

| Device | Screen Size | Status |
|--------|-------------|--------|
| Desktop 4K | 1920px+ | ✅ |
| Desktop FHD | 1440px - 1919px | ✅ |
| Laptop | 1024px - 1439px | ✅ |
| Tablet | 768px - 1023px | ✅ |
| Mobile | < 768px | ✅ |

## 🏗️ Architecture Highlights

### Clean Architecture Layers
```
Presentation → Application → Domain → Infrastructure
    (UI)         (Use Cases)   (Rules)   (Data/External)
```

### Key Design Patterns
- **Repository Pattern** - Abstract data persistence
- **Dependency Injection** - Loose coupling
- **Use Case Pattern** - Encapsulated business logic
- **Adapter Pattern** - External format conversion (FEN, PGN)

### SOLID Principles Applied
- **SRP**: Each class has single responsibility
- **OCP**: Open for extension, closed for modification
- **LSP**: Piece inheritance hierarchy
- **ISP**: Focused interfaces (IGameRepository, IMoveValidator)
- **DIP**: Depend on abstractions, not implementations

## 🐛 Known Issues

None currently! 🎉

## 📊 Project Stats

- **Lines of Code**: ~5,000+
- **Components**: 15+
- **Use Cases**: 6
- **Supported Devices**: All screen sizes

## 👨‍💻 Author

**Daarn**
- GitHub: [@Daarns](https://github.com/Daarns)

Built with ❤️ for learning software architecture and TypeScript.

---

⭐ **Star this repo** if you find it useful!

## 📞 Questions or Feedback?

Open an issue on [GitHub](https://github.com/Daarns/chess-game/issues)
