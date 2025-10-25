const fs = require('fs');
const path = require('path');

const techLogos = [
  // Frontend
  { name: 'React', color: '#61DAFB', bgColor: '#20232A', text: '⚛', textColor: '#61DAFB' },
  { name: 'Next.js', color: '#000000', bgColor: '#FFFFFF', text: 'N', textColor: '#000000' },
  { name: 'TypeScript', color: '#3178C6', bgColor: '#FFFFFF', text: 'TS', textColor: '#3178C6' },
  { name: 'Tailwind CSS', color: '#06B6D4', bgColor: '#FFFFFF', text: 'TW', textColor: '#06B6D4' },
  { name: 'Flutter', color: '#02569B', bgColor: '#FFFFFF', text: 'F', textColor: '#02569B' },
  
  // Backend
  { name: 'Node.js', color: '#339933', bgColor: '#FFFFFF', text: 'N', textColor: '#339933' },
  { name: 'Python', color: '#3776AB', bgColor: '#FFFFFF', text: 'Py', textColor: '#3776AB' },
  { name: 'PostgreSQL', color: '#336791', bgColor: '#FFFFFF', text: 'SQL', textColor: '#336791' },
  { name: 'MongoDB', color: '#47A248', bgColor: '#FFFFFF', text: 'M', textColor: '#47A248' },
  { name: 'Redis', color: '#DC382D', bgColor: '#FFFFFF', text: 'R', textColor: '#DC382D' },
  
  // Cloud & DevOps
  { name: 'AWS', color: '#FF9900', bgColor: '#FFFFFF', text: 'AWS', textColor: '#FF9900' },
  { name: 'Docker', color: '#2496ED', bgColor: '#FFFFFF', text: 'D', textColor: '#2496ED' },
  { name: 'Kubernetes', color: '#326CE5', bgColor: '#FFFFFF', text: 'K8s', textColor: '#326CE5' },
  { name: 'Vercel', color: '#000000', bgColor: '#FFFFFF', text: 'V', textColor: '#000000' },
  { name: 'Alibaba Cloud', color: '#FF6A00', bgColor: '#FFFFFF', text: 'AC', textColor: '#FF6A00' },
  
  // AI & Data
  { name: 'OpenAI', color: '#43B581', bgColor: '#FFFFFF', text: 'AI', textColor: '#43B581' },
  { name: 'TensorFlow', color: '#FF6F00', bgColor: '#FFFFFF', text: 'TF', textColor: '#FF6F00' },
  { name: 'Pandas', color: '#150458', bgColor: '#FFFFFF', text: 'P', textColor: '#150458' },
  { name: 'Scikit-learn', color: '#F7931E', bgColor: '#FFFFFF', text: 'SK', textColor: '#F7931E' },
  { name: 'Jupyter', color: '#F37626', bgColor: '#FFFFFF', text: 'J', textColor: '#F37626' },
];

const outputDir = path.join(__dirname, '../public/images/tech');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

techLogos.forEach(tech => {
  const svgContent = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient-${tech.name.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${tech.color}" />
          <stop offset="100%" stop-color="${tech.color}CC" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="${tech.bgColor}" rx="15" ry="15"/>
      <rect x="10" y="10" width="80" height="80" fill="url(#gradient-${tech.name.replace(/\s+/g, '')})" rx="10" ry="10"/>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${tech.textColor}" text-anchor="middle" dominant-baseline="middle">${tech.text}</text>
    </svg>
  `;
  fs.writeFileSync(path.join(outputDir, `${tech.name.toLowerCase().replace(/\s+/g, '')}.svg`), svgContent);
});

console.log('✅ Created brand-accurate tech logos');
