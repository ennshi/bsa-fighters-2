import { createElement } from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import { fight } from './fight';
import { showWinnerModal } from './modal/winner';

export function renderArena(selectedFighters) {
  const root = document.getElementById('root');
  const arena = createArena(selectedFighters);

  root.innerHTML = '';
  root.append(arena);

  // todo:
  // - start the fight
  // - when fight is finished show winner
  const [firstFighter, secondFighter] = selectedFighters;
  fight(firstFighter, secondFighter)
    .then(fighter => showWinnerModal(fighter));
}

function createArena(selectedFighters) {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createHealthIndicators(...selectedFighters);
  const fighters = createFighters(...selectedFighters);
  const shields = createShields(...selectedFighters);
  const fists = createFists(...selectedFighters);
  const fireballs = createFireballs(...selectedFighters);
  const superindicators = createSuperIndicators(...selectedFighters);

  arena.append(healthIndicators, fighters, shields, fists, fireballs, superindicators);
  return arena;
}

function createHealthIndicators(leftFighter, rightFighter) {
  const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
  const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
  const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

  healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  return healthIndicators;
}

function createHealthIndicator(fighter, position) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
  const bar = createElement({ tagName: 'div', className: 'arena___health-bar', attributes: { id: `${position}-fighter-indicator` }});

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}

function createFighters(firstFighter, secondFighter) {
  const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
  const firstFighterElement = createFighter(firstFighter, 'left');
  const secondFighterElement = createFighter(secondFighter, 'right');

  battleField.append(firstFighterElement, secondFighterElement);
  return battleField;
}

function createFighter(fighter, position) {
  const imgElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}

function createShields(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___shields-container` });
  const firstFighterShield = createShield(firstFighter, 'left');
  const secondFighterShield = createShield(secondFighter, 'right');

  container.append(firstFighterShield, secondFighterShield);
  return container;
}

function createShield(fighter, position) {
  const imgElement = createShieldImage();
  const positionClassName = position === 'right' ? 'arena___right-shield' : 'arena___left-shield';
  const shieldElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-shield` }
  });

  shieldElement.append(imgElement);
  return shieldElement;
}

function createShieldImage() {
  const attributes = {
    src: '../../resources/shield.png',
    alt: 'shield'
  };
  return createElement({
    tagName: 'img',
    className: 'shield-img',
    attributes,
  });
}

function createFists(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___fists-container` });
  const firstFighterFist = createFist(firstFighter, 'left');
  const secondFighterFist = createFist(secondFighter, 'right');

  container.append(firstFighterFist, secondFighterFist);
  return container;
}

function createFist(fighter, position) {
  const imgElement = createFistImage();
  const positionClassName = position === 'right' ? 'arena___right-fist' : 'arena___left-fist';
  const fistElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-fist` }
  });

  fistElement.append(imgElement);
  return fistElement;
}

function createFistImage() {
  const attributes = {
    src: '../../resources/fist.png',
    alt: 'fist'
  };
  return createElement({
    tagName: 'img',
    className: 'fist-img',
    attributes,
  });
}

function createFireballs(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___fireballs-container` });
  const firstFighterBall = createFireball(firstFighter, 'left');
  const secondFighterBall = createFireball(secondFighter, 'right');

  container.append(firstFighterBall, secondFighterBall);
  return container;
}

function createFireball(fighter, position) {
  const imgElement = createFireballImage();
  const positionClassName = position === 'right' ? 'arena___right-fireball' : 'arena___left-fireball';
  const fireballElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-fireball` }
  });

  fireballElement.append(imgElement);
  return fireballElement;
}

function createFireballImage() {
  const attributes = {
    src: '../../resources/fireball.gif',
    alt: 'fireball'
  };
  return createElement({
    tagName: 'img',
    className: 'fireball-img',
    attributes,
  });
}

function createSuperIndicators(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___superindicators-container` });
  const firstFighterSuper = createSuperIndicator(firstFighter, 'left');
  const secondFighterSuper = createSuperIndicator(secondFighter, 'right');

  container.append(firstFighterSuper, secondFighterSuper);
  return container;
}

function createSuperIndicator(fighter, position) {
  const imgElement = createFireballImage();
  const positionClassName = position === 'right' ? 'arena___right-superindicator' : 'arena___left-superindicator';
  const superIndicatorElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-superindicator` }
  });

  superIndicatorElement.append(imgElement);
  return superIndicatorElement;
}
