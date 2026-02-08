# Stratify

Stratify is your AI-powered strategic consultant, designed to transform abstract ideas into actionable, data-driven strategies and cinematic presentations. It acts as an intelligent partner, guiding you through the strategy-building process and instantly visualizing your vision with premium, high-impact design.

## ✨ Key Features

- **AI Strategy Partner**: Stratify acts as a consultant, analyzing your inputs to generate comprehensive strategic frameworks and narratives tailored to your industry.
- **Skiper UI**: A cinematic, fluid interface featuring blur-reveal typography, floating command centers, and physics-based interactions that make every action feel premium.
- **Variability Engine**: Dynamically adapts the interface with industry-specific themes and diverse layout options (Default, Minimal, Focused) to match the context of your presentation.
- **Generative UI**: Powered by **Tambo AI**, Stratify instantly generates complex UI components and data visualizations based on natural language prompts.
- **Interactive Visualization**: Engaging 3D elements powered by **Three.js** and dynamic charts via **Recharts** bring data to life.
- **Presentation Mode**: Seamlessly transition from strategy building to presenting with a dedicated mode that supports slide navigation and export to PowerPoint.

## 🧠 Powered by Tambo SDK

Stratify is built on top of the **Tambo SDK**, leveraging its powerful generative capabilities to bridge the gap between abstract strategy and concrete visualization. The integration is deep and fundamental to the application's architecture:

### 1. Generative UI Registry
Stratify maps strict **Zod schemas** to React components using `STRATIFY_TOOLS`. This allows Tambo's AI to "understand" our UI library and generate complex, interactive slides that are guaranteed to render correctly.

```typescript
// Example: Mapping a schema to a component
export const STRATIFY_TOOLS = [
    {
        name: "FinancialImpactSlide",
        component: FinancialImpactSlide,
        description: "Financial impact chart with base/bull/bear scenarios.",
        propsSchema: FinancialImpactSchema, // Zod schema defining the data structure
    },
    // ... other tools
];
```

### 2. Conversational State Management
We use the `TamboProvider` and `useTamboThread` hooks to manage the entire strategic session. The SDK handles the context window, message history, and tool calling, allowing us to focus on building the best possible strategy interface.

### 3. Real-time Streaming
Tambo's streaming capabilities ensure that the UI is built in real-time as the AI "thinks", providing immediate feedback and a truly interactive consulting experience.

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
