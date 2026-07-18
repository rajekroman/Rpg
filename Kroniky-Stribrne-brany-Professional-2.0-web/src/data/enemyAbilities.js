export const ENEMY_ABILITIES = Object.freeze({
  packHowl: Object.freeze({
    id: "packHowl", name: "Smečkový řev", cooldown: 11, range: 6, kind: "groupBuff",
    duration: 6, attackMultiplier: 1.28, speedMultiplier: 1.2,
  }),
  venomSpit: Object.freeze({
    id: "venomSpit", name: "Jedový chrchel", cooldown: 8, range: 5.6, kind: "projectile",
    projectileKind: "enemyVenom", projectileSpeed: 4.2, damageType: "poison", damage: [7, 11],
    partyStatus: { statusId: "poisoned", duration: 7, potency: 3 },
  }),
  suppressingShot: Object.freeze({
    id: "suppressingShot", name: "Potlačovací střela", cooldown: 7.5, range: 7.5, kind: "projectile",
    projectileKind: "enemyArrow", projectileSpeed: 5.2, damageType: "physical", damage: [9, 15],
    partyStatus: { statusId: "exposed", duration: 6, potency: 1 },
  }),
  bulwarkPulse: Object.freeze({
    id: "bulwarkPulse", name: "Ochranný puls", cooldown: 12, range: 4.2, kind: "groupShield",
    duration: 7, damageTakenMultiplier: 0.72,
  }),
  echoLance: Object.freeze({
    id: "echoLance", name: "Kopí ozvěny", cooldown: 5.5, range: 8.2, kind: "projectile", requirePhase: 1,
    projectileKind: "enemyEcho", projectileSpeed: 4.8, damageType: "spirit", damage: [17, 25],
    partyStatus: { statusId: "silenced", duration: 4.5, potency: 1 },
  }),
  fractureWave: Object.freeze({
    id: "fractureWave", name: "Vlna zlomu", cooldown: 10, range: 5.2, kind: "partyArea", requirePhase: 2,
    damageType: "spirit", damage: [12, 19], partyStatus: { statusId: "exposed", duration: 7, potency: 1 },
  }),
  summonEchoes: Object.freeze({
    id: "summonEchoes", name: "Povolání ozvěn", cooldown: 18, kind: "summon", requirePhase: 2, count: 2, enemyId: "echoShade",
  }),
  annihilatingPulse: Object.freeze({
    id: "annihilatingPulse", name: "Ničivý puls", cooldown: 8, range: 6.5, kind: "partyArea", requirePhase: 3,
    damageType: "shock", damage: [16, 24], partyStatus: { statusId: "shaken", duration: 5, potency: 1 },
  }),
});

export function getEnemyAbility(abilityId) {
  return ENEMY_ABILITIES[abilityId] || null;
}
