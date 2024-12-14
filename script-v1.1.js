// Buchungssystem: Spa-Zimmer
// Mindestdauer 3 Stunden, max. Dauer 48 Stunden
// Integration mit Google Calendar und Webflow in einem definierten Div

// Konfiguration
const MIN_BOOKING_DURATION = 3; // in Stunden
const MAX_BOOKING_DURATION = 48; // in Stunden
const COST_PER_HOUR = 30; // Kosten pro Stunde in Euro
const CALENDAR_DIV_ID = 'spa-calendar'; // ID des Divs, in dem der Kalender gerendert wird

// Sicherer Umgang mit API-Keys
const API_URL = '/secure-api'; // Server-seitiger Endpunkt für API-Requests

// Funktionen
function isValidBooking(startTime, endTime) {
    const duration = (endTime - startTime) / (1000 * 60 * 60); // Dauer in Stunden
    return duration >= MIN_BOOKING_DURATION && duration <= MAX_BOOKING_DURATION;
}

function calculateCost(startTime, endTime) {
    const duration = (endTime - startTime) / (1000 * 60 * 60); // Dauer in Stunden
    return duration * COST_PER_HOUR;
}

function getUnavailableDates() {
    // Holt die belegten Termine sicher vom Server
    return fetch(`${API_URL}/get-unavailable-dates`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

function createBooking(startTime, endTime) {
    if (!isValidBooking(startTime, endTime)) {
        alert('Buchung ungültig. Bitte wählen Sie eine Dauer zwischen 3 und 48 Stunden.');
        return;
    }

    const cost = calculateCost(startTime, endTime);
    if (!confirm(`Die Kosten für Ihre Buchung betragen ${cost}€. Möchten Sie fortfahren?`)) {
        return;
    }

    // Buchung sicher an den Server senden
    fetch(`${API_URL}/create-booking`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startTime, endTime })
    })
    .then(response => {
        if (response.ok) {
            alert('Buchung erfolgreich!');
            // Aktualisiere die verfügbaren Slots
            renderCalendar();
        } else {
            alert('Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        }
    });
}

function renderCalendar() {
    const calendarDiv = document.getElementById(CALENDAR_DIV_ID);
    if (!calendarDiv) {
        console.error(`Div mit der ID "${CALENDAR_DIV_ID}" nicht gefunden.`);
        return;
    }

    calendarDiv.innerHTML = ''; // Kalender leeren

    getUnavailableDates().then(unavailableDates => {
        const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
        const now = new Date();

        for (let i = 0; i < 7; i++) { // Kalender für 7 Tage anzeigen
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            const dayTitle = document.createElement('h3');
            dayTitle.textContent = `${days[currentDate.getDay()]} ${currentDate.toLocaleDateString()}`;
            dayDiv.appendChild(dayTitle);

            for (let hour = 8; hour <= 17; hour++) { // Stunden von 8 bis 17 Uhr anzeigen
                const slotTime = new Date(currentDate.setHours(hour, 0, 0, 0));
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot';
                slotDiv.textContent = `${hour}:00 Uhr`;

                if (unavailableDates.includes(slotTime.toISOString())) {
                    slotDiv.classList.add('unavailable');
                } else {
                    slotDiv.addEventListener('click', () => {
                        const endTime = new Date(slotTime);
                        endTime.setHours(endTime.getHours() + 1);
                        createBooking(slotTime, endTime);
                    });
                }

                dayDiv.appendChild(slotDiv);
            }

            calendarDiv.appendChild(dayDiv);
        }
    });
}

// Initialisierung
window.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});
