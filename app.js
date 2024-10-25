// Funzione per caricare le squadre dal localStorage
function loadTeams() {
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    const teamsList = document.getElementById('teamsList').querySelector('tbody');
    teamsList.innerHTML = ''; // Pulisce la lista esistente

    teams.forEach((team, index) => {
        const row = document.createElement('tr');

        // Calcola se la squadra può giocare
        const canPlay = (team.players - team.notPlaying) >= 6;
        const playStatus = canPlay 
            ? '<span class="can-play">✅</span>' // Spunta verde per squadra che può giocare
            : '<span class="cannot-play">❌</span>'; // Crocetta rossa per squadra che non può giocare

        // Calcolo del punteggio finale
        const finalPoints = team.points !== null ? team.points - team.penaltyTotal : 'N/A';

        row.innerHTML = `
            <td>${team.teamName}</td>
            <td>${team.players}</td>
            <td>${team.notPlaying}</td>
            <td>${team.penaltyTotal}</td>
            <td>${playStatus}</td>
            <td>${team.points !== null ? team.points : 'N/A'}</td>
            <td>${canPlay ? finalPoints : 'N/A'}</td>
            <td>${canPlay && team.points === null ? `<button class="enterPointsBtn" data-index="${index}">Inserisci Punti</button>` : 'N/A'}</td>
            <td><button class="deleteBtn" data-index="${index}">Elimina</button></td>
        `;
        teamsList.appendChild(row);
    });
}

// Funzione per aggiungere una squadra
document.getElementById('teamForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impedisce il comportamento predefinito del modulo
    
    const teamName = document.getElementById('teamName').value.trim();
    let players = parseInt(document.getElementById('players').value);
    let notPlaying = parseInt(document.getElementById('notPlaying').value);
    let penaltyPerPlayer = parseInt(document.getElementById('penaltyPerPlayer').value);

    if (players < 6) {
        alert('Il numero totale di giocatori deve essere almeno 6.');
        return;
    }
    if (players < 0 || notPlaying < 0 || penaltyPerPlayer < 0) {
        alert('I valori non possono essere negativi!');
        return;
    }

    const penaltyTotal = notPlaying * penaltyPerPlayer;

    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    const teamExists = teams.some(team => team.teamName.toLowerCase() === teamName.toLowerCase());
    
    if (teamExists) {
        alert('Esiste già una squadra con questo nome. Inserisci un nome diverso.');
        return;
    }

    teams.push({
        teamName,
        players,
        notPlaying,
        penaltyPerPlayer,
        penaltyTotal,
        points: null
    });
    localStorage.setItem('teams', JSON.stringify(teams));

    this.reset();
    loadTeams();
});

// Funzione per inserire i punti di una squadra
document.getElementById('teamsList').addEventListener('click', function(e) {
    if (e.target.classList.contains('enterPointsBtn')) {
        const index = e.target.dataset.index;
        const teams = JSON.parse(localStorage.getItem('teams')) || [];
        const team = teams[index];

        if (team.points !== null) {
            alert('I punti sono già stati inseriti per questa squadra.');
            return;
        }

        let points = prompt(`Inserisci i punti per la squadra ${team.teamName}:`);

        points = parseInt(points);

        if (isNaN(points) || points < 0) {
            alert('I punti non possono essere negativi o vuoti!');
            return;
        }

        team.points = points;
        localStorage.setItem('teams', JSON.stringify(teams));

        loadTeams();
    }
});

// Funzione per eliminare una squadra
document.getElementById('teamsList').addEventListener('click', function(e) {
    if (e.target.classList.contains('deleteBtn')) {
        const index = e.target.dataset.index;
        const teams = JSON.parse(localStorage.getItem('teams')) || [];
        teams.splice(index, 1);
        localStorage.setItem('teams', JSON.stringify(teams));
        loadTeams();
    }
});

// Funzione per calcolare il vincitore
document.getElementById('calculateWinner').addEventListener('click', function() {
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    const eligibleTeams = teams.filter(team => (team.players - team.notPlaying) >= 6 && team.points !== null);
    
    if (eligibleTeams.length < 2) {
        alert("È necessario avere almeno due squadre idonee per calcolare il vincitore.");
        return;
    }

    let winner = eligibleTeams.reduce((prev, current) => {
        const prevScore = prev.points - prev.penaltyTotal;
        const currentScore = current.points - current.penaltyTotal;
        return (currentScore > prevScore) ? current : prev;
    });

    document.getElementById('winnerMessage').innerText = `La squadra vincitrice è ${winner.teamName} con un punteggio finale di ${winner.points - winner.penaltyTotal}.`;
});

// Funzione per resettare il calcolo del vincitore
document.getElementById('resetWinner').addEventListener('click', function() {
    document.getElementById('winnerMessage').innerText = ''; // Resetta il messaggio del vincitore
});

// Funzione per cancellare tutte le squadre
document.getElementById('clearAll').addEventListener('click', function() {
    localStorage.removeItem('teams'); // Rimuove tutte le squadre dal localStorage
    loadTeams(); // Ricarica la tabella delle squadre
    document.getElementById('winnerMessage').innerText = ''; // Resetta anche il messaggio del vincitore
});

// Carica le squadre al caricamento della pagina
loadTeams();
