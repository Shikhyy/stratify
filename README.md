# Stratify

Stratify is a next-generation strategy and presentation platform that leverages AI to transform ideas into cinematic, data-driven narratives. It combines a fluid, high-performance interface with powerful generative capabilities to redefine how strategies are built and presented.

## ✨ Key Features

- **Skiper UI**: A cinematic, fluid interface featuring blur-reveal typography, floating command centers, and physics-based interactions that make every action feel premium.
- **Variability Engine**: dynamically adapts the interface with industry-specific themes and diverse layout options (Default, Minimal, Focused) to match the context of your presentation.
- **Generative UI**: Powered by **Tambo AI**, Stratify can instantly generate complex UI components and data visualizations based on natural language prompts.
- **Interactive Visualization**: engaging 3D elements powered by **Three.js** and dynamic charts via **Recharts** bring data to life.
- **Presentation Mode**: Seamlessly transition from strategy building to presenting with a dedicated mode that supports slide navigation and export to PowerPoint.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
- **AI Integration**: [Tambo AI SDK](https://www.tambo.ai/)
- **Utilities**: `clsx`, `tailwind-merge`, `lucide-react`

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Shikhyy/stratify.git
    cd stratify
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

To create a production-ready build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components
├── context/      # React Context for state management (Deck, Pitch)
├── hooks/        # Custom React hooks
├── lib/          # Utility libraries and configurations
├── providers/    # Global application providers
├── types/        # TypeScript type definitions
├── utils/        # Helper functions
├── App.tsx       # Main application component
└── main.tsx      # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
