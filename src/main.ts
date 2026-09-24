const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('No se encontró el elemento #app');
}

app.innerHTML = `
  <h1>Habit Tracker</h1>
  <p>Mi primer proyecto con TypeScript.</p>
`;