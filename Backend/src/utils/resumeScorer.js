function scoreResume(skillsDetected, requiredSkills) {
    const totalRequired = requiredSkills.length;
    const matchedSkills = skillsDetected.filter(skill => requiredSkills.includes(skill));

    const scorePercent = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 0;

    return {
        scorePercent,
        matchedSkills,
        missingSkills: requiredSkills.filter(skill => !matchedSkills.includes(skill))
    };
}

module.exports = { scoreResume };