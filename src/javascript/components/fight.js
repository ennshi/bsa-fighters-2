import { controls } from '../../constants/controls';
import Player from './player';
import { changeHealthbarWidth, showAttack, toggleShield, toggleSuperIndicator } from './fightersViewUpdates';
import { soundOfSuccess } from './audioEffects';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let winnerNum = '';
    const pressedBtnSet = new Set();
    const players = createPlayers(firstFighter, secondFighter);
    const onKeyDown = (e) => {
        handleKeyDown(e, pressedBtnSet, players);
        winnerNum = checkEndGame(players);
        if(winnerNum) {
          soundOfSuccess();
          (winnerNum === 1) && resolve(firstFighter);
          (winnerNum === 2) && resolve(secondFighter);
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp);
        }
    };
    const onKeyUp = (e) => handleKeyUp(e, pressedBtnSet, players);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  const damage = getHitPower(attacker) - getBlockPower(defender);
  if(damage < 0) {
    return 0;
  }
  return damage;
}

export function getHitPower(fighter) {
  // return hit power
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  // return block power
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
}

function getSuperAttackPower(fighter) {
  return fighter.attack * 2;
}

function createPlayers(firstFighter, secondFighter) {
  return {
    'playerOne': new Player(1, firstFighter),
    'playerTwo': new Player(2, secondFighter)
  };
}

function handleKeyDown(e, btnSet, {playerOne, playerTwo}) {
  if(btnSet.has(e.code)) return;
  btnSet.add(e.code);
  if(e.code === controls.PlayerOneBlock) {
    return toggleShield('left');
  }
  if(e.code === controls.PlayerTwoBlock) {
    return toggleShield('right');
  }
  fightAction(btnSet, {playerOne, playerTwo});
}

function handleKeyUp(e, btnSet, {playerOne, playerTwo}) {
  btnSet.delete(e.code);
  switch (e.code) {
    case controls.PlayerOneAttack:
      return playerOne.canAttack = true;
    case controls.PlayerTwoAttack:
      return playerTwo.canAttack = true;
    case controls.PlayerOneBlock:
      return toggleShield('left');
    case controls.PlayerTwoBlock:
      return toggleShield('right');
  }
}

function fightAction(btnSet, {playerOne, playerTwo}) {
  switch(true) {
    case doSuperAttack(btnSet, controls.PlayerOneCriticalHitCombination, controls.PlayerOneBlock, playerOne.canSuperAttack):
      return effectSuperAttack(playerOne, playerTwo);
    case doSuperAttack(btnSet, controls.PlayerTwoCriticalHitCombination, controls.PlayerTwoBlock, playerTwo.canSuperAttack):
      return effectSuperAttack(playerTwo, playerOne);
    case doAttack(btnSet, controls.PlayerOneAttack, controls.PlayerOneBlock, playerOne.canAttack):
      return effectAttack(playerOne, playerTwo, btnSet, controls.PlayerTwoBlock);
    case doAttack(btnSet, controls.PlayerTwoAttack, controls.PlayerTwoBlock, playerTwo.canAttack):
      return effectAttack(playerTwo, playerOne, btnSet, controls.PlayerOneBlock);
    default:
      return;
  }
}

function doAttack(btnSet, controlAttack, controlBlock, canAttack) {
  return (btnSet.has(controlAttack) && !btnSet.has(controlBlock) && canAttack);
}

function effectAttack(attacker, defender, btnSet, controlDefenderBlock) {
  const positionAttacker = (attacker.num === 1) ? 'left' : 'right';
  showAttack(positionAttacker, 'fist');
  attacker.canAttack = false;
  const damage = btnSet.has(controlDefenderBlock) ? getDamage(attacker, defender) : getHitPower(attacker);
  defender.decreaseHealth(damage);
  const positionDefender = (defender.num === 1) ? 'left' : 'right';
  changeHealthbarWidth(defender, positionDefender);
}

function doSuperAttack(btnSet, controlAttack, controlBlock, canSuperAttack) {
  return (checkSuperAttack(btnSet, controlAttack) && !btnSet.has(controlBlock) && canSuperAttack);
}

function checkSuperAttack(btnSet, control) {
  if(btnSet.size < control) {
    return false;
  }
  return controlValuesInSet(btnSet, control);
}

function controlValuesInSet(set, control) {
  const len = control.length;
  let result = true;
  for(let i = 0; i < len; i++) {
    if(!set.has(control[i])) {
      result = false;
      break;
    }
  }
  return result;
}

function delaySuperAttack(player, position) {
  player.canSuperAttack = false;
  toggleSuperIndicator(player.canSuperAttack, position);
  setTimeout(() => {
    player.canSuperAttack = true;
    toggleSuperIndicator(player.canSuperAttack, position);
  }, 10000);
}

function effectSuperAttack(attacker, defender) {
  const positionAttacker = (attacker.num === 1) ? 'left' : 'right';
  const positionDefender = (defender.num === 1) ? 'left' : 'right';
  showAttack(positionAttacker, 'fireball');
  defender.decreaseHealth(getSuperAttackPower(attacker));
  changeHealthbarWidth(defender, positionDefender);
  delaySuperAttack(attacker, positionAttacker);
}

function checkEndGame({playerOne, playerTwo}) {
  switch (true) {
    case (playerOne.health === 0):
      return 2;
    case (playerTwo.health === 0):
      return 1;
    default:
      return '';
  }
}
