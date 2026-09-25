function setupProductInteractions(scope = document) {
  scope.querySelectorAll('.product-gallery').forEach((gallery) => {
    if (gallery.dataset.galleryReady === 'true') return;
    gallery.dataset.galleryReady = 'true';
    const media = [...gallery.querySelectorAll('.product-media')];
    gallery.querySelectorAll('[data-product-media]').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        media.forEach((item) => item.classList.toggle('product-media--hidden', item.dataset.mediaId !== thumb.dataset.productMedia));
        gallery.querySelectorAll('.product-thumb').forEach((item) => item.classList.remove('is-selected'));
        thumb.classList.add('is-selected');
      });
    });
  });

  scope.querySelectorAll('.product-form').forEach((form) => {
    if (form.dataset.productReady === 'true') return;
    form.dataset.productReady = 'true';

    const variantSelect = form.querySelector('[data-product-variant-select]');
    const price = form.closest('.product-info')?.querySelector('[data-product-price]');
    const addButton = form.querySelector('[data-add-button]');
    const quantity = form.querySelector('input[name="quantity"]');
    const chips = [...form.querySelectorAll('[data-option-value]')];

    const syncVariant = () => {
      const selected = [...form.querySelectorAll('.product-option')].map((field) => {
        return field.querySelector('.option-chip.is-selected')?.dataset.optionValue || '';
      });
      const match = [...variantSelect.options].find((option) => {
        const values = (option.dataset.options || '').split('||');
        return selected.every((value, index) => !value || values[index] === value);
      });

      if (!match) return;
      variantSelect.value = match.value;
      if (price) price.textContent = match.dataset.price;
      if (addButton) {
        const available = match.dataset.available === 'true';
        addButton.disabled = !available;
        const label = addButton.querySelector('span:not(.product-add-icon)');
        if (label) label.textContent = available ? addButton.dataset.add : addButton.dataset.sold;
        else addButton.textContent = available ? addButton.dataset.add : addButton.dataset.sold;
      }
    };

    chips.forEach((chip) => chip.addEventListener('click', () => {
      const position = chip.dataset.optionPosition;
      form.querySelectorAll(`[data-option-position="${position}"]`).forEach((item) => item.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      const label = form.querySelector(`[data-option-label="${position}"]`);
      if (label) label.textContent = chip.dataset.optionValue;
      syncVariant();
    }));

    form.querySelector('[data-quantity-minus]')?.addEventListener('click', () => {
      quantity.value = Math.max(1, Number(quantity.value || 1) - 1);
    });
    form.querySelector('[data-quantity-plus]')?.addEventListener('click', () => {
      quantity.value = Number(quantity.value || 1) + 1;
    });
  });
}

setupProductInteractions();
document.addEventListener('shopify:section:load', (event) => setupProductInteractions(event.target));
