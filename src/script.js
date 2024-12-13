const apiBaseUrl = 'https://your-backend-url.com';

document.querySelector('#bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedStart = document.querySelector('#startTime').value;
    const selectedEnd = document.querySelector('#endTime').value;
    const selectedExtras = [...document.querySelectorAll('input[name="extras"]:checked')].map(el => el.value);

    const response = await fetch(`${apiBaseUrl}/api/bookSlot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: selectedStart, end: selectedEnd, extras: selectedExtras }),
    });

    if (response.ok) {
        alert('Booking confirmed!');
        location.reload();
    } else {
        alert('Error during booking.');
    }
});
