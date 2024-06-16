document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let summonerName = document.getElementById('summoner-name').value.trim();
    let region = document.getElementById('region').value;
    if (summonerName) {
        getSummonerStats(summonerName, region);
    } else {
        alert("Por favor, ingresa un nombre de invocador.");
    }
});

async function getSummonerStats(summonerName, region) {
    const apiKey = 'RGAPI-f726eb60-4e7b-4b5c-9c13-1b6212564921';  // Reemplaza esto con tu clave API
    const encodedSummonerName = encodeURIComponent(summonerName);

    try {
        let response = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodedSummonerName}?api_key=${apiKey}`);
        if (!response.ok) throw new Error('Error al obtener los datos del invocador');
        let summonerData = await response.json();

        let responseRanked = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${apiKey}`);
        if (!responseRanked.ok) throw new Error('Error al obtener los datos de clasificación');
        let rankedData = await responseRanked.json();

        displayStats(summonerData, rankedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('stats').innerHTML = `<p>Error al obtener los datos. Intenta nuevamente.</p>`;
    }
}

function displayStats(summonerData, rankedData) {
    let statsDiv = document.getElementById('stats');
    let rankedInfo = rankedData.length ? rankedData[0] : { tier: 'Unranked', rank: '', leaguePoints: 0 };

    statsDiv.innerHTML = `
        <h2>${summonerData.name}</h2>
        <p>Nivel: ${summonerData.summonerLevel}</p>
        <p>Rango: ${rankedInfo.tier} ${rankedInfo.rank} (${rankedInfo.leaguePoints} LP)</p>
    `;
}
