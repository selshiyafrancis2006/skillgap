const SKILL_KEYWORDS = [
    'JavaScript', 'Python', 'Java', 'C', 'C++', 
    'Node.js', 'Express.js', 'React', 'React Native', 
    'MongoDB', 'PostgreSQL', 'AWS', 'Netlify', 'Vercel',
    'Tailwind CSS', 'Docker', 'Redis', 'CI/CD', 'System Design'
];

// Escape regex special characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSkills(text) {
    const skillsFound = SKILL_KEYWORDS.filter(skill => {
        const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i'); // escape special characters
        return regex.test(text);
    });

    return skillsFound;
}

module.exports = { extractSkills };