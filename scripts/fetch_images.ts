import fs from 'fs';
import path from 'path';
import https from 'https';

interface ImageManifest {
  [key: string]: {
    url: string;
    filename: string;
    alt: string;
    category: string;
  };
}

const images: ImageManifest = {
  // Hero and general images
  'hero-bg': {
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop&crop=center',
    filename: 'hero-bg.jpg',
    alt: 'Modern office workspace with developers coding',
    category: 'hero'
  },
  'team-working': {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&crop=center',
    filename: 'team-working.jpg',
    alt: 'Development team collaborating on project',
    category: 'team'
  },
  'coding-session': {
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=center',
    filename: 'coding-session.jpg',
    alt: 'Developer coding on multiple monitors',
    category: 'development'
  },
  'malaysia-skyline': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&crop=center',
    filename: 'malaysia-skyline.jpg',
    alt: 'Kuala Lumpur skyline at sunset',
    category: 'location'
  },

  // Project images
  'cartonflow-erp': {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
    filename: 'cartonflow-erp.jpg',
    alt: 'ERP system dashboard with analytics',
    category: 'projects'
  },
  'redbox-ktv': {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
    filename: 'redbox-ktv.jpg',
    alt: 'Mobile app interface for booking system',
    category: 'projects'
  },
  'ebooster-health': {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&crop=center',
    filename: 'ebooster-health.jpg',
    alt: 'Healthcare app with telemedicine features',
    category: 'projects'
  },

  // Technology images
  'cloud-computing': {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
    filename: 'cloud-computing.jpg',
    alt: 'Cloud computing infrastructure',
    category: 'technology'
  },
  'ai-brain': {
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
    filename: 'ai-brain.jpg',
    alt: 'Artificial intelligence and machine learning',
    category: 'technology'
  },
  'mobile-devices': {
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
    filename: 'mobile-devices.jpg',
    alt: 'Mobile devices and app development',
    category: 'technology'
  },

  // Client logos (placeholder)
  'techcorp': {
    url: 'https://via.placeholder.com/200x100/1f2937/ffffff?text=TechCorp',
    filename: 'techcorp.png',
    alt: 'TechCorp Malaysia Logo',
    category: 'clients'
  },
  'manufacturing-plus': {
    url: 'https://via.placeholder.com/200x100/1f2937/ffffff?text=Manufacturing+Plus',
    filename: 'manufacturing-plus.png',
    alt: 'Manufacturing Plus Logo',
    category: 'clients'
  },
  'retail-solutions': {
    url: 'https://via.placeholder.com/200x100/1f2937/ffffff?text=Retail+Solutions',
    filename: 'retail-solutions.png',
    alt: 'Retail Solutions Logo',
    category: 'clients'
  },
  'healthcare-systems': {
    url: 'https://via.placeholder.com/200x100/1f2937/ffffff?text=Healthcare+Systems',
    filename: 'healthcare-systems.png',
    alt: 'Healthcare Systems Logo',
    category: 'clients'
  },
  'finance-first': {
    url: 'https://via.placeholder.com/200x100/1f2937/ffffff?text=Finance+First',
    filename: 'finance-first.png',
    alt: 'Finance First Logo',
    category: 'clients'
  },
  'education-hub': {
    url: 'https://via.placeholder.com/200x100/1f2937/ffffff?text=Education+Hub',
    filename: 'education-hub.png',
    alt: 'Education Hub Logo',
    category: 'clients'
  },

  // Tech stack logos (SVG placeholders)
  'react': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    filename: 'react.svg',
    alt: 'React Logo',
    category: 'tech'
  },
  'nextjs': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    filename: 'nextjs.svg',
    alt: 'Next.js Logo',
    category: 'tech'
  },
  'typescript': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    filename: 'typescript.svg',
    alt: 'TypeScript Logo',
    category: 'tech'
  },
  'tailwind': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    filename: 'tailwind.svg',
    alt: 'Tailwind CSS Logo',
    category: 'tech'
  },
  'flutter': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
    filename: 'flutter.svg',
    alt: 'Flutter Logo',
    category: 'tech'
  },
  'nodejs': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    filename: 'nodejs.svg',
    alt: 'Node.js Logo',
    category: 'tech'
  },
  'python': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    filename: 'python.svg',
    alt: 'Python Logo',
    category: 'tech'
  },
  'postgresql': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    filename: 'postgresql.svg',
    alt: 'PostgreSQL Logo',
    category: 'tech'
  },
  'mongodb': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    filename: 'mongodb.svg',
    alt: 'MongoDB Logo',
    category: 'tech'
  },
  'redis': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    filename: 'redis.svg',
    alt: 'Redis Logo',
    category: 'tech'
  },
  'aws': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
    filename: 'aws.svg',
    alt: 'AWS Logo',
    category: 'tech'
  },
  'docker': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    filename: 'docker.svg',
    alt: 'Docker Logo',
    category: 'tech'
  },
  'kubernetes': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg',
    filename: 'kubernetes.svg',
    alt: 'Kubernetes Logo',
    category: 'tech'
  },
  'vercel': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
    filename: 'vercel.svg',
    alt: 'Vercel Logo',
    category: 'tech'
  },
  'alibaba': {
    url: 'https://via.placeholder.com/64x64/ff6a00/ffffff?text=AC',
    filename: 'alibaba.svg',
    alt: 'Alibaba Cloud Logo',
    category: 'tech'
  },
  'openai': {
    url: 'https://via.placeholder.com/64x64/412991/ffffff?text=AI',
    filename: 'openai.svg',
    alt: 'OpenAI Logo',
    category: 'tech'
  },
  'tensorflow': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    filename: 'tensorflow.svg',
    alt: 'TensorFlow Logo',
    category: 'tech'
  },
  'pandas': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
    filename: 'pandas.svg',
    alt: 'Pandas Logo',
    category: 'tech'
  },
  'scikit': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikit-learn/scikit-learn-original.svg',
    filename: 'scikit.svg',
    alt: 'Scikit-learn Logo',
    category: 'tech'
  },
  'jupyter': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
    filename: 'jupyter.svg',
    alt: 'Jupyter Logo',
    category: 'tech'
  }
};

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function createDirectories(): Promise<void> {
  const dirs = [
    'public/images',
    'public/images/projects',
    'public/images/tech',
    'public/images/clients',
    'public/images/team',
    'public/images/development',
    'public/images/location',
    'public/images/technology',
    'public/images/hero'
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

async function main() {
  console.log('🚀 Starting image download process...');
  
  try {
    // Create directories
    await createDirectories();
    console.log('✅ Created image directories');

    // Download images
    const downloadPromises = Object.entries(images).map(async ([key, image]) => {
      const filepath = path.join('public/images', image.filename);
      
      try {
        await downloadImage(image.url, filepath);
        console.log(`✅ Downloaded: ${image.filename}`);
      } catch (error) {
        console.error(`❌ Failed to download ${image.filename}:`, error);
      }
    });

    await Promise.all(downloadPromises);

    // Create manifest
    const manifest = {
      generated: new Date().toISOString(),
      images: images
    };

    fs.writeFileSync(
      'public/images/images.json',
      JSON.stringify(manifest, null, 2)
    );

    // Create attribution file
    const attribution = `# Image Attribution

This file contains attribution information for images used in the Trion Creation website.

## Sources

### Unsplash
- Hero background: https://unsplash.com/photos/1551434678-e076c223a692
- Team working: https://unsplash.com/photos/1522071820081-009f0129c71c
- Coding session: https://unsplash.com/photos/1461749280684-dccba630e2f6
- Malaysia skyline: https://unsplash.com/photos/1578662996442-48f60103fc96
- ERP dashboard: https://unsplash.com/photos/1551288049-bebda4e38f71
- Mobile app: https://unsplash.com/photos/1571019613454-1cb2f99b2d8b
- Healthcare: https://unsplash.com/photos/1576091160399-112ba8d25d1f
- Cloud computing: https://unsplash.com/photos/1451187580459-43490279c0fa
- AI brain: https://unsplash.com/photos/1677442136019-21780ecad995
- Mobile devices: https://unsplash.com/photos/1512941937669-90a1b58e7e9c

### Devicons
- Technology logos: https://github.com/devicons/devicon

### Placeholder Images
- Client logos and some tech logos are placeholder images

## License
All images are used under their respective licenses. Unsplash images are free to use under the Unsplash License.
`;

    fs.writeFileSync('content/attribution.md', attribution);

    console.log('✅ Image download process completed!');
    console.log('📁 Images saved to: public/images/');
    console.log('📄 Manifest saved to: public/images/images.json');
    console.log('📄 Attribution saved to: content/attribution.md');

  } catch (error) {
    console.error('❌ Error during image download:', error);
    process.exit(1);
  }
}

main();
