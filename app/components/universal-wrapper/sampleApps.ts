import type { AppConfig } from '~/types/universal-wrapper';

export const SAMPLE_APPLICATIONS: AppConfig[] = [
  {
    id: 'google-search',
    name: 'Google Search',
    description: 'Quick access to Google search with embedded results',
    type: 'website',
    category: 'productivity',
    icon: '🔍',
    url: 'https://www.google.com/search?igu=1',
    metadata: {
      author: 'Google',
      version: '1.0',
      tags: ['search', 'web', 'productivity'],
      featured: true,
    },
  },
  {
    id: 'figma-design',
    name: 'Figma Design Tool',
    description: 'Collaborative design tool for teams to create, prototype, and collaborate',
    type: 'webapp',
    category: 'design',
    icon: '🎨',
    url: 'https://www.figma.com',
    metadata: {
      author: 'Figma',
      version: '1.0',
      tags: ['design', 'prototype', 'collaboration'],
      featured: true,
    },
  },
  {
    id: 'advanced-calculator',
    name: 'Advanced Calculator',
    description: 'Feature-rich calculator with scientific functions and history',
    type: 'custom',
    category: 'productivity',
    icon: '🧮',
    embed_code: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; color: #333;">Advanced Calculator</h2>
        <div id="calculator" style="border: 2px solid #ddd; border-radius: 10px; padding: 20px; background: #f9f9f9;">
          <input type="text" id="display" readonly style="width: 100%; padding: 15px; font-size: 24px; text-align: right; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 15px;">
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <button onclick="clearDisplay()" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #ff6b6b; color: white; cursor: pointer;">C</button>
            <button onclick="appendToDisplay('/')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #4ecdc4; color: white; cursor: pointer;">÷</button>
            <button onclick="appendToDisplay('*')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #4ecdc4; color: white; cursor: pointer;">×</button>
            <button onclick="deleteLast()" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #ffa726; color: white; cursor: pointer;">⌫</button>
            
            <button onclick="appendToDisplay('7')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">7</button>
            <button onclick="appendToDisplay('8')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">8</button>
            <button onclick="appendToDisplay('9')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">9</button>
            <button onclick="appendToDisplay('-')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #4ecdc4; color: white; cursor: pointer;">−</button>
            
            <button onclick="appendToDisplay('4')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">4</button>
            <button onclick="appendToDisplay('5')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">5</button>
            <button onclick="appendToDisplay('6')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">6</button>
            <button onclick="appendToDisplay('+')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #4ecdc4; color: white; cursor: pointer;">+</button>
            
            <button onclick="appendToDisplay('1')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">1</button>
            <button onclick="appendToDisplay('2')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">2</button>
            <button onclick="appendToDisplay('3')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">3</button>
            <button onclick="calculate()" rowspan="2" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #45b7d1; color: white; cursor: pointer; grid-row: span 2;">=</button>
            
            <button onclick="appendToDisplay('0')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer; grid-column: span 2;">0</button>
            <button onclick="appendToDisplay('.')" style="padding: 15px; font-size: 18px; border: none; border-radius: 5px; background: #e0e0e0; cursor: pointer;">.</button>
          </div>
          
          <div style="margin-top: 15px;">
            <button onclick="appendToDisplay('Math.sin(')" style="padding: 8px 12px; margin: 2px; border: none; border-radius: 3px; background: #9b59b6; color: white; cursor: pointer;">sin</button>
            <button onclick="appendToDisplay('Math.cos(')" style="padding: 8px 12px; margin: 2px; border: none; border-radius: 3px; background: #9b59b6; color: white; cursor: pointer;">cos</button>
            <button onclick="appendToDisplay('Math.tan(')" style="padding: 8px 12px; margin: 2px; border: none; border-radius: 3px; background: #9b59b6; color: white; cursor: pointer;">tan</button>
            <button onclick="appendToDisplay('Math.sqrt(')" style="padding: 8px 12px; margin: 2px; border: none; border-radius: 3px; background: #e74c3c; color: white; cursor: pointer;">√</button>
            <button onclick="appendToDisplay('Math.pow(')" style="padding: 8px 12px; margin: 2px; border: none; border-radius: 3px; background: #e74c3c; color: white; cursor: pointer;">x^y</button>
          </div>
        </div>
        
        <div id="history" style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px; border: 1px solid #ddd;">
          <h3 style="margin-top: 0; color: #333;">History</h3>
          <div id="historyList" style="max-height: 150px; overflow-y: auto;"></div>
        </div>
      </div>

      <script>
        let history = [];
        
        function appendToDisplay(value) {
          document.getElementById('display').value += value;
        }
        
        function clearDisplay() {
          document.getElementById('display').value = '';
        }
        
        function deleteLast() {
          const display = document.getElementById('display');
          display.value = display.value.slice(0, -1);
        }
        
        function calculate() {
          const display = document.getElementById('display');
          const expression = display.value;
          
          try {
            const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'));
            const calculation = expression + ' = ' + result;
            
            display.value = result;
            addToHistory(calculation);
          } catch (error) {
            display.value = 'Error';
            setTimeout(() => { display.value = ''; }, 1500);
          }
        }
        
        function addToHistory(calculation) {
          history.unshift(calculation);
          if (history.length > 10) history.pop();
          
          const historyList = document.getElementById('historyList');
          historyList.innerHTML = history.map(item => 
            '<div style="padding: 5px; border-bottom: 1px solid #eee; font-family: monospace;">' + item + '</div>'
          ).join('');
        }
        
        // Keyboard support
        document.addEventListener('keydown', function(event) {
          const key = event.key;
          if ('0123456789+-*/.'.includes(key)) {
            appendToDisplay(key);
          } else if (key === 'Enter' || key === '=') {
            calculate();
          } else if (key === 'Escape' || key === 'c' || key === 'C') {
            clearDisplay();
          } else if (key === 'Backspace') {
            deleteLast();
          }
        });
      </script>
    `,
    metadata: {
      author: 'KN3AUX-CODE™',
      version: '2.1',
      tags: ['calculator', 'math', 'scientific'],
      featured: true,
    },
  },
  {
    id: 'youtube-player',
    name: 'YouTube Player',
    description: 'Embedded YouTube video player with playlist support',
    type: 'website',
    category: 'entertainment',
    icon: '📹',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    metadata: {
      author: 'YouTube',
      version: '1.0',
      tags: ['video', 'streaming', 'entertainment'],
      featured: false,
    },
  },
  {
    id: 'code-editor',
    name: 'Online Code Editor',
    description: 'Syntax highlighting code editor with multiple language support',
    type: 'custom',
    category: 'development',
    icon: '👨‍💻',
    embed_code: `
      <div style="font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Online Code Editor</h2>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Language:</label>
          <select id="languageSelect" onchange="changeLanguage()" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
        </div>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #f8f8f8;">
          <div style="background: #2d3748; color: white; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span id="languageTitle" style="font-weight: bold;">JavaScript</span>
            <div>
              <button onclick="runCode()" style="background: #48bb78; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">▶ Run</button>
              <button onclick="clearEditor()" style="background: #e53e3e; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;">Clear</button>
            </div>
          </div>
          
          <textarea id="codeEditor" style="width: 100%; height: 300px; border: none; padding: 15px; font-family: inherit; font-size: 14px; line-height: 1.4; resize: vertical; background: white;" placeholder="Write your code here...">
// Welcome to the Online Code Editor!
function greet(name) {
  return \`Hello, \${name}! Welcome to coding.\`;
}

console.log(greet('Developer'));

// Try running this code!
          </textarea>
        </div>
        
        <div style="margin-top: 15px;">
          <h3 style="color: #333; margin-bottom: 10px;">Output:</h3>
          <div id="output" style="background: #1a202c; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 13px; min-height: 100px; white-space: pre-wrap; overflow-x: auto;">
Ready to run code...
          </div>
        </div>
        
        <div style="margin-top: 15px; padding: 12px; background: #e6fffa; border: 1px solid #81e6d9; border-radius: 6px; font-size: 14px;">
          <strong>Features:</strong> Syntax highlighting simulation, multiple languages, code execution simulation, and clean output display.
        </div>
      </div>

      <script>
        const codeExamples = {
          javascript: \`// Welcome to the Online Code Editor!
function greet(name) {
  return \\\`Hello, \${name}! Welcome to coding.\\\`;
}

console.log(greet('Developer'));

// Try running this code!\`,
          python: \`# Welcome to Python!
def greet(name):
    return f"Hello, {name}! Welcome to Python."

print(greet('Developer'))

# Try running this code!\`,
          html: \`<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to HTML coding!</p>
</body>
</html>\`,
          css: \`/* Welcome to CSS! */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
    border-bottom: 2px solid #007bff;
}\`,
          json: \`{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "skills": ["JavaScript", "Python", "HTML", "CSS"],
  "isActive": true
}\`
        };
        
        function changeLanguage() {
          const select = document.getElementById('languageSelect');
          const language = select.value;
          const editor = document.getElementById('codeEditor');
          const title = document.getElementById('languageTitle');
          
          title.textContent = language.charAt(0).toUpperCase() + language.slice(1);
          editor.value = codeExamples[language];
          clearOutput();
        }
        
        function runCode() {
          const language = document.getElementById('languageSelect').value;
          const code = document.getElementById('codeEditor').value;
          const output = document.getElementById('output');
          
          output.textContent = 'Running code...\\n';
          
          setTimeout(() => {
            switch(language) {
              case 'javascript':
                try {
                  const result = eval(code);
                  output.textContent = \`Code executed successfully!\\nResult: \${result !== undefined ? result : 'undefined'}\\n\\n--- Simulated Console Output ---\\nHello, Developer! Welcome to coding.\`;
                } catch (error) {
                  output.textContent = \`Error: \${error.message}\`;
                }
                break;
              case 'python':
                output.textContent = \`Python code executed successfully!\\n--- Simulated Output ---\\nHello, Developer! Welcome to Python.\`;
                break;
              case 'html':
                output.textContent = \`HTML parsed successfully!\\n--- Simulated Browser Output ---\\nPage would display: "Hello, World!" with welcome text.\`;
                break;
              case 'css':
                output.textContent = \`CSS compiled successfully!\\n--- Simulated Styles ---\\nBody: Arial font, light gray background\\nH1: Centered with blue underline\`;
                break;
              case 'json':
                try {
                  JSON.parse(code);
                  output.textContent = \`JSON validated successfully!\\n--- Simulated Parse Result ---\\nValid JSON object with user data.\`;
                } catch (error) {
                  output.textContent = \`JSON Error: \${error.message}\`;
                }
                break;
              default:
                output.textContent = 'Language not supported in simulation mode.';
            }
          }, 1000);
        }
        
        function clearEditor() {
          document.getElementById('codeEditor').value = '';
          clearOutput();
        }
        
        function clearOutput() {
          document.getElementById('output').textContent = 'Ready to run code...';
        }
        
        // Add syntax highlighting effect (visual only)
        const editor = document.getElementById('codeEditor');
        editor.addEventListener('input', function() {
          // This would normally integrate with a real syntax highlighter
          // For demo purposes, we're just showing the concept
        });
      </script>
    `,
    metadata: {
      author: 'KN3AUX-CODE™',
      version: '1.5',
      tags: ['code', 'editor', 'programming', 'syntax'],
      featured: true,
    },
  },
  {
    id: 'chrome-extension-demo',
    name: 'Chrome Extension Demo',
    description: 'Demonstration of Chrome extension manifest and installation process',
    type: 'extension',
    category: 'development',
    icon: '🧩',
    extension_manifest: {
      manifest_version: 3,
      name: 'Universal Wrapper Extension',
      version: '1.0.0',
      description: 'A sample Chrome extension for the Universal Wrapper platform',
      permissions: ['activeTab', 'storage'],
      host_permissions: ['https://*/*'],
      action: {
        default_popup: 'popup.html',
        default_title: 'Universal Wrapper',
        default_icon: {
          '16': 'icon16.png',
          '32': 'icon32.png',
          '48': 'icon48.png',
          '128': 'icon128.png',
        },
      },
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['content.js'],
          css: ['content.css'],
        },
      ],
    },
    metadata: {
      author: 'KN3AUX-CODE™',
      version: '1.0.0',
      tags: ['extension', 'chrome', 'browser'],
      featured: false,
    },
  },
];