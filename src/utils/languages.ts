export interface Language {
  id: string;
  name: string;
  extension: string;
  monacoLanguage?: string;
  color: string;
  logo: string;
  defaultCode: string;
}

export const supportedLanguages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    color: '#f7df1e',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    defaultCode: `// JavaScript
console.log('Hello, World!');`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: 'ts',
    color: '#3178c6',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    defaultCode: `// TypeScript
const message: string = 'Hello, World!';
console.log(message);`
  },
  {
    id: 'html',
    name: 'HTML',
    extension: 'html',
    color: '#e34c26',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`
  },
  {
    id: 'css',
    name: 'CSS',
    extension: 'css',
    color: '#264de4',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    defaultCode: `/* CSS */
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}`
  },
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    color: '#3776ab',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    defaultCode: `# Python Example
print("Hello, World!")

# Simple loop
for i in range(5):
    print(f"Count: {i}")
`
  }
];