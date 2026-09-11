const fs = require('fs');
const path = require('path');

const code = fs.readFileSync('src/components/dashboard/AdminDashboard.jsx', 'utf8');

try {
  const babelParser = require('@babel/parser');
  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log("SUCCESS: AdminDashboard.jsx parsed 100% cleanly without any syntax errors!");
} catch(err) {
  console.error("SYNTAX ERROR in AdminDashboard.jsx:");
  console.error("Line:", err.loc ? err.loc.line : "N/A");
  console.error("Column:", err.loc ? err.loc.column : "N/A");
  console.error("Message:", err.message);
}
