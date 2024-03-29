import { z as zod } from "zod";

export enum AdvantageEnum {
  advantage = "advantage",
  disadvantage = "disadvantage",
  normal = "normal",
}

export enum PlayerEnum {
  aaron = "aaron",
  connor = "connor",
  tegg = "tegg",
  thomas = "thomas",
}

export const zodPlayerEnum = zod.nativeEnum(PlayerEnum);

export enum RollTypeEnum {
  skill_Acrobatics = "skill_Acrobatics",
  skill_AnimalHandling = "skill_Animal Handling",
  skill_Arcana = "skill_Arcana",
  skill_Athletics = "skill_Athletics",
  skill_Deception = "skill_Deception",
  skill_History = "skill_History",
  skill_Insight = "skill_Insight",
  skill_Intimidation = "skill_Intimidation",
  skill_Investigation = "skill_Investigation",
  skill_Medicine = "skill_Medicine",
  skill_Nature = "skill_Nature",
  skill_Perception = "skill_Perception",
  skill_Performance = "skill_Performance",
  skill_Persuasion = "skill_Persuasion",
  skill_Religion = "skill_Religion",
  skill_SleightOfHand = "skill_Sleight of Hand",
  skill_Stealth = "skill_Stealth",
  skill_Survival = "skill_Survival",
  skill_Tool = "skill_Tool",
  savingThrow_Strength = "savingThrow_Strength",
  savingThrow_Dexterity = "savingThrow_Dexterity",
  savingThrow_Constitution = "savingThrow_Constitution",
  savingThrow_Intelligence = "savingThrow_Intelligence",
  savingThrow_Wisdom = "savingThrow_Wisdom",
  savingThrow_Charisma = "savingThrow_Charisma",
  savingThrow_Death = "savingThrow_Death",
  ability_Strength = "ability_Strength",
  ability_Dexterity = "ability_Dexterity",
  ability_Constitution = "ability_Constitution",
  ability_Intelligence = "ability_Intelligence",
  ability_Wisdom = "ability_Wisdom",
  ability_Charisma = "ability_Charisma",
  attack_Melee = "attack_melee",
  attack_Ranged = "attack_ranged",
  attack_Spell = "attack_spell",
  other_Damage = "other_damage",
  other_Initiative = "other_initiative",
  other_HaloOfSpores = "other_haloOfSpores",
  other_Custom = "other_custom",
  healing = "healing",
}
