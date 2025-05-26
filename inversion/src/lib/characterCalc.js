import { STATS_BY_LEVEL } from "./constants";

export const calcSkillPoints = (character) => {
    let total = 0;

    total += 3 * Math.max(0, character.character_backgrounds.length - 1);

    total += 5 * Math.max(0, character.character_ancestries.length - 1);

    total += 2 * Math.max(0, character.character_languages.length - 3);

    return total;
}

export const calcMaxSkillPoints = (character) => {
    let total = STATS_BY_LEVEL[character.character_level].skillPoints;
    if (character.character_backgrounds.find(
        (backgroundObj) => backgroundObj.backgrounds.background_name.toLowerCase() === "perfectionist")
    ) {
        total += 3;
    }
    if (character.character_ancestries.find(
        (ancestryObj) => ancestryObj.ancestries.ancestry_name.toLowerCase() === "human")
    ) {
        total += 3;
    }
    if (character.is_inheritor_of_best_wishes) {
        total += 12;
    }
    return total;
}
