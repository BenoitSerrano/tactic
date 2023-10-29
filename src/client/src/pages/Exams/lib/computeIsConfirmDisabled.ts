function computeIsConfirmDisabled({ name, duration }: { name: string; duration: string }) {
    if (!name || !duration || isNaN(Number(duration)) || Number(duration) === 0) {
        return true;
    }
    return false;
}

export { computeIsConfirmDisabled };
