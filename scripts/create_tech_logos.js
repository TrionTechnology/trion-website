const fs = require('fs');
const path = require('path');

const techLogos = [
  { name: 'postgresql', color: '#336791' },
  { name: 'mongodb', color: '#47A248' },
  { name: 'redis', color: '#DC382D' },
  { name: 'kubernetes', color: '#326CE5' },
  { name: 'vercel', color: '#000000' },
  { name: 'alibaba', color: '#FF6A00' },
  { name: 'openai', color: '#412991' },
  { name: 'tensorflow', color: '#FF6F00' },
  { name: 'pandas', color: '#150458' },
  { name: 'scikit', color: '#F7931E' },
  { name: 'jupyter', color: '#F37626' },
];

const outputDir = path.join(__dirname, '../public/images/tech');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

techLogos.forEach(tech => {
  const svgContent = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="4" fill="${tech.color}"/>
  <path d="M8 8h16v16H8V8zm2 2v12h12V10H10zm2 2h8v1h-8v-1zm0 2h8v1h-8v-1zm0 2h6v1h-6v-1zm0 2h8v1h-8v-1z" fill="#FFFFFF"/>
</svg>
  `;
  fs.writeFileSync(path.join(outputDir, `${tech.name}.svg`), svgContent);
});

console.log('✅ Created tech logos');
