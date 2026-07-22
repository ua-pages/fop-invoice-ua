export class InvoiceForm extends HTMLElement {
  connectedCallback() {
    const today = new Date().toISOString().slice(0, 10);

    this.innerHTML = `
      <form>
        <input name="date" type="date" value="${today}" aria-label="Дата інвойсу" required />
        <input name="client" placeholder="Клієнт" aria-label="Клієнт" autocomplete="organization" required />
        <div class="amount-wrap">
          <input name="amount" type="number" min="0.01" step="0.01" placeholder="0" aria-label="Сума інвойсу" required />
          <span class="currency">грн</span>
        </div>
        <textarea name="description" placeholder="Опис (опціонально)" aria-label="Опис інвойсу" rows="3"></textarea>
        <button type="submit">Створити</button>
      </form>
    `;

    this.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.target));

      this.dispatchEvent(new CustomEvent('create-invoice', {
        detail: {
          ...data,
          amount: Number(data.amount)
        },
        bubbles: true
      }));

      e.target.reset();
      e.target.elements.date.value = new Date().toISOString().slice(0, 10);
    });
  }
}

customElements.define('invoice-form', InvoiceForm);
