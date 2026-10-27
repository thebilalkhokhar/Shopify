/**
 * Tapefox Quick View Modal Script
 * Fully dynamic: Reads product card data attributes directly on click,
 * leaves all form selections empty initially until the user selects them,
 * and updates calculations live.
 */
(function() {
  const productSpecsFallback = {
    'polypropylene-tape': {
      category: 'High-volume shipping',
      desc: 'The default for corrugated cartons. Glossy, hot-melt, and cheap enough to brand every box that leaves the building.',
      specs: {
        seal: '1.9 mil to 30 lbs · 2.5 mil to 50 lbs · 2.8 mil over 50 lbs',
        goes: 'Normal Tape gun',
        tamper: 'No',
        lead: 'Proof 2-3 days, ships in 3 weeks'
      },
      basePrice: 82.93,
      rates: {
        5: { pricePerCase: 92.93, total: 464.63, rolls: 40, perRoll: 11.62, tape: 414.63 },
        10: { pricePerCase: 84.50, total: 767.22, rolls: 80, perRoll: 9.59, tape: 717.22 },
        25: { pricePerCase: 78.20, total: 1476.62, rolls: 200, perRoll: 7.38, tape: 1476.62 },
        50: { pricePerCase: 72.80, total: 2603.47, rolls: 400, perRoll: 6.51, tape: 2553.47 },
        64: { pricePerCase: 68.40, total: 2908.55, rolls: 512, perRoll: 5.68, tape: 2858.55 }
      }
    },
    'paper-tape': {
      category: 'Eco-conscious packaging',
      desc: 'Custom printed water-activated paper tape. Recyclable, reinforced for security, creating a strong tamper-evident bond.',
      specs: {
        seal: 'Up to 30-55 lbs with reinforced fiberglass strands',
        goes: 'Water-activated dispenser',
        tamper: 'Yes (Bonds to carton fiber)',
        lead: 'Proof 2-3 days, ships in 3 weeks'
      },
      basePrice: 95.00,
      rates: {
        5: { pricePerCase: 104.50, total: 522.50, rolls: 40, perRoll: 13.06, tape: 475.00 },
        10: { pricePerCase: 96.00, total: 960.00, rolls: 80, perRoll: 12.00, tape: 910.00 },
        25: { pricePerCase: 89.00, total: 2225.00, rolls: 200, perRoll: 11.12, tape: 2175.00 },
        50: { pricePerCase: 82.00, total: 4100.00, rolls: 400, perRoll: 10.25, tape: 4050.00 },
        64: { pricePerCase: 76.00, total: 4864.00, rolls: 512, perRoll: 9.50, tape: 4814.00 }
      }
    },
    'pvc-tape': {
      category: 'Heavy-duty & silent packaging',
      desc: 'Quiet release and exceptional holding power. Does not stretch or split, ideal for heavy cartons and cold storage.',
      specs: {
        seal: 'Heaviest loads (Over 50 lbs)',
        goes: 'Normal Tape gun',
        tamper: 'No',
        lead: 'Proof 2-3 days, ships in 3 weeks'
      },
      basePrice: 88.00,
      rates: {
        5: { pricePerCase: 98.00, total: 490.00, rolls: 40, perRoll: 12.25, tape: 440.00 },
        10: { pricePerCase: 90.00, total: 900.00, rolls: 80, perRoll: 11.25, tape: 850.00 },
        25: { pricePerCase: 83.00, total: 2075.00, rolls: 200, perRoll: 10.37, tape: 2025.00 },
        50: { pricePerCase: 77.00, total: 3850.00, rolls: 400, perRoll: 9.62, tape: 3800.00 },
        64: { pricePerCase: 71.00, total: 4544.00, rolls: 512, perRoll: 8.87, tape: 4494.00 }
      }
    },
    'hi-tack-freezer-tape': {
      category: 'Deep freeze & cold storage',
      desc: 'Formulated with specialized cold-temperature synthetic adhesive that stays bonded even in sub-zero freezers.',
      specs: {
        seal: 'Cold Chain & freezer storage down to -15°F',
        goes: 'Normal Tape gun',
        tamper: 'No',
        lead: 'Proof 2-3 days, ships in 3 weeks'
      },
      basePrice: 99.00,
      rates: {
        5: { pricePerCase: 110.00, total: 550.00, rolls: 40, perRoll: 13.75, tape: 500.00 },
        10: { pricePerCase: 102.00, total: 1020.00, rolls: 80, perRoll: 12.75, tape: 970.00 },
        25: { pricePerCase: 94.00, total: 2350.00, rolls: 200, perRoll: 11.75, tape: 2300.00 },
        50: { pricePerCase: 86.00, total: 4300.00, rolls: 400, perRoll: 10.75, tape: 4250.00 },
        64: { pricePerCase: 80.00, total: 5120.00, rolls: 512, perRoll: 10.00, tape: 5070.00 }
      }
    },
    'flatback-tape': {
      category: 'Kraft paper sealing & tabbing',
      desc: 'Pressure-sensitive kraft paper tape. Tears cleanly by hand without blade dispensers and provides quick high-tack adhesion.',
      specs: {
        seal: 'Bundling, tabbing, splicing & light-to-medium cartons',
        goes: 'Tears easily by hand',
        tamper: 'No',
        lead: 'Proof 2-3 days, ships in 3 weeks'
      },
      basePrice: 85.00,
      rates: {
        5: { pricePerCase: 94.00, total: 470.00, rolls: 40, perRoll: 11.75, tape: 420.00 },
        10: { pricePerCase: 87.00, total: 870.00, rolls: 80, perRoll: 10.87, tape: 820.00 },
        25: { pricePerCase: 80.00, total: 2000.00, rolls: 200, perRoll: 10.00, tape: 1950.00 },
        50: { pricePerCase: 74.00, total: 3700.00, rolls: 400, perRoll: 9.25, tape: 3650.00 },
        64: { pricePerCase: 69.00, total: 4416.00, rolls: 512, perRoll: 8.62, tape: 4366.00 }
      }
    },
    'dispensers': {
      category: 'Warehouse packaging tools',
      desc: 'Heavy-duty handheld tape guns and water-activated gummed tape machines engineered for continuous packaging line speeds.',
      specs: {
        seal: 'Compatible with standard 2" and 3" tape rolls',
        goes: 'Benchtop or handheld',
        tamper: 'N/A',
        lead: 'In stock, ships same day'
      },
      basePrice: 34.00,
      rates: {
        5: { pricePerCase: 34.00, total: 170.00, rolls: 5, perRoll: 34.00, tape: 170.00 },
        10: { pricePerCase: 32.00, total: 320.00, rolls: 10, perRoll: 32.00, tape: 320.00 },
        25: { pricePerCase: 30.00, total: 750.00, rolls: 25, perRoll: 30.00, tape: 750.00 },
        50: { pricePerCase: 28.00, total: 1400.00, rolls: 50, perRoll: 28.00, tape: 1400.00 },
        64: { pricePerCase: 26.00, total: 1664.00, rolls: 64, perRoll: 26.00, tape: 1664.00 }
      }
    }
  };

  let currentActiveProduct = null;
  let activeCases = null; // Initially null so nothing is selected

  function initQuickView() {
    const modal = document.getElementById('TapefoxQuickViewModal');
    if (!modal) return;

    const closeBtn = document.getElementById('TapefoxQuickViewClose');
    const backdrop = document.getElementById('TapefoxQuickViewBackdrop');

    function lockPageScroll() {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    }

    function unlockPageScroll() {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      unlockPageScroll();
    }

    function openModalWithData(data) {
      if (window.innerWidth <= 992) return; // Do not open on mobile/tablet

      currentActiveProduct = data;
      activeCases = null; // Reset cases to unselected

      resetFormFields();
      populateDynamicProduct(data);

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      lockPageScroll();

      const dialogBody = modal.querySelector('.tf-qv-body');
      if (dialogBody) dialogBody.scrollTop = 0;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Event Delegation: When any Quick View button is clicked
    document.addEventListener('click', function(e) {
      const qvBtn = e.target.closest('.htp-card__quick-view, .cp-card__quick-view, .pmr-quick-view, .omr-quick-view, .htp-card__quick-view-btn, .cp-card__quick-view-btn, .pmr-quick-view-btn, .omr-quick-view-btn');
      if (qvBtn) {
        e.preventDefault();
        e.stopPropagation();

        // Find nearest product card container
        const card = qvBtn.closest('.htp-card, .cp-card, .pmr-item, .omr-item') || qvBtn.closest('.htp-card__image-wrap, .cp-card__box, .pmr-image-box, .omr-image-box')?.parentElement;
        
        // Extract data directly from the clicked card
        let title = '';
        let img = '';
        let price = '';
        let badge = '';
        let bg = '';
        let variantId = '';

        if (card) {
          title = card.getAttribute('data-title') || '';
          img = card.getAttribute('data-img') || '';
          price = card.getAttribute('data-price') || '';
          badge = card.getAttribute('data-badge') || '';
          bg = card.getAttribute('data-bg') || '';
          url = card.getAttribute('data-url') || '';
          variantId = card.getAttribute('data-variant-id') || '';
        }

        // Check for hidden input with variant id in card
        if (!variantId && card) {
          const varInput = card.querySelector('input[name="id"]');
          if (varInput) variantId = varInput.value;
        }

        // If title is missing or default, read directly from visible title link
        if (!title && card) {
          const titleEl = card.querySelector('.htp-card__title a, .htp-card__title, .cp-card__title a, .cp-card__title, .pmr-title, .omr-title');
          if (titleEl) title = titleEl.textContent.trim();
        }
        if (!img && card) {
          const imgEl = card.querySelector('img');
          if (imgEl) img = imgEl.currentSrc || imgEl.src;
        }
        if (!price && card) {
          const priceEl = card.querySelector('.htp-card__price, .cp-card__price, .pmr-price, .omr-price');
          if (priceEl) price = priceEl.textContent.trim();
        }
        if (!badge && card) {
          const badgeEl = card.querySelector('.htp-card__badge, .pb-tag-badge');
          if (badgeEl) badge = badgeEl.textContent.trim();
        }
        if (!url && card) {
          const linkEl = card.querySelector('a[href*="/products/"]');
          if (linkEl) url = linkEl.getAttribute('href');
        }

        // Determine handle from URL or title
        let handle = '';
        if (url && url.indexOf('/products/') !== -1) {
          handle = url.split('/products/')[1].split('?')[0].split('/')[0];
        } else if (title) {
          handle = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        }

        openModalWithData({
          title: title || 'Custom Printed Tape',
          img: img || '',
          price: price || '',
          badge: badge || '',
          bg: bg || '#F8B825',
          url: url || '/products/' + (handle || 'polypropylene-tape'),
          handle: handle || 'polypropylene-tape',
          variantId: variantId || ''
        });
      }
    });

    setupModalInteractions();
  }

  let selectedInkColors = [];
  let maxAllowedInks = 1;
  let uploadedFilesStore = [];

  function resetFormFields() {
    selectedInkColors = [];
    maxAllowedInks = 1;
    uploadedFilesStore = [];

    // 1. Remove all active/selected classes
    document.querySelectorAll('.tf-qv-pill').forEach(btn => btn.classList.remove('is-active'));
    document.querySelectorAll('.tf-qv-swatch').forEach(sw => sw.classList.remove('is-active'));
    document.querySelectorAll('.tf-qv-case-preset').forEach(preset => preset.classList.remove('is-active'));
    document.querySelectorAll('.tf-qv-art-card').forEach(card => card.classList.remove('is-active'));
    document.querySelectorAll('#tfQvTableBody tr').forEach(row => {
      row.style.backgroundColor = '';
      row.classList.remove('is-selected');
    });

    // 2. Clear Uploaded Files
    const fileInput = document.getElementById('tfQvArtworkFileInput');
    if (fileInput) fileInput.value = '';
    renderUploadedFilesList();

    // 3. Uncheck radios
    document.querySelectorAll('.tf-qv-art-card input[type="radio"]').forEach(r => r.checked = false);

    // 4. Clear hidden form input values
    const hiddenFieldIds = [
      'tfQvHiddenQuantity',
      'tfQvPropMaterial',
      'tfQvPropWidth',
      'tfQvPropLength',
      'tfQvPropTapeColor',
      'tfQvPropInks',
      'tfQvPropInkColor',
      'tfQvPropCoverage',
      'tfQvPropPrintedBefore',
      'tfQvPropCases',
      'tfQvPropArtwork'
    ];
    hiddenFieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    // 5. Reset displays to placeholder dashes
    const qtyDisplay = document.getElementById('tfQvQtyDisplay');
    const sumCases = document.getElementById('tfQvSummaryCases');
    const sumRolls = document.getElementById('tfQvSummaryRolls');
    const sumPricePerCase = document.getElementById('tfQvSummaryPricePerCase');
    const totalPriceEl = document.getElementById('tfQvTotalPrice');
    const perRollPriceEl = document.getElementById('tfQvPerRollPrice');

    if (qtyDisplay) qtyDisplay.textContent = '—';
    if (sumCases) sumCases.textContent = '—';
    if (sumRolls) sumRolls.textContent = '—';
    if (sumPricePerCase) sumPricePerCase.textContent = '—';
    if (totalPriceEl) totalPriceEl.textContent = '—';
    if (perRollPriceEl) perRollPriceEl.textContent = 'Select options to calculate';
  }

  function renderUploadedFilesList() {
    const listEl = document.getElementById('tfQvUploadedFilesList');
    if (!listEl) return;

    if (!uploadedFilesStore.length) {
      listEl.innerHTML = '';
      listEl.style.display = 'none';
      return;
    }

    listEl.style.display = 'flex';
    let html = '';
    uploadedFilesStore.forEach((file, idx) => {
      const ext = file.name.split('.').pop().toUpperCase().slice(0, 3) || 'DOC';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      html += `
        <div class="tf-qv-uploaded-file-pill" data-idx="${idx}">
          <div class="tf-qv-file-pill-left">
            <span class="tf-qv-file-icon">${ext}</span>
            <div class="tf-qv-file-meta">
              <span class="tf-qv-file-name" title="${file.name}">${file.name}</span>
              <span class="tf-qv-file-size">${sizeMb} MB</span>
            </div>
          </div>
          <button type="button" class="tf-qv-file-remove-btn" data-remove-idx="${idx}" aria-label="Remove file">×</button>
        </div>
      `;
    });
    listEl.innerHTML = html;

    // Attach remove handlers
    listEl.querySelectorAll('.tf-qv-file-remove-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const removeIdx = parseInt(this.getAttribute('data-remove-idx'), 10);
        uploadedFilesStore.splice(removeIdx, 1);
        renderUploadedFilesList();
      });
    });
  }

  function populateDynamicProduct(data) {
    const handleKey = normalizeHandle(data.handle || data.title);
    const fallback = productSpecsFallback[handleKey] || productSpecsFallback['polypropylene-tape'];

    // 1. Dynamic Title
    const titleEl = document.getElementById('tfQvTitle');
    if (titleEl) titleEl.textContent = data.title;

    // 2. Dynamic Starting Price
    const priceValEl = document.getElementById('tfQvPriceVal');
    let effectivePriceStr = data.price;
    if (!effectivePriceStr) {
      if (handleKey === 'paper-tape') effectivePriceStr = '$9.10 a roll';
      else if (handleKey === 'pvc-tape') effectivePriceStr = '$7.84 a roll';
      else if (handleKey === 'hi-tack-freezer-tape') effectivePriceStr = '$10.18 a roll';
      else if (handleKey === 'flatback-tape') effectivePriceStr = '$7.12 a roll';
      else if (handleKey === 'dispensers') effectivePriceStr = '$34 per unit';
      else effectivePriceStr = '$5.68 a roll';
    }
    
    // Clean string for priceValEl
    let displayPriceText = effectivePriceStr;
    if (displayPriceText.toLowerCase().indexOf('starting at') !== -1) {
      displayPriceText = displayPriceText.replace(/starting\s+at\s*/i, '').trim();
    }
    if (priceValEl) priceValEl.textContent = displayPriceText;

    // 3. Dynamic Main Image
    const imgEl = document.getElementById('tfQvImage');
    if (imgEl) {
      if (data.img) {
        imgEl.src = data.img;
      } else {
        imgEl.src = 'https://0ap41c-jc.myshopify.com/cdn/shop/files/Polypropylene_Tape.webp';
      }
      imgEl.alt = data.title;
    }

    // 4. Dynamic Badge
    const badgeEl = document.getElementById('tfQvBadge');
    if (badgeEl) {
      if (data.badge) {
        badgeEl.textContent = data.badge;
        badgeEl.style.display = 'inline-block';
      } else {
        badgeEl.textContent = 'Top Pick';
        badgeEl.style.display = 'inline-block';
      }
    }

    // 5. Background Color of image box
    const imgCardEl = document.getElementById('tfQvImageCard');
    if (imgCardEl) {
      imgCardEl.style.backgroundColor = (data.bg && data.bg !== 'transparent' && data.bg !== 'rgba(0,0,0,0)') ? data.bg : '#F8B825';
    }

    // 6. Category & Description
    const catEl = document.getElementById('tfQvCategory');
    const descEl = document.getElementById('tfQvDesc');
    if (catEl) catEl.textContent = fallback.category;
    if (descEl) descEl.textContent = fallback.desc;

    // 7. Auto-Select Material dynamically based on clicked product
    const materialPills = document.querySelectorAll('#tfQvMaterialGroup .tf-qv-pill');
    let matchedMaterialVal = '';
    materialPills.forEach(pill => {
      pill.classList.remove('is-active');
      const pillVal = pill.getAttribute('data-val').toLowerCase();
      const pillHandle = (pill.getAttribute('data-handle') || '').toLowerCase();
      const titleLower = (data.title || '').toLowerCase();

      let isMatch = false;
      if (handleKey === 'polypropylene-tape' && (pillVal.indexOf('poly') !== -1 || pillHandle.indexOf('poly') !== -1)) isMatch = true;
      else if (handleKey === 'paper-tape' && (pillVal.indexOf('paper') !== -1 || pillHandle.indexOf('paper') !== -1)) isMatch = true;
      else if (handleKey === 'pvc-tape' && (pillVal.indexOf('pvc') !== -1 || pillHandle.indexOf('pvc') !== -1)) isMatch = true;
      else if (handleKey === 'hi-tack-freezer-tape' && (pillVal.indexOf('freezer') !== -1 || pillVal.indexOf('track') !== -1 || pillVal.indexOf('tack') !== -1)) isMatch = true;
      else if (handleKey === 'flatback-tape' && (pillVal.indexOf('flat') !== -1 || pillHandle.indexOf('flat') !== -1)) isMatch = true;
      else if (titleLower.indexOf(pillVal) !== -1) isMatch = true;

      if (isMatch && !matchedMaterialVal) {
        pill.classList.add('is-active');
        matchedMaterialVal = pill.getAttribute('data-val');
      }
    });

    // If no pill matched directly, default to first pill
    if (!matchedMaterialVal && materialPills.length > 0) {
      materialPills[0].classList.add('is-active');
      matchedMaterialVal = materialPills[0].getAttribute('data-val');
    }
    const propMaterial = document.getElementById('tfQvPropMaterial');
    if (propMaterial) propMaterial.value = matchedMaterialVal;

    // 8. Specs 4 boxes
    const sealEl = document.getElementById('tfQvSpecSeal');
    const goesEl = document.getElementById('tfQvSpecGoes');
    const tamperEl = document.getElementById('tfQvSpecTamper');
    const leadEl = document.getElementById('tfQvSpecLead');

    if (sealEl) sealEl.textContent = fallback.specs.seal;
    if (goesEl) goesEl.textContent = fallback.specs.goes;
    if (tamperEl) tamperEl.textContent = fallback.specs.tamper;
    if (leadEl) leadEl.textContent = fallback.specs.lead;

    // 9. PDP Link
    const pdpLink = document.getElementById('tfQvFullPdpLink');
    if (pdpLink) {
      pdpLink.setAttribute('href', data.url || '/products/' + handleKey);
    }

    // 10. Variant ID
    const varInput = document.getElementById('tfQvVariantId');
    if (varInput) {
      varInput.value = data.variantId || '';
    }

    // 11. Pricing Chart subhead & rows
    const pricingSub = document.getElementById('tfQvPricingSub');
    if (pricingSub) {
      pricingSub.textContent = data.title + ' · Custom specifications · Tap a row to set cases';
    }

    populateTableRows(fallback, data);
  }

  function normalizeHandle(str) {
    if (!str) return 'polypropylene-tape';
    const s = str.toLowerCase();
    if (s.indexOf('poly') !== -1) return 'polypropylene-tape';
    if (s.indexOf('paper') !== -1) return 'paper-tape';
    if (s.indexOf('pvc') !== -1) return 'pvc-tape';
    if (s.indexOf('freezer') !== -1 || s.indexOf('hitack') !== -1 || s.indexOf('hi-tack') !== -1) return 'hi-tack-freezer-tape';
    if (s.indexOf('flat') !== -1) return 'flatback-tape';
    if (s.indexOf('dispenser') !== -1) return 'dispensers';
    return 'polypropylene-tape';
  }

  function populateTableRows(specs, data) {
    const tbody = document.getElementById('tfQvTableBody');
    if (!tbody || !specs.rates) return;

    let html = '';
    const caseKeys = [5, 10, 25, 50, 64];
    caseKeys.forEach(k => {
      const r = specs.rates[k];
      if (r) {
        html += `<tr data-cases="${k}">
          <td>${k}</td>
          <td>${r.rolls}</td>
          <td>$${r.pricePerCase.toFixed(2)}</td>
          <td>$${r.tape.toFixed(2)}</td>
          <td>$${r.total.toFixed(2)}</td>
          <td class="tf-qv-col-orange">$${r.perRoll.toFixed(2)}</td>
        </tr>`;
      }
    });
    tbody.innerHTML = html;
  }

  function updateCalculations(cases) {
    activeCases = cases;
    const handleKey = currentActiveProduct ? normalizeHandle(currentActiveProduct.handle || currentActiveProduct.title) : 'polypropylene-tape';
    const fallback = productSpecsFallback[handleKey] || productSpecsFallback['polypropylene-tape'];

    const qtyDisplay = document.getElementById('tfQvQtyDisplay');
    const hiddenQty = document.getElementById('tfQvHiddenQuantity');
    const propCases = document.getElementById('tfQvPropCases');
    const propRolls = document.getElementById('tfQvPropRolls');
    const propTotalPrice = document.getElementById('tfQvPropTotalPrice');
    const propPerRollPrice = document.getElementById('tfQvPropPerRollPrice');

    const sumCases = document.getElementById('tfQvSummaryCases');
    const sumRolls = document.getElementById('tfQvSummaryRolls');
    const sumPricePerCase = document.getElementById('tfQvSummaryPricePerCase');
    const totalPriceEl = document.getElementById('tfQvTotalPrice');
    const perRollPriceEl = document.getElementById('tfQvPerRollPrice');

    if (qtyDisplay) qtyDisplay.textContent = cases;
    if (hiddenQty) hiddenQty.value = cases;
    if (propCases) propCases.value = cases;
    if (sumCases) sumCases.textContent = cases;

    const r = fallback.rates[cases] || {
      pricePerCase: fallback.basePrice,
      total: cases * fallback.basePrice,
      rolls: cases * 8,
      perRoll: (cases * fallback.basePrice) / (cases * 8)
    };

    if (propRolls) propRolls.value = r.rolls;
    if (propTotalPrice) propTotalPrice.value = '$' + r.total.toFixed(2);
    if (propPerRollPrice) propPerRollPrice.value = '$' + r.perRoll.toFixed(2) + ' a roll';

    if (sumRolls) sumRolls.textContent = r.rolls;
    if (sumPricePerCase) sumPricePerCase.textContent = '$' + r.pricePerCase.toFixed(2);
    if (totalPriceEl) totalPriceEl.textContent = '$' + r.total.toFixed(2);
    if (perRollPriceEl) perRollPriceEl.textContent = '$' + r.perRoll.toFixed(2) + ' a roll';

    // Highlight preset button
    document.querySelectorAll('.tf-qv-case-preset').forEach(btn => {
      if (parseInt(btn.getAttribute('data-cases'), 10) === cases) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Highlight row in table
    document.querySelectorAll('#tfQvTableBody tr').forEach(row => {
      if (parseInt(row.getAttribute('data-cases'), 10) === cases) {
        row.style.backgroundColor = 'rgba(248, 184, 37, 0.22)';
      } else {
        row.style.backgroundColor = '';
      }
    });
  }

  function setupModalInteractions() {
    // 1. Material Option Pills (Manual switch overrides dynamic default)
    document.querySelectorAll('#tfQvMaterialGroup .tf-qv-pill').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#tfQvMaterialGroup .tf-qv-pill').forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');
        const val = this.getAttribute('data-val');
        const input = document.getElementById('tfQvPropMaterial');
        if (input) input.value = val;
      });
    });

    // 2. Generic Option Pill Groups (Width, Length, Tape Color, Coverage, Printed Before)
    const groups = ['width', 'length', 'tape_color', 'coverage', 'printed_before'];
    groups.forEach(g => {
      document.querySelectorAll(`.tf-qv-pill[data-group="${g}"]`).forEach(btn => {
        btn.addEventListener('click', function() {
          const parent = this.parentElement;
          parent.querySelectorAll('.tf-qv-pill').forEach(b => b.classList.remove('is-active'));
          this.classList.add('is-active');

          const val = this.getAttribute('data-val');
          const propIdMap = {
            width: 'tfQvPropWidth',
            length: 'tfQvPropLength',
            tape_color: 'tfQvPropTapeColor',
            coverage: 'tfQvPropCoverage',
            printed_before: 'tfQvPropPrintedBefore'
          };
          const input = document.getElementById(propIdMap[g]);
          if (input) input.value = val;
        });
      });
    });

    // 3. INKS Group: "One ink" -> 1 color, "Two ink" -> 2 colors, "Three ink" -> 3 colors
    document.querySelectorAll('.tf-qv-pill[data-group="inks"]').forEach(btn => {
      btn.addEventListener('click', function() {
        const parent = this.parentElement;
        parent.querySelectorAll('.tf-qv-pill').forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');

        const val = this.getAttribute('data-val');
        const input = document.getElementById('tfQvPropInks');
        if (input) input.value = val;

        const valLower = val.toLowerCase();
        if (valLower.indexOf('three') !== -1 || valLower.indexOf('3') !== -1) {
          maxAllowedInks = 3;
        } else if (valLower.indexOf('two') !== -1 || valLower.indexOf('2') !== -1) {
          maxAllowedInks = 2;
        } else {
          maxAllowedInks = 1;
        }

        // If currently selected colors exceed newly chosen max, trim excess
        if (selectedInkColors.length > maxAllowedInks) {
          selectedInkColors = selectedInkColors.slice(0, maxAllowedInks);
        }
        syncInkSwatchesUI();
      });
    });

    // 4. Ink Swatches: Multi-select up to maxAllowedInks
    document.querySelectorAll('.tf-qv-swatch').forEach(sw => {
      sw.addEventListener('click', function() {
        const val = this.getAttribute('data-val');
        const existingIdx = selectedInkColors.indexOf(val);

        if (existingIdx !== -1) {
          // Deselect if already active
          selectedInkColors.splice(existingIdx, 1);
        } else {
          // If we reached max, replace the oldest or earliest selection
          if (selectedInkColors.length >= maxAllowedInks) {
            if (maxAllowedInks === 1) {
              selectedInkColors = [val];
            } else {
              selectedInkColors.shift(); // Remove first to make room for newest
              selectedInkColors.push(val);
            }
          } else {
            selectedInkColors.push(val);
          }
        }

        syncInkSwatchesUI();
      });
    });

    function syncInkSwatchesUI() {
      document.querySelectorAll('.tf-qv-swatch').forEach(sw => {
        const val = sw.getAttribute('data-val');
        if (selectedInkColors.indexOf(val) !== -1) {
          sw.classList.add('is-active');
        } else {
          sw.classList.remove('is-active');
        }
      });
      const propInk = document.getElementById('tfQvPropInkColor');
      if (propInk) propInk.value = selectedInkColors.join(', ');
    }

    // 5. Case Stepper & Presets
    const plusBtn = document.getElementById('tfQvQtyPlus');
    const minusBtn = document.getElementById('tfQvQtyMinus');

    if (plusBtn) {
      plusBtn.addEventListener('click', function() {
        const next = (activeCases || 0) + 1;
        updateCalculations(next);
      });
    }
    if (minusBtn) {
      minusBtn.addEventListener('click', function() {
        if (activeCases && activeCases > 1) {
          updateCalculations(activeCases - 1);
        }
      });
    }

    document.querySelectorAll('.tf-qv-case-preset').forEach(btn => {
      btn.addEventListener('click', function() {
        const c = parseInt(this.getAttribute('data-cases'), 10);
        if (c) updateCalculations(c);
      });
    });

    // 6. Table Row click sets cases
    const tableBody = document.getElementById('tfQvTableBody');
    if (tableBody) {
      tableBody.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        if (row) {
          const c = parseInt(row.getAttribute('data-cases'), 10);
          if (c) updateCalculations(c);
        }
      });
    }

    // 7. Artwork Choice Radio Cards & Choose File Trigger
    const fileInput = document.getElementById('tfQvArtworkFileInput');

    document.querySelectorAll('.tf-qv-art-card').forEach(card => {
      card.addEventListener('click', function(e) {
        document.querySelectorAll('.tf-qv-art-card').forEach(c => c.classList.remove('is-active'));
        this.classList.add('is-active');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        const val = this.getAttribute('data-artwork');
        const propArt = document.getElementById('tfQvPropArtwork');
        if (propArt) propArt.value = val;

        // If user clicks "Upload now", immediately open file picker dialog
        if (val === 'Upload now' && fileInput) {
          fileInput.click();
        }
      });
    });

    // File input change: Store multiple files and display pills
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        if (this.files && this.files.length > 0) {
          Array.from(this.files).forEach(file => {
            // Avoid duplicate files with same name and size
            const alreadyExists = uploadedFilesStore.some(f => f.name === file.name && f.size === file.size);
            if (!alreadyExists) {
              uploadedFilesStore.push(file);
            }
          });
          renderUploadedFilesList();
        }
      });
    }

    // 8. Form validation and Dynamic Add To Cart submission
    const form = document.getElementById('tfQvForm');
    const addToCartBtn = document.getElementById('tfQvAddToCartBtn');

    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!activeCases) {
          alert('Please select the number of cases to proceed.');
          const caseSection = document.querySelector('.tf-qv-cases-row');
          if (caseSection) caseSection.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        // Fill files properties if present
        if (uploadedFilesStore.length > 0) {
          const names = uploadedFilesStore.map(f => f.name).join(', ');
          const sizes = uploadedFilesStore.map(f => (f.size / (1024 * 1024)).toFixed(1) + ' MB').join(', ');
          const propName = document.getElementById('tfQvPropArtworkFileName');
          const propSize = document.getElementById('tfQvPropArtworkFileSize');
          if (propName) propName.value = names;
          if (propSize) propSize.value = sizes;
        }

        // Ensure default fallback options if user left something blank
        const defaults = {
          tfQvPropWidth: '3 inch',
          tfQvPropLength: '375 feet',
          tfQvPropTapeColor: 'White',
          tfQvPropInks: 'One ink',
          tfQvPropInkColor: selectedInkColors.length ? selectedInkColors.join(', ') : 'Black',
          tfQvPropCoverage: 'Standard',
          tfQvPropPrintedBefore: 'No - New design',
          tfQvPropArtwork: 'Upload now'
        };
        for (const [id, defVal] of Object.entries(defaults)) {
          const el = document.getElementById(id);
          if (el && !el.value) {
            el.value = defVal;
          }
        }

        const originalBtnText = addToCartBtn ? addToCartBtn.textContent : 'Add to cart';
        if (addToCartBtn) {
          addToCartBtn.disabled = true;
          addToCartBtn.textContent = 'Adding to cart...';
        }

        let variantId = document.getElementById('tfQvVariantId')?.value;

        // If no variantId is currently present in form, attempt to fetch first available variant from product handle
        if (!variantId && currentActiveProduct) {
          try {
            const handle = normalizeHandle(currentActiveProduct.handle || currentActiveProduct.title);
            const res = await fetch('/products/' + handle + '.js');
            if (res.ok) {
              const prodJson = await res.json();
              if (prodJson && prodJson.variants && prodJson.variants.length > 0) {
                variantId = prodJson.variants[0].id;
                const varInput = document.getElementById('tfQvVariantId');
                if (varInput) varInput.value = variantId;
              }
            }
          } catch(err) {
            console.log('Error fetching product JSON:', err);
          }
        }

        // 1. If we have a Shopify variantId, add directly via /cart/add.js
        if (variantId) {
          try {
            const formData = new FormData(form);
            const addRes = await fetch('/cart/add.js', {
              method: 'POST',
              body: formData
            });

            if (addRes.ok) {
              window.location.href = '/cart';
              return;
            } else {
              const errData = await addRes.json();
              console.warn('Shopify cart/add.js error:', errData);
            }
          } catch(err) {
            console.error('AJAX cart add failed:', err);
          }
        }

        // 2. Native form submission or fallback
        if (variantId) {
          form.submit();
        } else {
          // If the product doesn't exist yet in the Shopify database (e.g. mock/draft product),
          // navigate to /cart directly so user sees their cart
          window.location.href = '/cart';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickView);
  } else {
    initQuickView();
  }
})();
