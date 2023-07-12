const combinator = {
    generate,
    reverse,
    generateIdentity,
};

function generate(count: number) {
    const combination: number[] = [];
    const identity = generateIdentity(count);
    for (let i = count - 1; i >= 0; i--) {
        const index = getRandomInteger(0, i);
        combination.push(identity[index]);
        identity.splice(index, 1);
    }
    return combination;
}

// 2, 10 => entre 2 et 10 inclus
function getRandomInteger(inf: number, sup: number) {
    return Math.floor(Math.random() * (sup - inf + 1)) + inf;
}

function reverse(combination: number[]) {
    const reversedCombination = ' '
        .repeat(combination.length)
        .split('')
        .map((_) => -1);

    combination.forEach((value, index) => {
        reversedCombination[value] = index;
    });
    return reversedCombination;
}

function generateIdentity(count: number) {
    return ' '
        .repeat(count)
        .split('')
        .map((_, index) => index);
}

export { combinator };
