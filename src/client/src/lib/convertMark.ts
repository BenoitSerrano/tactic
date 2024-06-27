import { computeRoundMark } from './computeRoundMark';

const CONVERSION_DENOMINATOR = 20;

function convertMark({ totalMark, totalPoints }: { totalMark: number; totalPoints: number }) {
    const roundedTotalMark = computeRoundMark(totalMark);
    const roundedTotalPoints = computeRoundMark(totalPoints);

    const roundedConvertedMark = computeRoundMark(
        (totalMark / totalPoints) * CONVERSION_DENOMINATOR,
    );

    return { roundedTotalMark, roundedTotalPoints, roundedConvertedMark };
}

export { convertMark, CONVERSION_DENOMINATOR };
