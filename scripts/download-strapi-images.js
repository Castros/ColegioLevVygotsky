/**
 * Pre-build script: Download all images from Strapi to local public folder
 * This ensures the static build includes all images, eliminating runtime dependency on Strapi
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'strapi-images');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${path.basename(outputPath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Fetch data from Strapi v5 API — unwraps { data: ... } wrapper automatically
 */
async function fetchFromStrapi(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${STRAPI_URL}${endpoint}`;
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => { data += chunk; });

      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            // Strapi v5: unwrap { data: [...] } for collections, { data: {...} } for single types
            const unwrapped = json?.data ?? json;
            resolve(unwrapped);
          } catch (error) {
            reject(new Error(`Failed to parse JSON from ${endpoint}`));
          }
        } else {
          console.warn(`⚠️  ${endpoint} returned ${response.statusCode}, skipping...`);
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Extract image objects from Strapi data
 * Works for both collections (arrays) and single types (objects)
 */
function extractImages(data, images = []) {
  if (!data) return images;

  if (Array.isArray(data)) {
    data.forEach(item => extractImages(item, images));
  } else if (typeof data === 'object') {
    // Image object: has url and (formats or mime)
    if (data.url && (data.formats || data.mime)) {
      images.push(data);
    }
    Object.values(data).forEach(value => extractImages(value, images));
  }

  return images;
}

async function downloadStrapiImage(imageObj) {
  const downloads = [];

  if (imageObj.url) {
    const url = imageObj.url.startsWith('http')
      ? imageObj.url
      : `${STRAPI_URL}${imageObj.url}`;
    const filename = path.basename(imageObj.url);
    const outputPath = path.join(OUTPUT_DIR, filename);
    if (!fs.existsSync(outputPath)) {
      downloads.push(downloadFile(url, outputPath));
    }
  }

  if (imageObj.formats) {
    for (const [, format] of Object.entries(imageObj.formats)) {
      if (format.url) {
        const url = format.url.startsWith('http')
          ? format.url
          : `${STRAPI_URL}${format.url}`;
        const filename = path.basename(format.url);
        const outputPath = path.join(OUTPUT_DIR, filename);
        if (!fs.existsSync(outputPath)) {
          downloads.push(downloadFile(url, outputPath));
        }
      }
    }
  }

  return Promise.all(downloads);
}

async function main() {
  console.log('🚀 Starting Strapi image download...');
  console.log(`📡 Strapi URL: ${STRAPI_URL}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  try {
    // Strapi v5: all endpoints use /api/ prefix, populate=* to include media
    const endpoints = [
      '/api/homepage?populate=*',
      '/api/services?populate=*',
      '/api/testimonials?populate=*',
      '/api/value-propositions?populate=*',
      '/api/about-section?populate=*',
      '/api/about-page?populate=*',
      '/api/services-page?populate=*',
      '/api/cta-section?populate=*',
      '/api/education-levels?populate=*',
      '/api/contact-page?populate=*',
      '/api/blog-posts?populate=*',
    ];

    let allImages = [];

    for (const endpoint of endpoints) {
      console.log(`📥 Fetching: ${endpoint}`);
      const data = await fetchFromStrapi(endpoint);

      if (data) {
        const images = extractImages(data);
        allImages = allImages.concat(images);
        console.log(`   Found ${images.length} images`);
      }
    }

    const uniqueImages = Array.from(
      new Map(allImages.map(img => [img.id || img.url, img])).values()
    );

    console.log(`\n📊 Total unique images found: ${uniqueImages.length}`);
    console.log('⬇️  Downloading images...\n');

    for (const image of uniqueImages) {
      try {
        await downloadStrapiImage(image);
      } catch (error) {
        console.error(`❌ Error downloading image:`, error.message);
      }
    }

    console.log('\n✅ Image download complete!');
    console.log(`📁 Images saved to: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    // Don't fail the build — images have fallbacks
    console.warn('⚠️  Continuing with build (will use fallback images if needed)');
    process.exit(0);
  }
}

main();
