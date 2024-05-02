type denominatorType = '20' | 'original';

const denominatorHandler = {
    convertMark,
};

function convertMark(originalMark: number, total: number, denominator: denominatorType) {
    switch (denominator) {
        case '20':
            return (originalMark / total) * 20;
        case 'original':
            return originalMark;
    }
}

export { denominatorHandler };
export type { denominatorType };
