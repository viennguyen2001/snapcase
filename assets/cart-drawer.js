(function () {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;
  const itemsEl = drawer.querySelector('[data-cart-items]');
  const emptyEl = drawer.querySelector('[data-cart-empty]');
  const money = (cents) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cents / 100);
  const open = () => { drawer.hidden = false; document.documentElement.classList.add('cart-drawer-open'); };
  const close = () => { drawer.hidden = true; document.documentElement.classList.remove('cart-drawer-open'); };
  const paint = (cart) => {
    itemsEl.innerHTML = cart.items.map((item) => `<article class="cart-drawer-item" data-cart-item data-key="${item.key}"><a href="${item.url}"><img src="${item.image || ''}" alt="${item.product_title || ''}"></a><div class="cart-drawer-item-info"><h3>${item.product_title}</h3><p>${item.variant_title || ''}</p><div class="cart-drawer-quantity"><button type="button" data-cart-minus>−</button><span data-cart-qty>${item.quantity}</span><button type="button" data-cart-plus>+</button></div><button type="button" class="cart-remove" data-cart-remove>♧</button></div><strong class="cart-drawer-line-price">${money(item.final_line_price)}</strong></article>`).join('');
    emptyEl.hidden = cart.item_count > 0;
    drawer.querySelectorAll('[data-cart-total]').forEach((el) => { el.textContent = money(cart.total_price); });
    drawer.querySelector('[data-cart-total-copy]').textContent = money(cart.total_price);
    bindItems();
  };
  const refresh = () => fetch('/cart.js').then((r) => r.json()).then(paint);
  const change = (key, quantity) => fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: key, quantity }) }).then((r) => r.json()).then(paint);
  const bindItems = () => drawer.querySelectorAll('[data-cart-item]').forEach((row) => {
    const key = row.dataset.key;
    const qty = () => Number(row.querySelector('[data-cart-qty]').textContent || 1);
    row.querySelector('[data-cart-minus]')?.addEventListener('click', () => change(key, Math.max(0, qty() - 1)));
    row.querySelector('[data-cart-plus]')?.addEventListener('click', () => change(key, qty() + 1));
    row.querySelector('[data-cart-remove]')?.addEventListener('click', () => change(key, 0));
  });
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-cart-open]');
    if (opener) { event.preventDefault(); refresh().then(open); }
    if (event.target.closest('[data-cart-close]')) close();
  });
  document.addEventListener('submit', (event) => {
    const form = event.target.closest('form[action*="/cart/add"]');
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    fetch('/cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body: data }).then((r) => { if (!r.ok) throw new Error('Unable to add item'); return r.json(); }).then(refresh).then(open);
  });
  bindItems();
})();
