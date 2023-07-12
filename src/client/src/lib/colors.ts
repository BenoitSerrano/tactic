const colorLib = {
    computeTextColor,
};

function computeTextColor(status: 'right' | 'wrong' | 'acceptable' | undefined) {
    switch (status) {
        case 'right':
            return 'green';
        case 'acceptable':
            return 'orange';
        case 'wrong':
            return 'red';
        default:
            return 'black';
    }
}

export { colorLib };
