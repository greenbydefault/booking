// File: spa-booking-system.js

// Initialize Booking System
(function () {
    const bookingContainerId = "#your-booking-id"; // Replace with your div id
    const bookingContainer = document.querySelector(bookingContainerId);
    if (!bookingContainer) {
        console.error("Booking container not found");
        return;
    }

    // Render Step 1: Date Selection
    function renderDateSelection() {
        const dateHtml = `
            <div id="step-1">
                <h2>Select Date</h2>
                <input type="date" id="booking-date" required>
                <button id="next-to-time">Next</button>
            </div>
        `;
        bookingContainer.innerHTML = dateHtml;
        document.querySelector("#next-to-time").addEventListener("click", handleDateSelection);
    }

    function handleDateSelection() {
        const dateInput = document.querySelector("#booking-date").value;
        if (!dateInput) {
            alert("Please select a date.");
            return;
        }
        renderTimeSelection();
    }

    // Render Step 2: Time Selection
    function renderTimeSelection() {
        const timeSlots = [
            "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        ];
        const timeHtml = `
            <div id="step-2">
                <h2>Select Time (min 3h, max 48h)</h2>
                <div class="time-slots">
                    ${timeSlots
                        .map(
                            (time) => `<button class="time-slot" data-time="${time}">${time} o'clock</button>`
                        )
                        .join("")}
                </div>
                <button id="next-to-packages">Next</button>
            </div>
        `;
        bookingContainer.innerHTML = timeHtml;
        document.querySelectorAll(".time-slot").forEach((slot) => {
            slot.addEventListener("click", handleTimeSelection);
        });
        document.querySelector("#next-to-packages").addEventListener("click", renderPackageSelection);
    }

    let selectedTime = [];

    function handleTimeSelection(e) {
        const time = e.target.getAttribute("data-time");
        if (selectedTime.includes(time)) {
            selectedTime = selectedTime.filter((t) => t !== time);
            e.target.classList.remove("selected");
        } else {
            selectedTime.push(time);
            e.target.classList.add("selected");
        }
    }

    // Render Step 3: Package Selection
    function renderPackageSelection() {
        const packageHtml = `
            <div id="step-3">
                <h2>Select Package</h2>
                <label>
                    <input type="radio" name="package" value="Basic" required> Basic Package
                </label>
                <label>
                    <input type="radio" name="package" value="Premium"> Premium Package
                </label>
                <label>
                    <input type="radio" name="package" value="Luxury"> Luxury Package
                </label>
                <button id="next-to-overview">Next</button>
            </div>
        `;
        bookingContainer.innerHTML = packageHtml;
        document.querySelector("#next-to-overview").addEventListener("click", renderOverview);
    }

    let selectedPackage = "";

    function renderOverview() {
        const selectedPackage = document.querySelector("input[name='package']:checked").value;
        if (!selectedPackage) {
            alert("Please select a package.");
            return;
        }
        const overviewHtml = `
            <div id="step-4">
                <h2>Booking Overview</h2>
                <p>Date: ${document.querySelector("#booking-date").value}</p>
                <p>Time: ${selectedTime.join(", ")}</p>
                <p>Package: ${selectedPackage}</p>
                <button id="confirm-booking">Confirm Booking</button>
            </div>
        `;
        bookingContainer.innerHTML = overviewHtml;
        document.querySelector("#confirm-booking").addEventListener("click", confirmBooking);
    }

    function confirmBooking() {
        alert("Booking confirmed! Details have been sent to your email.");
        renderDateSelection();
    }

    // Start the booking system
    renderDateSelection();
})();
