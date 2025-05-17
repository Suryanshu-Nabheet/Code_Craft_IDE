# CodeCraft IDE

A modern, browser-based IDE with support for multiple programming languages, built with React and TypeScript.

## 🚀 Features

- 🌈 Multiple language support (JavaScript, TypeScript, Python, HTML, CSS)
- 🎨 Dark/Light theme support
- 📝 Monaco Editor integration
- 🐍 In-browser Python execution using Pyodide
- 💻 Integrated terminal with ANSI color support
- 📱 Responsive design for desktop and mobile
- 💾 Code saving functionality
- 📤 Code sharing capabilities

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Terminal**: XTerm.js
- **Python Runtime**: Pyodide
- **Build Tool**: Vite
- **Package Manager**: npm/yarn
- **Icons**: Lucide Icons

## 📁 Project Structure

```
IDE/
├── src/
│   ├── components/
│   │   ├── EditorPane.tsx       # Monaco editor component
│   │   ├── Header.tsx           # Application header with controls
│   │   ├── LanguageSelector.tsx # Language selection dropdown
│   │   └── TerminalPane.tsx     # Terminal output component
│   ├── contexts/
│   │   ├── EditorContext.tsx    # Editor state management
│   │   └── ThemeContext.tsx     # Theme management
│   ├── utils/
│   │   └── languages.ts         # Language configurations
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── public/
│   └── assets/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/IDE.git
cd IDE
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 💻 Usage

1. Select a programming language from the dropdown
2. Write or paste your code in the editor
3. Click the "Run" button to execute the code
4. View the output in the integrated terminal
5. Use the "Save" button to download your code
6. Use the "Share" button to share your code

## 🌈 Supported Languages

- JavaScript (`.js`)
- TypeScript (`.ts`)
- Python (`.py`)
- HTML (`.html`)
- CSS (`.css`)

## 🔒 Security

- Python code runs in a sandboxed environment using Pyodide
- JavaScript execution is isolated and sandboxed
- No server-side code execution

## ⚡ Performance

- Monaco Editor is loaded lazily
- Pyodide is loaded on-demand
- Optimized terminal rendering
- Responsive design with minimal re-renders

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Pyodide](https://pyodide.org/)
- [XTerm.js](https://xtermjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

## 📧 Contact

Your Name - [@yourusername](https://github.com/yourusername)

Project Link: [https://github.com/yourusername/IDE](https://github.com/yourusername/IDE)

---

Made with ❤️ using React and TypeScript