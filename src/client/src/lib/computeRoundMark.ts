function computeRoundMark(mark: number): string {
    const decimalPart = computeDecimalPart(mark);
    const integerPart = computeIntegerPart(mark);
    if (decimalPart === 0) {
        return `${mark}`;
    }
    if (decimalPart >= 0.875) {
        return `${integerPart + 1}`;
    }
    if (decimalPart >= 0.625) {
        return `${integerPart}.75`;
    }
    if (decimalPart >= 0.375) {
        return `${integerPart}.5`;
    }
    if (decimalPart >= 0.125) {
        return `${integerPart}.25`;
    }
    return `${integerPart}`;
}

function computeIntegerPart(value: number) {
    return Math.floor(value);
}

function computeDecimalPart(value: number) {
    return value - Math.floor(value);
}

export { computeRoundMark };
