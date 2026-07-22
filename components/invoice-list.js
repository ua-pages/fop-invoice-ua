export class InvoiceList extends HTMLElement {
  constructor() {
    super();
    this._invoices = [];
  }

  set invoices(data) {
    this._invoices = data || [];
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._invoices.length) {
      this.innerHTML = `<p class="empty">Інвойсів ще немає.<br>Створіть перший або завантажте показовий приклад.</p>`;
      return;
    }

    const html = `
      <ul>
        ${this._invoices.map(inv => `
          <li data-id="${inv.id}" data-status="${inv.status}">
            <div class="invoice-header">
              <strong>${escapeHtml(inv.client)}</strong>
              <span class="amount">${formatAmount(inv.amount)} <span class="currency">грн</span></span>
            </div>
            <div class="invoice-date">${escapeHtml(inv.date || '')}</div>
            <div class="description">${escapeHtml(inv.description || '')}</div>
            <div class="actions">
              <button class="toggle-btn" data-action="toggle">
                ${inv.status === 'paid' ? 'Оплачено' : 'Очікує'}
              </button>
              <button class="delete-btn" data-action="delete">✕</button>
            </div>
          </li>
        `).join('')}
      </ul>
    `;

    this.replaceChildren();
    this.insertAdjacentHTML('afterbegin', html);

    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll('button[data-action="toggle"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        const id = li.dataset.id;

        this.dispatchEvent(new CustomEvent('toggle-invoice', {
          detail: { id },
          bubbles: true
        }));
      });
    });

    this.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        const id = li.dataset.id;

        this.dispatchEvent(new CustomEvent('delete-invoice', {
          detail: { id },
          bubbles: true
        }));
      });
    });
  }
}

customElements.define('invoice-list', InvoiceList);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatAmount(value) {
  return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(Number(value) || 0);
}
