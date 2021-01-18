import { controls } from '../../constants/controls';
import Player from './player';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let winnerId = '';
    const pressedBtnSet = new Set();
    const players = createPlayers(firstFighter, secondFighter);
    const onKeyDown = (e) => {
        handleKeyDown(e, pressedBtnSet, players);
        winnerId = checkEndGame(players);
        if(winnerId) {
          (winnerId === firstFighter._id) && resolve(firstFighter);
          (winnerId === secondFighter._id) && resolve(secondFighter);
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
    'playerOne': new Player(firstFighter),
    'playerTwo': new Player(secondFighter)
  };
}

function handleKeyDown(e, btnSet, {playerOne, playerTwo}) {
  if(btnSet.has(e.code)) return;
  btnSet.add(e.code);
  console.log(btnSet);
  fightAction(btnSet, {playerOne, playerTwo});
}

function handleKeyUp(e, btnSet, {playerOne, playerTwo}) {
  btnSet.delete(e.code);
  switch (e.code) {
    case controls.PlayerOneAttack:
      return playerOne.canAttack = true;
    case controls.PlayerTwoAttack:
      return playerTwo.canAttack = true;
  }
  console.log(btnSet);
}

function fightAction(btnSet, {playerOne, playerTwo}) {
  switch(true) {
    case doSuperAttack(btnSet, controls.PlayerOneCriticalHitCombination, controls.PlayerOneBlock, playerOne.canSuperAttack):
      playerTwo.decreaseHealth(getSuperAttackPower(playerOne));
      return delaySuperAttack(playerOne);
    case doSuperAttack(btnSet, controls.PlayerTwoCriticalHitCombination, controls.PlayerTwoBlock, playerTwo.canSuperAttack):
      playerOne.decreaseHealth(getSuperAttackPower(playerTwo));
      return delaySuperAttack(playerTwo);
    case doAttack(btnSet, controls.PlayerOneAttack, controls.PlayerOneBlock, playerOne.canAttack):
      playerOne.canAttack = false;
      if(btnSet.has(controls.PlayerTwoBlock)) {
        playerTwo.decreaseHealth(getDamage(playerOne, playerTwo));
        return console.log('1 attack 2 block')
      }
      return playerTwo.decreaseHealth(getHitPower(playerOne));
    case doAttack(btnSet, controls.PlayerTwoAttack, controls.PlayerTwoBlock, playerTwo.canAttack):
      playerTwo.canAttack = false;
      if(btnSet.has(controls.PlayerOneBlock)) {
        playerOne.decreaseHealth(getDamage(playerTwo, playerOne));
        return console.log('2 attack 1 block')
      }
      return playerOne.decreaseHealth(getHitPower(playerTwo));
    default:
      return;
  }
}

function doAttack(btnSet, controlAttack, controlBlock, canAttack) {
  return (btnSet.has(controlAttack) && !btnSet.has(controlBlock) && canAttack);
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

function delaySuperAttack(player) {
  player.canSuperAttack = false;
  setTimeout(() => {
    player.canSuperAttack = true;
  }, 10000);
}

function checkEndGame({playerOne, playerTwo}) {
  switch (true) {
    case (playerOne.health === 0):
      return playerTwo._id;
    case (playerTwo.health === 0):
      return playerOne._id;
    default:
      return '';
  }
}
