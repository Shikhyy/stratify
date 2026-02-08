# ✨ Stratify - AI-Powered Strategic Consulting Platform

> **Transform abstract ideas into cinematic, data-driven strategy presentations with your personal AI consultant**

<div align="center">

![Stratify](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Tambo AI](https://img.shields.io/badge/Powered%20by-Tambo%20AI-5865F2?style=flat-square)

---

### 🎯 The Problem
Strategy consultants are expensive. Building decks takes weeks. Data visualization is a nightmare.

### 💡 Our Solution
**Stratify** - Your AI-powered strategic partner that generates, refines, and presents consulting-grade strategies in minutes.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-complete-tech-stack)
- [AI & Tambo SDK Integration](#-ai--tambo-sdk-integration)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Advanced Features](#-advanced-features)
- [Troubleshooting](#-troubleshooting)

---

## 🎬 Overview

Stratify is a **next-generation strategic consulting platform** that combines cutting-edge AI with premium UI/UX design. It guides you through a structured consulting process, generates strategic frameworks on-demand, and produces cinema-quality presentations ready to present to stakeholders.

### What Makes Stratify Different?

| Feature | Traditional Consulting | Stratify |
|---------|----------------------|----------|
| Time to Strategy | 4-8 weeks | 30 seconds - 5 minutes |
| Cost | $50k - $500k+ | Automation cost only |
| Customization | Limited iterations | Unlimited AI refinement |
| Presentation Quality | Varies | Consulting-grade always |
| Data Integration | Manual + Error-prone | AI-powered parsing |

---

## ✨ Key Features

### 🤖 **AI Strategy Partner**
- Analyzes business problems using advanced reasoning
- Generates tailored frameworks for your specific industry & context
- Produces actionable recommendations backed by logic
- Refines strategies based on iterative feedback

### 🎨 **Premium Visual Design**
- **Consulting-grade slide templates** (11+ unique layouts)
- **Dark/Light mode** with industry-specific theming
- **3D animations & interactive elements** powered by Three.js
- **Real-time slide preview** with cinematic transitions
- **Smooth typography & micro-interactions** throughout

### 📊 **Advanced Visualizations**
- Market Sizing waterfalls (TAM/SAM/SOM analysis)
- Financial impact models with scenario planning
- Competitive benchmarking matrices
- Strategic roadmaps with phase gates
- Unit economics & projection models
- Harvey ball matrices for qualitative assessments

### 🎯 **Content Management**
- **Block-based structure** for modular strategy components
- **Edit any block** directly in the interface
- **AI Refine** to improve clarity, add metrics, or expand insights
- **Version history** tracking all iterations
- **Lock/unlock blocks** to protect key concepts

### 📸 **Export & Sharing**
- **Export to PowerPoint (.pptx)** with full formatting
- **Preview mode** for full-screen presentations
- **Slide navigation** with keyboard shortcuts
- **PDF export** support (upcoming)
- **Google Slides** integration (upcoming)

### 🎓 **Smart Case Library**
Pre-built case templates covering 8+ industries:
- 🏦 Finance (Digital Banking, Fintech)
- 💼 Retail & E-commerce
- 🏥 Healthcare
- ⚡ Energy & Utilities
- 🏭 Manufacturing
- 📚 Education & EdTech
- 💻 SaaS & Technology
- 🎯 Management Consulting

---

## 🛠️ Complete Tech Stack

### **Frontend Framework**
- **React 19.2** - Modern UI library with hooks & concurrent features
- **Vite 7.3** - Lightning-fast build tool & dev server
- **TypeScript 5.0** - Type-safe JavaScript with strict checking

### **Styling & Animation**
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Framer Motion 12** - Production-grade animation library
- **Tailwind Merge** - Smart class name merging
- **Class Variance** - Type-safe component variants
- **Lucide React** - 563+ beautiful SVG icons

### **Data Visualization**
- **Recharts 3.7** - Composable charting library
- **React Three Fiber** - React renderer for Three.js
- **Three.js 0.182** - 3D graphics library

### **AI & LLM Integration**
- **@tambo-ai/react 0.74.1** - Tambo SDK for AI-powered tool calling
- **Zod 4.3** - TypeScript schema validation

### **Export & Presentation**
- **pptxgenjs 4.0.1** - PowerPoint file generation
- **lucide-react** - Icons for UI

### **Development Tools**
- ESLint - Code linting
- PostCSS - CSS transformation
- TypeScript - Type checking
- Vite Config with history API fallback

---

## 🧠 AI & Tambo SDK Integration

### **What is Tambo AI?**

Tambo is a **generative AI platform** specifically designed for building AI-powered applications with structured outputs. Unlike generic LLMs, Tambo understands **tool definitions** and reliably calls the right tools with valid data.

### **How Stratify Uses Tambo**

#### **1. Tool Registry System**
Stratify maintains a **registry of 11 strategic slide components**, each with strict Zod schemas:

**Location:** `src/tambo.config.ts`

```typescript
export const STRATIFY_TOOLS = [
  {
    name: "MarketSizingSlide",
    component: MarketSizingSlide,
    description: "Market sizing framework with TAM/SAM/SOM analysis",
    propsSchema: MarketSizingSchema,
  },
  {
    name: "FinancialImpactSlide",
    component: FinancialImpactSlide,
    description: "Financial impact with base/bull/bear scenarios",
    propsSchema: FinancialImpactSchema,
  },
  {
    name: "StrategicRoadmap",
    component: StrategicRoadmap,
    description: "Strategic roadmap with phases and milestones",
    propsSchema: RoadmapSchema,
  },
  // ... 8 more specialized slide types
];
```

This allows Tambo to **understand what your UI can render** and generate valid data on first try.

#### **2. Conversational Thread Management**
**Location:** `src/components/ChatInterface.tsx`

```typescript
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';

const { thread } = useTamboThread();          // Full conversation history
const { value, setValue, submit } = useTamboThreadInput();  // Input handling
```

**How it works:**
1. User asks: *"Create a market sizing slide for a SaaS company"*
2. Tambo analyzes request + full conversation history
3. Calls appropriate tool with generated data
4. Stratify renders the slide in real-time
5. User refines: *"Make the TAM bigger, show 5x growth"*
6. Tambo updates the same context with new data

#### **3. AI-Powered Block Refinement**
**Location:** `src/components/PitchBlockCard.tsx`

```typescript
const handleRefine = async () => {
  await regenerateBlock(block.id, 
    'Improve clarity, add specific metrics, and make more compelling'
  );
};
```

The AI maintains context from:
- Previous block iterations
- Industry type
- Problem statement
- Entire strategic framework

#### **4. Smart Strategy Generation Pipeline**
**Location:** `src/utils/strategyEngine.ts`

```typescript
const generatePitch = async (caseInput: CaseInput) => {
  // Step 1: Deconstruct the case
  const deconstruction = deconstructCase(caseInput);
  
  // Step 2: Generate non-obvious insights
  const insights = generateInsights(caseInput, deconstruction);
  
  // Step 3: Build a locked storyline outline
  const outline = buildStorylineOutline(caseInput, deconstruction, insights);
  
  // Step 4: Create structured blocks
  const blocks = buildBlocksFromStoryline(outline, caseInput, deconstruction, insights);
  
  // Step 5: Convert to slides using Tambo tools
  const slides = buildSlidesFromStoryline(outline);
};
```

#### **5. Real-time Tool Execution**
When Tambo generates a tool call, Stratify automatically:

```typescript
useEffect(() => {
  if (lastMessage?.tool_calls?.length > 0) {
    lastMessage.tool_calls.forEach(toolCall => {
      const toolName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      addSlide(toolName, args);
    });
  }
}, [thread?.messages?.length]);
```

### **Tambo Features Leveraged**

| Feature | Usage |
|---------|-------|
| **Tool Calling** | Generate slides with guaranteed valid data |
| **Streaming** | Real-time AI thinking visualization |
| **Message History** | Seamless multi-turn conversations |
| **Context Window** | Remember entire strategy context |
| **State Management** | Handle complex conversation state |

---

## 🏗️ Architecture

### **High-Level Flow**

```
User Input (Problem + Constraints)
              ↓
Strategy Engine (AI Analysis)
    • Deconstruct case
    • Generate insights
    • Build outline
    • Create blocks
              ↓
Tambo AI Tool Calling System
    • Select slide types
    • Generate data
    • Provide narratives
              ↓
React Component Rendering
    • Slide Canvas
    • Block Editor
    • Chat Interface
    • Intelligence Panel
              ↓
Export & Presentation
    • PowerPoint export
    • Full-screen preview
    • Shareable deck
```

### **State Management Architecture**

```
Global Contexts
├── DeckContext
│   ├── slides: Slide[]
│   └── addSlide, updateSlide, deleteSlide
├── PitchContext
│   ├── blocks: PitchBlock[]
│   ├── judgeScore: JudgeScore
│   └── updateBlock, regenerateBlock
└── ThemeContext
    └── isDark, toggleTheme

Components
├── DashboardPRD (Main)
├── SlideCanvas (Rendering)
├── PitchBlockCard (Editor)
├── ChatInterface (AI)
└── IntelligencePanel (Evaluator)

AI Layer (Tambo)
├── TamboProvider
├── useTamboThread
└── Tool Definitions
```

---

## 📁 Project Structure

```
stratify/
├── src/
│   ├── components/
│   │   ├── DashboardPRD.tsx          # Main dashboard
│   │   ├── ChatInterface.tsx         # AI conversation
│   │   ├── PitchBlockCard.tsx        # ✨ Block editor
│   │   ├── IntelligencePanel.tsx     # Judge evaluator
│   │   ├── CaseInputPanel.tsx        # Case setup
│   │   ├── DeckPreviewModal.tsx      # Full preview
│   │   ├── LandingPage.tsx           # Home page
│   │   ├── slides/                   # Strategic slide types
│   │   │   ├── MarketSizingSlide.tsx
│   │   │   ├── FinancialImpactSlide.tsx
│   │   │   ├── StrategicRoadmap.tsx
│   │   │   └── ... (8 more)
│   │   └── ui/
│   │       ├── SlideReel.tsx         # Thumbnails
│   │       ├── glowing-effect.tsx    # Glow component
│   │       ├── ErrorBoundary.tsx
│   │       └── TextStream.tsx
│   ├── context/
│   │   ├── DeckContext.tsx           # Slides state
│   │   ├── PitchContext.tsx          # Blocks state
│   │   └── ThemeContext.tsx          # Theme state
│   ├── hooks/
│   │   ├── useExportDeck.ts          # PPTX export
│   │   └── useJudgeEvaluator.ts      # Evaluation
│   ├── utils/
│   │   ├── strategyEngine.ts         # Core generation
│   │   ├── consultingRules.ts        # Frameworks
│   │   ├── infographicEngine.ts      # Visualization
│   │   └── security.ts               # Security
│   ├── tambo.config.ts               # 🤖 AI tools
│   ├── types/
│   │   └── deck.ts                   # TypeScript types
│   ├── App.tsx                       # Root
│   └── main.tsx                      # Entry
├── public/                           # Assets
├── .env.local                        # API keys
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm 10+
- Tambo API Key ([get one at tambo.ai](https://tambo.ai))

### **Installation**

```bash
# Clone repository
git clone https://github.com/yourusername/stratify.git
cd stratify

# Install dependencies
npm install

# Create environment file
echo "VITE_TAMBO_API_KEY=your_api_key_here" > .env.local
```

### **Development**

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### **Production Build**

```bash
npm run build
npm run preview
```

---

## 📖 Usage Guide

### **Step 1: Select or Create a Case**
- Choose a preset case template OR
- Fill in custom problem statement
- Define constraints and target metrics
- Select your industry

### **Step 2: Generate Strategy**
- Click **"Generate Pitch"** button
- Watch AI build your framework in real-time
- Slides generate with data automatically

### **Step 3: Refine & Edit**
- **Edit**: Click "Edit" on any block card
- **Refine**: Click "Refine" for AI improvement
- **Lock**: Protect key insights
- **Versions**: See all iterations

### **Step 4: Chat with AI**
Use the Chat panel:
- *"Change the market size to $100B"*
- *"Add risk mitigation strategy"*
- *"Make financials more conservative"*

### **Step 5: Evaluate Quality**
- Click **"Judge Eval"** for structured feedback
- Scores: Clarity, Insights, Feasibility, Financial Logic
- Auto-fixes weak slides (score < 7.5)

### **Step 6: Export**
- Click **"Export PPTX"** to download
- Click **"Preview Deck"** for full-screen mode
- Share with stakeholders

---

## 🎯 Advanced Features

### **Block Locking**
Prevent accidental changes:
```typescript
lockBlock(blockId)
```

### **Version History**
Every edit creates a version:
```typescript
block.versions: {
  timestamp: number,
  content: string
}[]
```

### **Industry Theming**
Auto-selected colors:
- 🏦 Finance: Green & Navy
- 🏥 Healthcare: Red & White
- ⚡ Energy: Amber & Orange
- 💻 Tech: Blue & Purple

### **Judge Evaluator**
AI-powered scoring:
- **Clarity** (1-10)
- **Insight Strength** (1-10)
- **Feasibility** (1-10)
- **Financial Logic** (1-10)
- **Overall Score**

---

## 🐛 Troubleshooting

### **Dev Server Won't Start**

```bash
# Clear cache and reinstall
rm -rf node_modules .vite
npm install
npm run dev
```

### **Tambo API Key Not Found**

```bash
# Verify .env.local exists
cat .env.local

# Add if missing
echo "VITE_TAMBO_API_KEY=your_key" > .env.local
```

### **Build Errors**

```bash
# TypeScript errors
npm run build

# Check linting
npm run lint

# Fix issues
npm run lint -- --fix
```

---

## 🤝 Contributing

Contributions welcome! 

```bash
git checkout -b feature/AmazingFeature
git commit -m 'Add AmazingFeature'
git push origin feature/AmazingFeature
```

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🙋 Support

- **GitHub Issues**: [Report bugs](https://github.com/yourusername/stratify/issues)
- **Email**: support@stratify.ai
- **Docs**: [docs.stratify.ai](https://docs.stratify.ai)

---

<div align="center">

Made with ❤️ by the Stratify Team

**[Website](https://stratify.ai) • [Documentation](https://docs.stratify.ai) • [Tambo AI](https://tambo.ai)**

</div>
