document.addEventListener('DOMContentLoaded', () => {

  // ===== SANITY CDN FETCH =====
  // Uses the project already configured in studio-makhmal
  async function fetchSanityProduct(idOrSlug) {
    const projectId = '4pv1hk2n';
    const dataset   = 'production';
    const apiVer    = '2024-01-01';

    // Match by Sanity _id or by a numeric local id fallback
    const query = `*[_type == "product" && _id == "${idOrSlug}"][0]{
      _id,
      "title": name,
      price,
      sku,
      description,
      details,
      "mainImage": mainImage.asset->url,
      "gallery": gallery[].asset->url,
      sizes
    }`;
    const url = `https://${projectId}.apicdn.sanity.io/v${apiVer}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
    try {
      const res  = await fetch(url);
      const data = await res.json();
      return data.result || null;
    } catch (e) {
      console.warn('Sanity fetch failed — using local fallback.', e);
      return null;
    }
  }

  // ===== TOAST SYSTEM =====
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'bg-black text-brand-white px-6 py-4 text-xs font-bold tracking-widest uppercase shadow-2xl flex items-center space-x-3 pointer-events-auto';
    toast.style.animation = 'fadeIn 0.3s ease-out forwards';
    let icon = 'ph-info';
    if (type === 'success') icon = 'ph-check-circle';
    if (type === 'error')   icon = 'ph-warning-circle';
    toast.innerHTML = `<i class="ph ${icon} text-lg"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== LOCAL PRODUCT DATABASE (fallback) =====
  const products = {
    1:  { title: "EMBROIDERED COTTON VISCOSE SHIRT", price: "Rs.4,990",  images: ["clothes/images/product-1.png"], sku: "MK-RTW-24-001" },
    2:  { title: "PRINTED SATIN SHIRT",              price: "Rs.10,990", images: [
            "clothes/images/product-2.png",
            "clothes/images/woman.jpg",
            "clothes/images/woman (2).jpg",
            "clothes/images/woman (3).jpg"
          ], sku: "MK-RTW-24-002" },
    3:  { title: "EMBROIDERED COTTON VISCOSE SHIRT", price: "Rs.6,990",  images: ["clothes/images/product-3.png"], sku: "MK-RTW-24-003" },
    4:  { title: "2 PIECE - PRINTED LAWN SUIT",      price: "Rs.4,990",  images: ["clothes/images/product-4.png"], sku: "MK-RTW-24-004" },
    5:  { title: "3 PIECE - EMBROIDERED DOBBY SUIT", price: "Rs.12,990", images: ["clothes/images/product-5.png"], sku: "MK-RTW-24-005" },
    6:  { title: "2 PIECE - EMBROIDERED LAWN SUIT",  price: "Rs.10,990", images: ["clothes/images/product-6.png"], sku: "MK-RTW-24-006" },
    7:  { title: "EMBROIDERED LAWN SHIRT",           price: "Rs.8,990",  images: ["clothes/images/woman.jpg"],    sku: "MK-RTW-24-007" },
    8:  { title: "EMBROIDERED DOBBY SHIRT",          price: "Rs.5,590",  images: ["clothes/images/woman (2).jpg"],sku: "MK-RTW-24-008" },
    9:  { title: "3 PIECE - SOLID CROSSHATCH SUIT",  price: "Rs.10,990", images: ["clothes/images/woman (3).jpg"],sku: "MK-RTW-24-009" },
    10: { title: "3 PIECE - SOLID DOBBY SUIT",       price: "Rs.9,990",  images: ["clothes/images/woman (4).jpg"],sku: "MK-RTW-24-010" },
    11: { title: "2 PIECE - EMBROIDERED LAWN SUIT",  price: "Rs.10,990", images: ["clothes/images/woman (6).jpg"],sku: "MK-RTW-24-011" },
    12: { title: "3 PIECE - EMBROIDERED JACQUARD SUIT", price: "Rs.13,990", images: ["clothes/images/woman (7).jpg"], sku: "MK-RTW-24-012" }
  };

  // ===== GALLERY STATE =====
  let galleryImages  = [];
  let activeIndex    = 0;
  let currentProduct = null;

  const mainImg       = document.getElementById('main-product-image');
  const thumbStrip    = document.getElementById('thumbnail-strip');
  const mobileDots    = document.getElementById('mobile-dots');
  const prevBtn       = document.getElementById('prev-image');
  const nextBtn       = document.getElementById('next-image');

  function buildGallery(images) {
    galleryImages = images;
    activeIndex   = 0;

    // -- Main image --
    if (mainImg) {
      mainImg.src = images[0];
      mainImg.style.opacity = '1';
    }

    // -- Thumbnails (desktop) --
    if (thumbStrip) {
      thumbStrip.innerHTML = '';
      images.forEach((src, i) => {
        const thumb = document.createElement('button');
        thumb.className = `thumb-btn w-full aspect-[3/4] overflow-hidden bg-[#f5f3f0] border-2 transition-all duration-200 ${i === 0 ? 'border-[#1c1917]' : 'border-transparent hover:border-[#d4d0ca]'}`;
        thumb.setAttribute('aria-label', `View image ${i + 1}`);
        thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${i + 1}" class="w-full h-full object-cover object-top">`;
        thumb.addEventListener('click', () => setActiveImage(i));
        thumbStrip.appendChild(thumb);
      });
    }

    // -- Mobile dots --
    if (mobileDots) {
      mobileDots.innerHTML = '';
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `dot w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === 0 ? 'bg-[#1c1917] w-4' : 'bg-[#d4d0ca]'}`;
        dot.addEventListener('click', () => setActiveImage(i));
        mobileDots.appendChild(dot);
      });
    }
  }

  function setActiveImage(index) {
    if (!galleryImages.length) return;
    activeIndex = (index + galleryImages.length) % galleryImages.length;

    // Animate main image
    if (mainImg) {
      mainImg.style.opacity = '0';
      mainImg.style.transform = 'scale(1.02)';
      setTimeout(() => {
        mainImg.src = galleryImages[activeIndex];
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
      }, 220);
    }

    // Update thumbnails
    const thumbBtns = thumbStrip ? thumbStrip.querySelectorAll('.thumb-btn') : [];
    thumbBtns.forEach((btn, i) => {
      btn.classList.toggle('border-[#1c1917]', i === activeIndex);
      btn.classList.toggle('border-transparent', i !== activeIndex);
    });

    // Update mobile dots
    const dots = mobileDots ? mobileDots.querySelectorAll('.dot') : [];
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-[#1c1917]', i === activeIndex);
      dot.classList.toggle('w-4', i === activeIndex);
      dot.classList.toggle('bg-[#d4d0ca]', i !== activeIndex);
      dot.classList.toggle('w-1.5', i !== activeIndex);
    });

    // Scroll thumbnail into view
    const activeThumb = thumbStrip && thumbStrip.children[activeIndex];
    if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  if (mainImg) {
    mainImg.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
  }

  // Mobile prev/next
  if (prevBtn) prevBtn.addEventListener('click', () => setActiveImage(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setActiveImage(activeIndex + 1));

  // Touch/swipe on main image
  let touchStartX = 0;
  const mainWrapper = document.getElementById('main-image-wrapper');
  if (mainWrapper) {
    mainWrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    mainWrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) setActiveImage(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    });
  }

  // ===== LIGHTBOX =====
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lbClose      = document.getElementById('lightbox-close');
  const lbPrev       = document.getElementById('lightbox-prev');
  const lbNext       = document.getElementById('lightbox-next');
  const lbCounter    = document.getElementById('lightbox-counter');
  let lbIndex        = 0;

  function openLightbox(index) {
    lbIndex = index;
    lightboxImg.src = galleryImages[lbIndex];
    updateLbCounter();
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function updateLbCounter() {
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${galleryImages.length}`;
  }

  if (mainWrapper) {
    mainWrapper.addEventListener('click', () => openLightbox(activeIndex));
  }
  if (lbClose)  lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  if (lbPrev) {
    lbPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      lbIndex = (lbIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[lbIndex];
      updateLbCounter();
      setActiveImage(lbIndex);
    });
  }
  if (lbNext) {
    lbNext.addEventListener('click', (e) => {
      e.stopPropagation();
      lbIndex = (lbIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[lbIndex];
      updateLbCounter();
      setActiveImage(lbIndex);
    });
  }
  document.addEventListener('keydown', e => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lbPrev && lbPrev.click();
    if (e.key === 'ArrowRight')  lbNext && lbNext.click();
  });

  // ===== PRODUCT LOADING (Sanity → local fallback) =====
  const urlParams   = new URLSearchParams(window.location.search);
  const productId   = urlParams.get('id') || '2';      // Sanity _id passed as ?id=
  const localId     = parseInt(productId) || 2;         // local numeric key fallback

  async function loadProduct() {
    // 1. Try Sanity CDN (works when ?id= is a real Sanity _id)
    let data = await fetchSanityProduct(productId);

    // 2. Fall back to local products object
    if (!data) {
      const local = products[localId] || products[2];
      const imgs  = local.images || [local.image];
      data = {
        title:  local.title,
        price:  local.price,
        sku:    local.sku,
        description: '',
        details: '',
        images: imgs
      };
    } else {
      // Normalise Sanity price (stored as number) → display string
      if (typeof data.price === 'number') {
        data.price = `Rs.${data.price.toLocaleString()}`;
      }
      // Merge mainImage + gallery into one images array
      const imgs = [];
      if (data.mainImage) imgs.push(data.mainImage);
      if (Array.isArray(data.gallery)) imgs.push(...data.gallery.filter(Boolean));
      data.images = imgs.length ? imgs : ['clothes/images/product-2.png'];
    }

    currentProduct = data;
    applyProductData(data);
  }

  function applyProductData(data) {
    const titleEl       = document.getElementById('product-title');
    const priceEl       = document.getElementById('product-price');
    const skuEl         = document.getElementById('product-sku');
    const breadcrumbEl  = document.getElementById('breadcrumb-name');

    if (titleEl) titleEl.innerText = data.title || '';
    if (priceEl) priceEl.innerText = data.price  || '';
    if (skuEl)   skuEl.innerText   = 'SKU: ' + (data.sku || '');

    if (breadcrumbEl && data.title) {
      breadcrumbEl.innerText = data.title.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    document.title = (data.title || 'Product') + ' - MAKHMAL';
    
    // Update SEO Meta Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const metaDesc = document.querySelector('meta[name="description"]');
    
    if (ogTitle) ogTitle.content = document.title;
    if (twitterTitle) twitterTitle.content = document.title;
    if (ogDesc && data.description) ogDesc.content = data.description.substring(0, 160);
    if (metaDesc && data.description) metaDesc.content = data.description.substring(0, 160);
    if (ogImage && data.images && data.images.length) ogImage.content = data.images[0];
    
    // Update JSON-LD Product Schema
    let schemaScript = document.getElementById('product-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'product-schema';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": data.title,
      "image": data.images ? data.images[0] : "",
      "description": data.description || "",
      "sku": data.sku || "",
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "PKR",
        "price": typeof data.price === 'string' ? data.price.replace(/[^0-9]/g, '') : data.price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    });

    // ----- SIZES (from Sanity sizes[] array) -----
    buildSizeButtons(data.sizes);

    // ----- DETAILS TAB (from Sanity `details` field) -----
    const detailsTab = document.getElementById('tab-details');
    if (detailsTab) {
      if (data.details && data.details.trim()) {
        // Each line in the `details` field becomes one bullet row
        const lines = data.details.trim().split('\n').filter(l => l.trim());
        detailsTab.innerHTML = lines.map((line, i) =>
          `<p class="${i < lines.length - 1 ? 'mb-2' : 'mb-5'} flex items-center gap-2">
            <i class="ph ph-check text-[#8b7355]"></i> ${line.trim()}
          </p>`
        ).join('') +
        `<p class="text-[0.6rem] uppercase tracking-wider text-[#a8a29e] p-3 bg-[#faf8f5] border border-[#eae8e4]">NOTE: ACTUAL PRODUCT COLOR MAY VARY SLIGHTLY FROM THE IMAGE.</p>`;
      } else {
        detailsTab.innerHTML = `<p class="text-[#a8a29e] italic text-[0.7rem]">No details available.</p>`;
      }
    }

    // ----- DESCRIPTION TAB (from Sanity `description` field) -----
    const descTab = document.getElementById('tab-description');
    if (descTab) {
      if (data.description && data.description.trim()) {
        descTab.innerHTML = `<p>${data.description.trim()}</p>`;
      } else {
        descTab.innerHTML = `<p class="text-[#a8a29e] italic text-[0.7rem]">No description available.</p>`;
      }
    }

    // Build gallery from Sanity images array
    buildGallery(data.images && data.images.length ? data.images : ['clothes/images/product-2.png']);

    // Suggested products
    buildSuggestedGrid(data._id);
    addToRecentlyViewed(data);
  }

  // ===== SIZE BUTTONS (built dynamically from Sanity sizes[]) =====
  let selectedSize = null;
  const sizeWarning = document.getElementById('size-warning');

  function buildSizeButtons(sizes) {
    const container = document.getElementById('size-selector');
    if (!container) return;
    container.innerHTML = '';
    selectedSize = null;

    // Fallback sizes when product has no Sanity sizes defined
    const fallback = [
      { size: 'XS', stock: 10 },
      { size: 'S',  stock: 10 },
      { size: 'M',  stock: 10 },
      { size: 'L',  stock: 10 },
      { size: 'XL', stock: 0  },
    ];
    const sizeList = (Array.isArray(sizes) && sizes.length) ? sizes : fallback;

    sizeList.forEach(opt => {
      const inStock = opt.stock > 0;
      const btn = document.createElement('button');

      if (inStock) {
        btn.className = 'size-btn border border-[#eae8e4] text-[#78716c] hover:border-[#1c1917] hover:text-[#1c1917] w-11 h-11 text-[0.7rem] uppercase tracking-widest transition-colors flex items-center justify-center bg-white';
        btn.setAttribute('data-size', opt.size);
      } else {
        btn.className = 'border border-[#eae8e4] text-[#d4d0ca] w-11 h-11 text-[0.7rem] uppercase tracking-widest cursor-not-allowed flex items-center justify-center relative bg-white overflow-hidden';
        btn.disabled = true;
        btn.title = 'Out of stock';
      }

      btn.innerHTML = inStock
        ? opt.size
        : `${opt.size}<div class="absolute w-full h-[1px] bg-[#d4d0ca] rotate-45"></div>`;

      container.appendChild(btn);
    });

    bindSizeButtons();
    
    // Update stock indicator
    const hasStock = sizeList.some(opt => opt.stock > 0);
    const stockInd = document.getElementById('stock-indicator');
    if (stockInd) {
      if (hasStock) {
        stockInd.className = 'flex items-center gap-2 mb-8 text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#166534]';
        stockInd.innerHTML = `
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#166534] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#166534]"></span>
            </span>
            <span id="stock-text">In Stock</span>
        `;
      } else {
        stockInd.className = 'flex items-center gap-2 mb-8 text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#cc0000]';
        stockInd.innerHTML = `
            <span class="relative flex h-2 w-2">
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#cc0000]"></span>
            </span>
            <span id="stock-text">Out of Stock</span>
        `;
      }
    }
  }

  function bindSizeButtons() {
    const allSizeBtns = document.querySelectorAll('#size-selector .size-btn:not(:disabled)');
    allSizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        allSizeBtns.forEach(b => {
          b.classList.remove('border-2', 'border-[#1c1917]', 'text-[#1c1917]', 'font-bold', 'bg-[#faf8f5]');
          b.classList.add('border', 'border-[#eae8e4]', 'text-[#78716c]', 'bg-white');
        });
        btn.classList.remove('border', 'border-[#eae8e4]', 'text-[#78716c]', 'bg-white');
        btn.classList.add('border-2', 'border-[#1c1917]', 'text-[#1c1917]', 'font-bold', 'bg-[#faf8f5]');
        selectedSize = btn.getAttribute('data-size');
        if (sizeWarning) sizeWarning.classList.add('hidden');
      });
    });
  }

  // ===== SUGGESTED PRODUCTS =====
  async function buildSuggestedGrid(currentId) {
    const grid = document.getElementById('suggested-grid');
    const loading = document.getElementById('suggested-loading');
    if (!grid) return;

    const projectId = '4pv1hk2n';
    const dataset   = 'production';
    const apiVer    = '2024-01-01';

    // Fetch 4 products from Sanity excluding the current one
    const query = `*[_type == "product" && _id != "${currentId}"][0...4]{
      _id,
      "title": name,
      price,
      "image": mainImage.asset->url
    }`;
    const url = `https://${projectId}.apicdn.sanity.io/v${apiVer}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

    try {
      const res  = await fetch(url);
      const data = await res.json();
      const products = data.result || [];
      
      if (loading) loading.remove();
      grid.innerHTML = '';
      
      if (products.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-xs uppercase tracking-widest text-grey-4 py-10">No recommendations available</p>';
        return;
      }

      products.forEach(p => {
        const priceStr = typeof p.price === 'number' ? `Rs.${p.price.toLocaleString()}` : p.price;
        const card = document.createElement('a');
        card.href = `product.html?id=${p._id}`;
        card.className = 'block group cursor-pointer';
        card.innerHTML = `
          <div class="overflow-hidden bg-grey-1 aspect-[3/4] mb-4 relative">
            <img src="${p.image || 'clothes/images/product-2.png'}" alt="${p.title}" class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" loading="lazy">
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          </div>
          <p class="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-grey-7 mb-1 px-1">${p.title}</p>
          <p class="text-[0.7rem] font-semibold text-[#44403c] px-1">${priceStr}</p>
        `;
        grid.appendChild(card);
      });
    } catch (e) {
      console.warn('Failed to load suggested products from Sanity', e);
      if (loading) loading.textContent = 'Failed to load recommendations.';
    }
  }

  // ===== RECENTLY VIEWED =====
  function addToRecentlyViewed(product) {
    if (!product || !product.title) return;
    try {
      let recent = JSON.parse(localStorage.getItem('makhmal_recent_products') || '[]');
      // Remove if already exists
      recent = recent.filter(p => p.title !== product.title);
      // Add to front
      recent.unshift({
        id: product._id || urlParams.get('id') || '2',
        title: product.title,
        price: product.price,
        image: product.images && product.images.length ? product.images[0] : ''
      });
      // Keep only last 4
      if (recent.length > 4) recent = recent.slice(0, 4);
      localStorage.setItem('makhmal_recent_products', JSON.stringify(recent));
      renderRecentlyViewed(recent, product.title);
    } catch (e) {
      console.warn('Could not save to recently viewed', e);
    }
  }

  function renderRecentlyViewed(recent, currentTitle) {
    const grid = document.getElementById('recently-viewed-grid');
    const section = document.getElementById('recently-viewed-section');
    if (!grid || !section) return;
    
    // Filter out current product from view
    const displayItems = recent.filter(p => p.title !== currentTitle);
    
    if (displayItems.length === 0) {
      section.style.display = 'none';
      return;
    }
    
    section.style.display = 'block';
    grid.innerHTML = '';
    
    displayItems.forEach(p => {
      const priceStr = typeof p.price === 'number' ? `Rs.${p.price.toLocaleString()}` : p.price;
      const card = document.createElement('a');
      card.href = `product.html?id=${p.id}`;
      card.className = 'block group cursor-pointer';
      card.innerHTML = `
        <div class="overflow-hidden bg-grey-1 aspect-[3/4] mb-4 relative">
          <img src="${p.image || 'clothes/images/product-2.png'}" alt="${p.title}" class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
        </div>
        <p class="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-grey-7 mb-1 px-1">${p.title}</p>
        <p class="text-[0.7rem] font-semibold text-[#44403c] px-1">${priceStr}</p>
      `;
      grid.appendChild(card);
    });
  }

  // Load the product
  loadProduct();

  // ===== QUANTITY SELECTOR =====
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus  = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-input');

  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      const v = parseInt(qtyInput.value) || 1;
      if (v > 1) qtyInput.value = v - 1;
    });
    qtyPlus.addEventListener('click', () => {
      const v = parseInt(qtyInput.value) || 1;
      if (v < 10) qtyInput.value = v + 1;
      else showToast('Maximum quantity is 10', 'error');
    });
  }

  // ===== TABS LOGIC =====
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active', 'border-[#1c1917]', 'text-[#1c1917]');
        btn.classList.add('border-transparent', 'text-[#a8a29e]');
      });
      document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.remove('active');
        c.classList.add('hidden');
      });
      button.classList.add('active', 'border-[#1c1917]', 'text-[#1c1917]');
      button.classList.remove('border-transparent', 'text-[#a8a29e]');
      const target = document.getElementById(button.getAttribute('data-target'));
      if (target) { target.classList.add('active'); target.classList.remove('hidden'); }
    });
  });

  // ===== SIZE SELECTOR (now bound dynamically — see buildSizeButtons above) =====

  // ===== BUY NOW =====
  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      if (!selectedSize) {
        if (sizeWarning) sizeWarning.classList.remove('hidden');
        showToast('Please select a size', 'error');
        return;
      }
      const qty   = parseInt(qtyInput.value) || 1;
      const p     = currentProduct || products[2];
      const title = encodeURIComponent(p.title);
      const price = encodeURIComponent(p.price);
      const img   = encodeURIComponent(Array.isArray(p.images) ? p.images[0] : (p.image || ''));
      const size  = encodeURIComponent(selectedSize);

      const originalHTML = buyNowBtn.innerHTML;
      buyNowBtn.innerHTML = '<i class="ph ph-spinner text-base animate-spin"></i> ADDING TO CART...';
      buyNowBtn.disabled  = true;
      buyNowBtn.style.opacity = '0.8';

      const badge = document.getElementById('cart-badge');
      if (badge) badge.textContent = parseInt(badge.textContent || '0') + qty;

      showToast(`${p.title.split(' ').slice(0, 3).join(' ')} added to cart!`, 'success');
      setTimeout(() => {
        buyNowBtn.innerHTML = '<i class="ph ph-check text-base"></i> PROCEEDING TO CHECKOUT...';
        setTimeout(() => {
          window.location.href = `checkout.html?title=${title}&price=${price}&image=${img}&qty=${qty}&size=${size}`;
        }, 600);
      }, 900);
    });
  }

  // ===== WISHLIST =====
  function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-badge');
    if (badge) {
      const count = parseInt(localStorage.getItem('makhmal_wishlist_count') || '0');
      badge.textContent = count;
    }
  }
  updateWishlistBadge();

  const wishlistBtn = document.getElementById('add-to-cart-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      wishlistBtn.innerHTML = '<i class="ph-fill ph-heart text-base text-danger"></i> ADDED TO WISHLIST';
      let count = parseInt(localStorage.getItem('makhmal_wishlist_count') || '0');
      localStorage.setItem('makhmal_wishlist_count', count + 1);
      updateWishlistBadge();
      showToast('Added to your wishlist!', 'success');
    });
  }

  // ===== COPY LINK =====
  const copyLinkBtn = document.getElementById('copy-link-btn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('Link copied to clipboard!', 'success'))
        .catch(()  => showToast('Could not copy link', 'error'));
    });
  }

  // ===== NEWSLETTER =====
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Thank you for subscribing!', 'success');
      newsletterForm.reset();
    });
  }

  // ===== ESTIMATED DELIVERY =====
  const estDel = document.getElementById('est-delivery-date');
  if (estDel) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 5);
    
    const options = { month: 'short', day: 'numeric' };
    estDel.textContent = `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
  }

  // ===== SIZE CHART MODAL =====
  const sizeChartBtn = document.getElementById('size-chart-btn');
  const sizeChartModal = document.getElementById('size-chart-modal');
  const sizeChartContent = document.getElementById('size-chart-content');
  const closeSizeChart = document.getElementById('close-size-chart');

  function openSizeChart(e) {
    e.preventDefault();
    sizeChartModal.classList.remove('hidden');
    sizeChartModal.classList.add('flex');
    setTimeout(() => {
      sizeChartModal.classList.remove('opacity-0');
      if (sizeChartContent) sizeChartContent.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeSizeChartModal() {
    sizeChartModal.classList.add('opacity-0');
    if (sizeChartContent) sizeChartContent.classList.add('scale-95');
    setTimeout(() => {
      sizeChartModal.classList.add('hidden');
      sizeChartModal.classList.remove('flex');
      document.body.style.overflow = '';
    }, 300);
  }

  if (sizeChartBtn) sizeChartBtn.addEventListener('click', openSizeChart);
  if (closeSizeChart) closeSizeChart.addEventListener('click', closeSizeChartModal);
  if (sizeChartModal) {
    sizeChartModal.addEventListener('click', e => {
      if (e.target === sizeChartModal) closeSizeChartModal();
    });
  }

  // ===== SHARE BUTTONS =====
  const shareWa = document.getElementById('share-wa');
  const shareFb = document.getElementById('share-fb');
  
  if (shareWa) {
    shareWa.addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Check out this product from Makhmal: ${currentProduct ? currentProduct.title : ''} `);
      window.open(`https://wa.me/?text=${text}${url}`, '_blank');
    });
  }
  if (shareFb) {
    shareFb.addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    });
  }

  // ===== MOBILE MENU =====
  const mobileMenu      = document.getElementById('mobile-menu');
  const openMenuBtn     = document.getElementById('open-mobile-menu');
  const closeMenuBtn    = document.getElementById('close-mobile-menu');
  const globalOverlay   = document.getElementById('global-overlay');
  const searchOverlay   = document.getElementById('search-overlay');
  const searchIcon      = document.getElementById('search-icon');
  const closeSearchBtn  = document.getElementById('close-search');

  function openOverlay(panel) {
    if (globalOverlay) {
      globalOverlay.classList.remove('hidden');
      setTimeout(() => globalOverlay.classList.remove('opacity-0'), 10);
    }
    if (panel) panel.classList.remove('-translate-x-full', 'hidden');
  }
  function closeAllPanels() {
    if (globalOverlay) {
      globalOverlay.classList.add('opacity-0');
      setTimeout(() => globalOverlay.classList.add('hidden'), 500);
    }
    if (mobileMenu)   mobileMenu.classList.add('-translate-x-full');
    if (searchOverlay) {
      searchOverlay.classList.add('opacity-0');
      setTimeout(() => searchOverlay.classList.add('hidden'), 500);
    }
  }

  if (openMenuBtn)  openMenuBtn.addEventListener('click', () => openOverlay(mobileMenu));
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeAllPanels);
  if (globalOverlay) globalOverlay.addEventListener('click', closeAllPanels);

  if (searchIcon) {
    searchIcon.addEventListener('click', () => {
      if (searchOverlay) {
        searchOverlay.classList.remove('hidden');
        setTimeout(() => searchOverlay.classList.remove('opacity-0'), 10);
      }
    });
  }
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeAllPanels);

  // ===== SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

  // ===== STICKY CTA & BACK TO TOP =====
  const stickyCta = document.getElementById('sticky-cta');
  const stickyBuyBtn = document.getElementById('sticky-buy-btn');
  const stickyTitle = document.getElementById('sticky-title');
  const stickyPrice = document.getElementById('sticky-price');
  const backToTop = document.getElementById('back-to-top');

  if (stickyBuyBtn && buyNowBtn) {
    stickyBuyBtn.addEventListener('click', () => {
      buyNowBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => buyNowBtn.click(), 500);
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', () => {
    // Back to top
    if (window.scrollY > 500) {
      if (backToTop) backToTop.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      if (backToTop) backToTop.classList.add('opacity-0', 'pointer-events-none');
    }
    
    // Sticky CTA logic
    if (stickyCta && buyNowBtn) {
      const btnRect = buyNowBtn.getBoundingClientRect();
      // Show sticky when main buy button scrolls out of view above
      if (btnRect.bottom < 0) {
        stickyCta.classList.remove('translate-y-full');
        if (currentProduct) {
          if (stickyTitle) stickyTitle.textContent = currentProduct.title;
          if (stickyPrice) stickyPrice.textContent = typeof currentProduct.price === 'string' ? currentProduct.price : `Rs.${currentProduct.price.toLocaleString()}`;
        }
      } else {
        stickyCta.classList.add('translate-y-full');
      }
    }
  });
});
