const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\updated_data\\templates\\new templates\\agttools.in\\collections';
const htmlFiles = ['all.html', 'all-1.html', 'all-2.html', 'all-3.html', 'all-4.html', 'all-5.html'];

const allProducts = [];
const seenTitles = new Set();

htmlFiles.forEach(file => {
  const filePath = path.join(targetDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');

  // Match LI elements or card elements
  const items = [...content.matchAll(/<li[^>]*class=["'][^"']*grid__item[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi)];
  items.forEach(m => {
    const itemHtml = m[1];
    const titleMatch = itemHtml.match(/<a[^>]*class=["'][^"']*full-unstyled-link[^"']*["'][^>]*>([\s\S]*?)<\/a>/i)
                      || itemHtml.match(/<h3[^>]*class=["'][^"']*card__heading[^"']*["'][^>]*>([\s\S]*?)<\/h3>/i);
    const priceMatch = itemHtml.match(/<span[^>]*class=["'][^"']*price-item--regular[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)
                      || itemHtml.match(/<span[^>]*class=["'][^"']*price-item[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const imgMatch = itemHtml.match(/<img[^>]+src=["']([^"']+)["']/i);

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim().replace(/&amp;/g, '&') : '';
    const price = priceMatch ? priceMatch[1].replace(/<[^>]+>/g, '').trim().replace(/Rs\.\s*/, '₹') : '';
    let imgSrc = imgMatch ? imgMatch[1] : '';

    // Clean image path
    if (imgSrc) {
      const imgFileName = imgSrc.split('?')[0].split('/').pop();
      imgSrc = imgFileName;
    }

    if (title && !seenTitles.has(title)) {
      seenTitles.add(title);
      allProducts.push({ title, price, img: imgSrc });
    }
  });
});

console.log('Total Unique Products Extracted:', allProducts.length);
console.log(JSON.stringify(allProducts, null, 2));

// Save to JSON for reference
fs.writeFileSync('d:\\new_projects_2026_july\\gardening-tools\\scratch_products.json', JSON.stringify(allProducts, null, 2));
