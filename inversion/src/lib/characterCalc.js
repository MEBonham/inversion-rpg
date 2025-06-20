import { BASE_SKILLS, REGULAR_SKILL_PRICES, STATS_BY_LEVEL } from "./constants";

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

export const calcSkillPoints = (character) => {
    let totalSkillPoints = 0;

    totalSkillPoints += 3 * Math.max(0, character.character_backgrounds.length - 1);

    totalSkillPoints += 5 * Math.max(0, character.character_ancestries.length - 1);

    const nativeLanguages = character.character_ancestries.map(
        (ancestryObj) => ancestryObj.ancestries.native_language
    );
    const numDupedLanguages = nativeLanguages.filter((val, index, self) => self.indexOf(val) !== index).length;
    let coveredLanguages = 2 * character.character_ancestries.length + 1 - numDupedLanguages;
    totalSkillPoints += 2 * Math.max(0, character.character_languages.length - coveredLanguages);

    const skills = character.character_skills ?? BASE_SKILLS;
    for (const skill of skills.filter((skill) => skill.regular)) {
        totalSkillPoints += REGULAR_SKILL_PRICES[skill.rank];
    }
    const guns = skills.filter((skill) => skill.skillName === "GUNS");
    totalSkillPoints += 3 * (Object.keys(guns[0].rank).filter((key) => guns[0].rank[key]).length);

    return totalSkillPoints;
}
