(function () {
  'use strict';

  var DRAWER_ID = 'tfCartDrawer';
  var OVERLAY_ID = 'tfCartDrawerOverlay';
  var CLOSE_ID = 'tfCartDrawerClose';
  var COUNT_ID = 'tfCartDrawerCount';
  var EMPTY_ID = 'tfCartDrawerEmpty';
  var LOADING_ID = 'tfCartDrawerLoading';
  var ITEMS_ID = 'tfCartDrawerItems';
  var FOOTER_ID = 'tfCartDrawerFooter';
  var SUBTOTAL_ID = 'tfCartDrawerSubtotal';
  var TOTAL_ID = 'tfCartDrawerTotal';
  var CHECKOUT_FORM_ID = 'tfCartDrawerCheckoutForm';

  var isOpen = false;
  var isUsingMockItem = false;

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parsePrice(val) {
    if (typeof val === 'number') return isFinite(val) ? val : 0;
    var cleaned = String(val || '').replace(/[^0-9.]/g, '');
    var num = parseFloat(cleaned);
    return isFinite(num) ? num : 0;
  }

  function formatMoney(amount) {
    var num = isFinite(amount) ? amount : 0;
    return '$' + num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function getMockSampleItem() {
    try {
      var raw = localStorage.getItem('tf_sample_box_item');
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function saveMockSampleItem(item) {
    try {
      if (!item) {
        localStorage.removeItem('tf_sample_box_item');
      } else {
        localStorage.setItem('tf_sample_box_item', JSON.stringify(item));
      }
    } catch (e) {}
  }

  function closeMobileMenuIfOpen() {
    var mobileDrawer = document.getElementById('MobileMenuDrawer');
    var mobileBackdrop = document.getElementById('MobileMenuBackdrop');
    if (mobileDrawer && (mobileDrawer.classList.contains('is-open') || mobileDrawer.classList.contains('active'))) {
      var closeBtn = document.getElementById('MobileMenuClose');
      if (closeBtn) {
        closeBtn.click();
      } else {
        mobileDrawer.classList.remove('is-open', 'active');
        if (mobileBackdrop) mobileBackdrop.classList.remove('is-open', 'active');
      }
    }
  }

  function setScrollLock(locked) {
    if (locked) {
      document.body.classList.add('tf-cd-scroll-lock');
      if (window.lenis && typeof window.lenis.stop === 'function') {
        window.lenis.stop();
      }
    } else {
      document.body.classList.remove('tf-cd-scroll-lock');
      if (window.lenis && typeof window.lenis.start === 'function') {
        window.lenis.start();
      }
    }
  }

  function openDrawer() {
    var drawer = $(DRAWER_ID);
    var overlay = $(OVERLAY_ID);
    if (!drawer || !overlay) return;

    closeMobileMenuIfOpen();
    isOpen = true;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    setScrollLock(true);

    refreshCart();
  }

  function closeDrawer() {
    var drawer = $(DRAWER_ID);
    var overlay = $(OVERLAY_ID);
    if (!drawer || !overlay) return;

    isOpen = false;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    setScrollLock(false);
  }

  function syncHeaderCount(count) {
    if (typeof window.updateHeaderCartCount === 'function') {
      window.updateHeaderCartCount(count);
    } else {
      document.querySelectorAll('.cart-count, .mobile-drawer__cart-badge').forEach(function (badge) {
        badge.textContent = String(count);
      });
    }
  }

  function getItemPricing(item) {
    var props = item.properties || {};
    var unitPrice = 0;

    if (props['Total Price']) {
      var parsedProp = parsePrice(props['Total Price']);
      if (parsedProp > 0) unitPrice = parsedProp;
    }

    if (unitPrice <= 0) {
      var cents = typeof item.final_price === 'number' ? item.final_price : (item.price || 0);
      unitPrice = cents / 100;
    }

    var qty = parseInt(item.quantity, 10) || 1;
    return {
      unitPrice: unitPrice,
      qty: qty,
      lineTotal: unitPrice * qty
    };
  }

  function buildSpecsHtml(item) {
    var props = item.properties || {};
    var titleLower = String(item.product_title || item.title || '').toLowerCase();
    var isSample = String(props['Item'] || '').toLowerCase().indexOf('sample') !== -1 ||
      titleLower.indexOf('sample') !== -1 ||
      Boolean(props['Boxes']);

    if (isSample) {
      var line1Parts = [];
      if (props['Material']) line1Parts.push(props['Material']);
      if (props['Boxes']) line1Parts.push(props['Boxes'] + ' boxes');
      var line2Parts = [];
      if (props['Printed Roll']) line2Parts.push('Printed Roll: ' + props['Printed Roll']);
      if (props['Shipping']) line2Parts.push(props['Shipping']);

      return {
        line1: line1Parts.join(' \u00B7 '),
        line2: line2Parts.join(' \u00B7 '),
        pillText: 'Sample Box'
      };
    }

    var hasCustomTapeProps = Boolean(props['Width'] || props['Length'] || props['Cases'] || props['Inks']);
    if (hasCustomTapeProps) {
      var spec1 = [];
      if (props['Width'] && props['Length']) {
        spec1.push(props['Width'] + ' \u00D7 ' + props['Length']);
      } else if (props['Width'] || props['Length']) {
        spec1.push(props['Width'] || props['Length']);
      }
      if (props['Tape Color'] || props['Tape color']) {
        spec1.push(props['Tape Color'] || props['Tape color']);
      }

      var spec2 = [];
      if (props['Inks']) spec2.push(String(props['Inks']).toLowerCase());
      if (props['Cases']) spec2.push(props['Cases'] + ' cases');
      if (props['Rolls']) spec2.push(props['Rolls'] + ' rolls');

      var artworkVal = String(props['Artwork'] || '').toLowerCase();
      var hasFile = Boolean(props['Artwork File'] || props['File Name'] || artworkVal.indexOf('upload now') !== -1 && props['Artwork File']);
      var pill = hasFile ? 'Artwork uploaded' : 'Artwork to follow';

      return {
        line1: spec1.join(' \u00B7 '),
        line2: spec2.join(' \u00B7 '),
        pillText: pill
      };
    }

    var variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '';
    return {
      line1: variantTitle,
      line2: '',
      pillText: ''
    };
  }

  function renderCartData(items, isMock) {
    isUsingMockItem = Boolean(isMock);

    var countEl = $(COUNT_ID);
    var emptyEl = $(EMPTY_ID);
    var itemsEl = $(ITEMS_ID);
    var footerEl = $(FOOTER_ID);
    var subtotalEl = $(SUBTOTAL_ID);
    var totalEl = $(TOTAL_ID);

    if (!itemsEl || !emptyEl || !footerEl) return;

    var count = items.length;
    if (countEl) {
      countEl.textContent = count + (count === 1 ? ' item' : ' items');
    }
    syncHeaderCount(count);

    if (count === 0) {
      itemsEl.innerHTML = '';
      emptyEl.hidden = false;
      footerEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    footerEl.hidden = false;

    var subtotal = 0;
    var html = items.map(function (item, idx) {
      var pricing = isMock
        ? {
            unitPrice: parsePrice(item.price),
            qty: parseInt(item.quantity, 10) || 1,
            lineTotal: parsePrice(item.price) * (parseInt(item.quantity, 10) || 1)
          }
        : getItemPricing(item);

      subtotal += pricing.lineTotal;

      var title = escapeHtml(item.product_title || item.title || (item.properties && item.properties['Item']) || 'TapeFox Product');
      var url = escapeHtml(item.url || '#');
      var imgUrl = item.image || (item.featured_image && item.featured_image.url) || '';
      var key = escapeHtml(item.key || item.id || String(idx));
      var specs = buildSpecsHtml(item);

      var thumbHtml = imgUrl
        ? '<img src="' + escapeHtml(imgUrl) + '" alt="' + title + '" loading="lazy">'
        : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E877D" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="4"/></svg>';

      var specsHtml = '';
      if (specs.line1 || specs.line2) {
        specsHtml = '<div class="tf-cd-specs">' +
          (specs.line1 ? '<span class="tf-cd-spec-line">' + escapeHtml(specs.line1) + '</span>' : '') +
          (specs.line2 ? '<span class="tf-cd-spec-line">' + escapeHtml(specs.line2) + '</span>' : '') +
        '</div>';
      }

      var pillHtml = specs.pillText
        ? '<div class="tf-cd-status-pill">' + escapeHtml(specs.pillText) + '</div>'
        : '';

      return (
        '<div class="tf-cd-card" data-key="' + key + '" data-mock="' + (isMock ? '1' : '0') + '">' +
          '<div class="tf-cd-thumb">' + thumbHtml + '</div>' +
          '<div class="tf-cd-card-content">' +
            '<div class="tf-cd-card-top">' +
              '<h3 class="tf-cd-item-title"><a href="' + url + '">' + title + '</a></h3>' +
              '<button type="button" class="tf-cd-remove-btn" data-action="remove" data-key="' + key + '">Remove</button>' +
            '</div>' +
            specsHtml +
            pillHtml +
            '<div class="tf-cd-card-bottom">' +
              '<div class="tf-cd-stepper">' +
                '<button type="button" class="tf-cd-step-btn" data-action="minus" data-key="' + key + '" data-qty="' + pricing.qty + '" aria-label="Decrease quantity">\u2212</button>' +
                '<span class="tf-cd-step-val">' + pricing.qty + '</span>' +
                '<button type="button" class="tf-cd-step-btn" data-action="plus" data-key="' + key + '" data-qty="' + pricing.qty + '" aria-label="Increase quantity">+</button>' +
              '</div>' +
              '<div class="tf-cd-line-price">' + formatMoney(pricing.lineTotal) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    itemsEl.innerHTML = html;

    var formattedSubtotal = formatMoney(subtotal);
    if (subtotalEl) subtotalEl.textContent = formattedSubtotal;
    if (totalEl) totalEl.textContent = formattedSubtotal;
  }

  function refreshCart() {
    var loadingEl = $(LOADING_ID);
    if (loadingEl) loadingEl.hidden = false;

    return fetch('/cart.js', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load cart');
        return res.json();
      })
      .then(function (cart) {
        if (loadingEl) loadingEl.hidden = true;
        var items = Array.isArray(cart.items) ? cart.items : [];
        if (items.length > 0) {
          renderCartData(items, false);
        } else {
          var mockItem = getMockSampleItem();
          if (mockItem) {
            renderCartData([mockItem], true);
          } else {
            renderCartData([], false);
          }
        }
      })
      .catch(function (err) {
        if (loadingEl) loadingEl.hidden = true;
        console.debug('Cart drawer sync error:', err);
        var mockItem = getMockSampleItem();
        if (mockItem) {
          renderCartData([mockItem], true);
        } else {
          renderCartData([], false);
        }
      });
  }

  function updateItemQuantity(key, newQty, isMock, cardEl) {
    if (isMock) {
      var mockItem = getMockSampleItem();
      if (!mockItem || newQty <= 0) {
        saveMockSampleItem(null);
      } else {
        mockItem.quantity = newQty;
        saveMockSampleItem(mockItem);
      }
      refreshCart();
      window.dispatchEvent(new CustomEvent('cart:updated'));
      return;
    }

    if (cardEl) cardEl.classList.add('is-updating');

    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: Math.max(0, newQty) })
    })
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        var items = Array.isArray(cart.items) ? cart.items : [];
        renderCartData(items, false);
        window.dispatchEvent(new CustomEvent('cart:updated'));
      })
      .catch(function (err) {
        console.error('Cart drawer update error:', err);
        if (cardEl) cardEl.classList.remove('is-updating');
      });
  }

  function bindEvents() {
    var closeBtn = $(CLOSE_ID);
    var overlay = $(OVERLAY_ID);
    var itemsEl = $(ITEMS_ID);
    var checkoutForm = $(CHECKOUT_FORM_ID);

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    });

    if (itemsEl) {
      itemsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;

        var action = btn.getAttribute('data-action');
        var key = btn.getAttribute('data-key');
        var cardEl = btn.closest('.tf-cd-card');
        var isMock = cardEl && cardEl.getAttribute('data-mock') === '1';
        var currentQty = parseInt(btn.getAttribute('data-qty'), 10) || 1;

        if (action === 'remove') {
          updateItemQuantity(key, 0, isMock, cardEl);
        } else if (action === 'minus') {
          updateItemQuantity(key, currentQty - 1, isMock, cardEl);
        } else if (action === 'plus') {
          updateItemQuantity(key, currentQty + 1, isMock, cardEl);
        }
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function (e) {
        if (isUsingMockItem) {
          e.preventDefault();
          window.location.href = '/pages/checkout';
        }
      });
    }

    // Intercept header cart icon & mobile drawer cart button
    document.addEventListener('click', function (e) {
      var cartTrigger = e.target.closest('.header-cart, .mobile-drawer__btn-cart');
      if (!cartTrigger) return;
      e.preventDefault();
      openDrawer();
    });

    // Intercept collection card quick-add forms (.cp-card__cart-form)
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('.cp-card__cart-form');
      if (!form) return;
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Add to cart failed');
          return res.json();
        })
        .then(function () {
          window.dispatchEvent(new CustomEvent('cart:updated'));
          openDrawer();
        })
        .catch(function (err) {
          console.error('Quick add failed:', err);
          form.submit();
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });

    window.addEventListener('cart:updated', function () {
      if (isOpen) {
        refreshCart();
      }
    });
  }

  window.TapeFoxCartDrawer = {
    open: openDrawer,
    close: closeDrawer,
    refresh: refreshCart
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents);
  } else {
    bindEvents();
  }
})();
