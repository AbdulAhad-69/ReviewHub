// Calculates the lower bound of the Wilson Score Interval
export const calculateWilsonScore = (upvotes, totalVotes) => {
    if (totalVotes === 0) return 0;
    
    const z = 1.96; // 95% statistical confidence
    const phat = upvotes / totalVotes;
    
    const numerator = phat + (z * z) / (2 * totalVotes) - z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * totalVotes)) / totalVotes);
    const denominator = 1 + (z * z) / totalVotes;
    
    return numerator / denominator;
};