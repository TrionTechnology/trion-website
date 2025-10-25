const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const techLogos = [
  // Frontend
  { name: 'React', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/react.svg' },
  { name: 'Next.js', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/nextjs.svg' },
  { name: 'TypeScript', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/typescript.svg' },
  { name: 'Tailwind CSS', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/tailwindcss.svg' },
  { name: 'Flutter', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/flutter.svg' },
  
  // Backend
  { name: 'Node.js', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/nodejs.svg' },
  { name: 'Python', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/python.svg' },
  { name: 'PostgreSQL', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/postgresql.svg' },
  { name: 'MongoDB', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/mongodb.svg' },
  { name: 'Redis', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/redis.svg' },
  
  // Cloud & DevOps
  { name: 'AWS', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/aws.svg' },
  { name: 'Docker', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/docker.svg' },
  { name: 'Kubernetes', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/kubernetes.svg' },
  { name: 'Vercel', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/vercel.svg' },
  { name: 'Alibaba Cloud', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/alibabacloud.svg' },
  
  // AI & Data
  { name: 'OpenAI', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/openai.svg' },
  { name: 'TensorFlow', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/tensorflow.svg' },
  { name: 'Pandas', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/pandas.svg' },
  { name: 'Scikit-learn', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/scikitlearn.svg' },
  { name: 'Jupyter', url: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos/jupyter.svg' },
];

const outputDir = path.join(__dirname, '../public/images/tech');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllLogos() {
  console.log('🔄 Downloading real brand logos...');
  
  for (const tech of techLogos) {
    try {
      const filename = `${tech.name.toLowerCase().replace(/\s+/g, '')}.svg`;
      const filepath = path.join(outputDir, filename);
      
      console.log(`📥 Downloading ${tech.name}...`);
      await downloadFile(tech.url, filepath);
      console.log(`✅ Downloaded ${tech.name}`);
    } catch (error) {
      console.log(`❌ Failed to download ${tech.name}: ${error.message}`);
    }
  }
  
  console.log('🎉 Download complete!');
}

downloadAllLogos().catch(console.error);
