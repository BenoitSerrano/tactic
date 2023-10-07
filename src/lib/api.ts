const api = {
    fetchAnonymizedData,
};

async function fetchAnonymizedData() {
    const URL = `https://test-de-langue.osc-fr1.scalingo.io/api/anonymized-data`;
    // const URL = `http://localhost:3001/api/anonymized-data`;

    const anonymizedData = await fetch(URL);
    const parsedData = await anonymizedData.json();
    return parsedData;
}

export { api };
