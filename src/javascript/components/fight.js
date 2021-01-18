import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let winner = null;
    const pressedBtnSet = new Set();
    const firstFighterStats = createFighterStats(firstFighter);
    const secondFighterStats = createFighterStats(secondFighter);
    document.addEventListener('keydown', (e) => {
      handleKeyDown(e, pressedBtnSet, [firstFighterStats, secondFighterStats]);
    });
    document.addEventListener('keyup', (e) => handleKeyUp(e, pressedBtnSet));
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

function createFighterStats({_id, health, defense, attack}) {
  return {
    _id,
    health,
    defense,
    attack,
    canDoSuperAttack: true
  }
}

function handleKeyDown(e, btnSet, fighters) {
  if(btnSet.has(e.code)) return;
  btnSet.add(e.code);
  console.log(btnSet);
  fightAction(btnSet, fighters);
}

function handleKeyUp(e, btnSet) {
  btnSet.delete(e.code);
  console.log(btnSet);
}

function fightAction() {
  console.log('action');
}
