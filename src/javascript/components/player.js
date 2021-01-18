function Player({health, defense, attack}) {
  this.health = health;
  this.defense = defense;
  this.attack = attack;
  this.canAttack = true;
  this.canSuperAttack = true;
}

Player.prototype.decreaseHealth = function(value) {
  this.health = ((this.health - value) > 0) ? (this.health - value) : 0;
};

export default Player;
