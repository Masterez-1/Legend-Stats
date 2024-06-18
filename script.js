document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let riotId = document.getElementById('riot-id').value.trim();
    let region = document.getElementById('region').value;
    if (riotId) {
        let [name, tag] = riotId.split('#');
        if (name && tag) {
            getSummonerStats(name, tag, region);
        } else {
            alert("Por favor, ingresa el Riot ID en el formato nombre#etiqueta.");
        }
    } else {
        alert("Por favor, ingresa un Riot ID.");
    }
});

async function getSummonerStats(name, tag, region) {
    const apiKey = 'API';  // Reemplaza esto con tu API de riot
    const encodedName = encodeURIComponent(name);
    const encodedTag = encodeURIComponent(tag);

    try {
        let response = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodedName}?api_key=${apiKey}`);
        if (!response.ok) throw new Error('Error al obtener los datos del invocador');
        let summonerData = await response.json();

        let responseRanked = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${apiKey}`);
        if (!responseRanked.ok) throw new Error('Error al obtener los datos de clasificación');
        let rankedData = await responseRanked.json();

        displayStats(summonerData, rankedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('stats').innerHTML = `<p>Error al obtener los datos. Intenta nuevamente. Error: ${error.message}</p>`;
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
