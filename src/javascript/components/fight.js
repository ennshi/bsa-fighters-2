import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let winner = null;
    const pressedBtnSet = new Set();
    const players = createPlayers(firstFighter, secondFighter);
    document.addEventListener('keydown', (e) => {
      handleKeyDown(e, pressedBtnSet, players);
    });
    document.addEventListener('keyup', (e) => handleKeyUp(e, pressedBtnSet, players));
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

function getSuperShotPower(fighter) {
  return fighter.attack * 2;
}

function createPlayers(firstFighter, secondFighter) {
  return {
    'playerOne': createPlayer(firstFighter),
    'playerTwo': createPlayer(secondFighter)
  };
}

function createPlayer({health, defense, attack}) {
  return {
    health,
    defense,
    attack,
    canSuperAttack: true,
    canAttack: true
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
  const fighterOneAttack = (btnSet.has(controls.PlayerOneAttack) && !btnSet.has(controls.PlayerOneBlock) && playerOne.canAttack);
  const fighterTwoAttack = (btnSet.has(controls.PlayerTwoAttack) && !btnSet.has(controls.PlayerTwoBlock) && playerTwo.canAttack);
  switch(true) {
    case fighterOneAttack:
      playerOne.canAttack = false;
      if(btnSet.has(controls.PlayerTwoBlock)) {
        return console.log('1 attack 2 block')
      }
      return console.log('1 attack');
    case fighterTwoAttack:
      playerTwo.canAttack = false;
      if(btnSet.has(controls.PlayerOneBlock)) {
        return console.log('2 attack 1 block')
      }
      return console.log('2 attack');
    default:
      return;
  }
}
