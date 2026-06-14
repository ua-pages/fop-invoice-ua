export class InvoiceForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form>
        <input name="date" type="date" required />
        <input name="client" placeholder="Клієнт" required />
        <div class="amount-wrap">
          <input name="amount" type="number" placeholder="0" required />
          <span class="currency">грн</span>
        </div>
        <textarea name="description" placeholder="Опис (опціонально)" rows="3"></textarea>
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
    });
  }
}

customElements.define('invoice-form', InvoiceForm);