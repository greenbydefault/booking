// Dummy-Daten laden
function getUnavailableDates() {
    return fetch('unavailable.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Fehler beim Laden der Daten:', error);
            return [];
        });
}
