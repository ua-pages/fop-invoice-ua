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
      this.innerHTML = `<p>Немає інвойсів</p>`;
      return;
    }

    const html = `
      <ul>
        ${this._invoices.map(inv => `
          <li data-id="${inv.id}" data-status="${inv.status}">
            <div class="invoice-header">
              <strong>${inv.client}</strong>
              <span class="amount">${inv.amount} <span class="currency">грн</span></span>
            </div>
            <div class="invoice-date">${inv.date || ''}</div>
            <div class="description">${inv.description || ''}</div>
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