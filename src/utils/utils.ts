function completeKeys(keyFields: string[], data: object) {
    for (const field of keyFields) {
        if (!(field in data)) {
            return false;
        }
    }
    return true;
}

export { completeKeys }