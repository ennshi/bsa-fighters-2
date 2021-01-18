export function changeHealthbarWidth(initialWidth, initialHealth, currentHealth, position) {
  const healthbar = document.getElementById(`${position}-fighter-indicator`);
  const newHealthbar = (initialWidth * currentHealth / initialHealth);
  const healthbarWidth = newHealthbar >= 0 ? newHealthbar : 0;
  healthbar.style.width = `${healthbarWidth}px`;
}

export function toggleShield(position) {
  const shield = document.getElementById(`${position}-shield`);
  shield.style.visibility = (shield.style.visibility === 'visible') ? 'hidden' : 'visible';
}

export function showAttack(position, attack) {
  const attackEl = document.getElementById(`${position}-${attack}`);
  attackEl.classList.add(`arena___${position}-${attack}-show`);
  setTimeout(() => {
    attackEl.classList.remove(`arena___${position}-${attack}-show`);
  }, 300);
}

export function toggleSuperindicator(canSuperAttack, position) {
  const indicator = document.getElementById(`${position}-superindicator`);
  indicator.style.visibility = canSuperAttack ? 'visible' : 'hidden';
}
