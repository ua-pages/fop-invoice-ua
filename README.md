# 🇺🇦 ФОП Інвойси

Мінімальний трекер інвойсів для українських ФОПів. Локально, без сервера, без залежностей.

**Живе демо:** [ua-pages.github.io/fop-invoice-ua](https://ua-pages.github.io/fop-invoice-ua/)

## Можливості

- ➕ Створення інвойсів з датою, клієнтом, сумою, описом
- 📋 Список інвойсів
- 🔁 Перемикання статусу оплачено / очікує
- ❌ Видалення інвойсів
- 💾 Збереження в IndexedDB (в браузері)
- 📤 Експорт у XML
- 📥 Імпорт з XML
- ⚡ Працює офлайн
- 🧪 Показові дані в один клік
- 📊 Живі підсумки оплат і очікувань

## Технології

- Vanilla JavaScript
- Web Components
- IndexedDB
- Zero dependencies
- Node.js (тільки для dev сервера)

## Як запустити

```bash
git clone git@github.com:ua-pages/fop-invoice-ua.git
cd fop-invoice-ua
npm run dev
# або: node server.js
```

Відкрити `http://localhost:8080` у браузері.

## Нотатки

- Дані зберігаються **локально в браузері**
- Очищення даних браузера видалить усі інвойси
- Особистий інструмент, не бухгалтерська система

## Формат XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<invoices>
  <invoice>
    <id>1700000000000</id>
    <client>Клієнт</client>
    <amount>1000</amount>
    <description>Опис</description>
    <date>2026-06-14</date>
    <status>pending</status>
  </invoice>
</invoices>
```

## Ліцензія

MIT
