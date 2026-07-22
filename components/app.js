import { openDB, getAllInvoices, addInvoice, getInvoice, updateInvoice, deleteInvoice } from '../db.js';
import './invoice-form.js';
import './invoice-list.js';

const db = await openDB();
const listEl = document.querySelector('invoice-list');
const demoButton = document.getElementById('load-demo');
const countEl = document.getElementById('invoice-count');
const pendingEl = document.getElementById('pending-total');
const paidEl = document.getElementById('paid-total');

const demoInvoices = [
  {
    id: 'demo-brand-system',
    client: 'Майстерня «Тепло»',
    amount: 18400,
    description: 'Дизайн-система та адаптивна верстка',
    date: '2026-07-08',
    status: 'paid'
  },
  {
    id: 'demo-landing-page',
    client: 'ГО «Сильні разом»',
    amount: 12750,
    description: 'Лендінг для благодійної події',
    date: '2026-07-17',
    status: 'pending'
  },
  {
    id: 'demo-support',
    client: 'Крамниця «Лист»',
    amount: 6800,
    description: 'Технічна підтримка за липень',
    date: '2026-07-21',
    status: 'pending'
  }
];

async function loadInvoices() {
  const data = await getAllInvoices(db);
  const invoices = data.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  listEl.invoices = invoices;
  renderSummary(invoices);

  const hasAllDemoInvoices = demoInvoices.every(demo => invoices.some(invoice => invoice.id === demo.id));
  demoButton.disabled = hasAllDemoInvoices;
  demoButton.textContent = hasAllDemoInvoices ? 'Приклад завантажено' : 'Завантажити приклад';
}

function renderSummary(invoices) {
  const total = status => invoices
    .filter(invoice => invoice.status === status)
    .reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0);

  countEl.textContent = String(invoices.length);
  pendingEl.textContent = formatCurrency(total('pending'));
  paidEl.textContent = formatCurrency(total('paid'));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0
  }).format(value);
}

demoButton.addEventListener('click', async () => {
  for (const invoice of demoInvoices) {
    if (!await getInvoice(db, invoice.id)) {
      await addInvoice(db, invoice);
    }
  }

  await loadInvoices();
});

// створення
document.addEventListener('create-invoice', async (e) => {
  await addInvoice(db, {
    id: Date.now().toString(),
    ...e.detail,
    status: 'pending',
    date: e.detail.date || new Date().toISOString().slice(0, 10)
  });

  await loadInvoices();
});

// toggle статус
document.addEventListener('toggle-invoice', async (e) => {
  const item = await getInvoice(db, e.detail.id);

  item.status = item.status === 'paid' ? 'pending' : 'paid';

  await updateInvoice(db, item);

  await loadInvoices();
});

// видалення
document.addEventListener('delete-invoice', async (e) => {
  await deleteInvoice(db, e.detail.id);
  await loadInvoices();
});

// XML експорт
document.getElementById('export-xml').addEventListener('click', async () => {
  const invoices = await getAllInvoices(db);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<invoices>\n${
    invoices.map(inv => `  <invoice>
    <id>${esc(inv.id)}</id>
    <client>${esc(inv.client)}</client>
    <amount>${inv.amount}</amount>
    <description>${esc(inv.description || '')}</description>
    <date>${esc(inv.date || '')}</date>
    <status>${esc(inv.status)}</status>
  </invoice>`).join('\n')
  }\n</invoices>`;

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoices-${new Date().toISOString().slice(0, 10)}.xml`;
  a.click();
  URL.revokeObjectURL(url);
});

// XML імпорт
document.getElementById('import-xml').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');

  const nodes = doc.querySelectorAll('invoice');
  let count = 0;

  for (const node of nodes) {
    const id = node.querySelector('id')?.textContent || Date.now().toString() + Math.random();
    const existing = await getInvoice(db, id);
    if (existing) continue;

    await addInvoice(db, {
      id,
      client: node.querySelector('client')?.textContent || '',
      amount: Number(node.querySelector('amount')?.textContent) || 0,
      description: node.querySelector('description')?.textContent || '',
      date: node.querySelector('date')?.textContent || '',
      status: node.querySelector('status')?.textContent || 'pending'
    });
    count++;
  }

  e.target.value = '';
  await loadInvoices();
  alert(`Імпортовано ${count} інвойсів`);
});

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// старт
loadInvoices();
