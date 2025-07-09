export const MOBILE_WIDTH = 768;

export const MEMBER_AUTH = 1;
export const GOOD_STANDING_AUTH = 2;
export const ELITE_AUTH = 3;
export const MOD_AUTH = 4;
export const ADMIN_AUTH = 5;
export const SUPER_ADMIN_AUTH = 6;
export const SUPREME_AUTH = 7;

export const MIN_CHARACTER_LEVEL = 1;
export const MAX_CHARACTER_LEVEL = 12;

export const CREATURE_SIZE_OPTIONS = [
    "Small",
    "Medium",
    "Large",
    "Varies",
];

export const CREATURE_SPEED_OPTIONS = [
    "4",
    "5",
    "6",
    "Varies",
];

export const STATS_BY_LEVEL = {
    1: {
        skillPoints: 25,
    },
    2: {
        skillPoints: 30,
    },
    3: {
        skillPoints: 35,
    },
    4: {
        skillPoints: 40,
    },
    5: {
        skillPoints: 48,
    },
    6: {
        skillPoints: 56,
    },
    7: {
        skillPoints: 64,
    },
    8: {
        skillPoints: 72,
    },
    9: {
        skillPoints: 84,
    },
    10: {
        skillPoints: 96,
    },
    11: {
        skillPoints: 108,
    },
    12: {
        skillPoints: 120,
    },
};

export const BASE_SKILLS = [
    {
        skillName: "OFFENSE",
        category: "Combat",
        regular: true,
        rank: 0,
    },
    {
        skillName: "DEFENSE",
        category: "Combat",
        regular: true,
        rank: 0,
    },
    {
        skillName: "HEALTH",
        category: "Combat",
        regular: true,
        rank: 0,
    },
    {
        skillName: "GUNS",
        category: "Combat",
        rank: {
            P: false,
            R: false,
            S: false,
            5: false,
        },
        regular: false,
    },
    {
        skillName: "BLUFF",
        category: "Social",
        regular: true,
        rank: 0,
    },
    {
        skillName: "CHARM",
        category: "Social",
        regular: true,
        rank: 0,
    },
    {
        skillName: "INTIMIDATE",
        skill_category: "Social",
        category: "Social",
        regular: true,
        rank: 0,
    },
    {
        skillName: "NEGOTIATE",
        skill_category: "Social",
        category: "Social",
        regular: true,
        rank: 0,
    },
    {
        skillName: "ARCANA",
        skill_category: "Knowledge",
        category: "Knowledge",
        regular: true,
        rank: 0,
    },
    {
        skillName: "HISTORY",
        skill_category: "Knowledge",
        category: "Knowledge",
        regular: true,
        rank: 0,
    },
    {
        skillName: "STREETWISE",
        skill_category: "Knowledge",
        category: "Knowledge",
        regular: true,
        rank: 0,
    },
    {
        skillName: "TECHNOLOGY",
        skill_category: "Knowledge",
        category: "Knowledge",
        regular: true,
        rank: 0,
    },
    {
        skillName: "WILDERNESS",
        skill_category: "Knowledge",
        category: "Knowledge",
        regular: true,
        rank: 0,
    },
    {
        skillName: "ACROBATICS",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "BRAWN",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "FINESSE",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "MECHANICS",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "MEDICINE",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "PERCEPTION",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "PERFORM",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "RIDE",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "STEALTH",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
    {
        skillName: "VOLITION",
        skill_category: "Action",
        category: "Action",
        regular: true,
        rank: 0,
    },
];

export const REGULAR_SKILL_PRICES = {
    0: 0,
    1: 1,
    2: 3,
    3: 6,
    4: 9,
    5: 12,
};

export const ITEM_CATEGORIES = [
    "Armor",
    "Shield",
    "Weapon",
    "Gun",
    "Ammunition",
    "Consumable",
    "Gear Kit",
    "Adventuring Gear",
    "Mount",
    "Magic Item",
    "Tech Item",
];

export const ARMOR_TYPES = [
    "N/A",
    "Cloth",
    "Light",
    "Medium",
    "Heavy",
];

export const SHIELD_TYPES = [
    "Light",
    "Heavy",
];

export const WEAPON_TYPES = [
    "Unarmed",
    "Axe",
    "Bow",
    "Crossbow",
    "Dagger",
    "Hammer",
    "Spear",
    "Stave",
    "Sword",
    "Whip",
];

export const GUN_TYPES = [
    "Pistol",
    "Rifle",
    "Shotgun",
];

export const AMMUNITION_TYPES = [
    "Arrows",
    "Bolts",
    "Stones",
    "Rounds",
    "Cartridges",
    "Shells",
];

export const AMMUNITION_GRADES = [
    "Basic: Poor Quality",
    "Basic: Regular",
    "Basic: Masterwork",
    "Basic: Military",
    "Basic: Hunter",
    "Non-Basic",
];

export const CONSUMABLE_TYPES = [
    "Tech",
    "Potion",
    "Scroll",
    "Other",
];
