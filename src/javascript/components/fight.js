import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let winner = null;
    const firstFighterStats = createFighterStats(firstFighter);
    const secondFighterStats = createFighterStats(secondFighter);
  });
}

export function getDamage(attacker, defender) {
  // return damage
}

export function getHitPower(fighter) {
  // return hit power
}

export function getBlockPower(fighter) {
  // return block power
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
