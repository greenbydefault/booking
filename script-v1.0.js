// Buchungssystem: Spa-Zimmer
// Mindestdauer 3 Stunden, max. Dauer 48 Stunden
// Integration mit Google Calendar und Webflow via Data-Attributes

// Konfiguration
const MIN_BOOKING_DURATION = 3; // in Stunden
const MAX_BOOKING_DURATION = 48; // in Stunden
const COST_PER_HOUR = 30; // Kosten pro Stunde in Euro

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
    // Ruft Daten von Google Calendar ab (Platzhalter-Funktion)
    return fetch('/api/get-unavailable-dates') // API-Endpunkt anpassen
        .then(response => response.json());
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

    // Buchung an den Server senden
    fetch('/api/create-booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startTime, endTime })
    })
    .then(response => {
        if (response.ok) {
            alert('Buchung erfolgreich!');
            // Aktualisiere die verfügbaren Slots in Webflow
            updateAvailableSlots();
        } else {
            alert('Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        }
    });
}

function updateAvailableSlots() {
    getUnavailableDates().then(unavailableDates => {
        // Aktualisiere die Verfügbarkeit basierend auf Data-Attributes in Webflow
        const slotElements = document.querySelectorAll('[data-slot]');
        slotElements.forEach(slot => {
            const slotTime = new Date(slot.dataset.slot);
            if (unavailableDates.includes(slotTime.toISOString())) {
                slot.classList.add('unavailable');
            } else {
                slot.classList.remove('unavailable');
            }
        });
    });
}

// Event Listener für Buchungs-Buttons
document.querySelectorAll('[data-booking-button]').forEach(button => {
    button.addEventListener('click', () => {
        const startTime = new Date(button.dataset.start);
        const endTime = new Date(button.dataset.end);
        createBooking(startTime, endTime);
    });
});

// Initialisierung
updateAvailableSlots();

// Live-Kostenanzeige
document.querySelectorAll('[data-slot]').forEach(slot => {
    slot.addEventListener('click', () => {
        const startTime = new Date(slot.dataset.start);
        const endTime = new Date(slot.dataset.end);
        if (isValidBooking(startTime, endTime)) {
            const cost = calculateCost(startTime, endTime);
            document.getElementById('booking-cost').textContent = `Kosten: ${cost}€`;
        } else {
            document.getElementById('booking-cost').textContent = 'Ungültige Buchung';
        }
    });
});
