// File: spa-booking-system.js

// Initialize Booking System
(function () {
    const bookingContainerId = "#your-booking-id"; // Replace with your div id
    const bookingContainer = document.querySelector(bookingContainerId);
    if (!bookingContainer) {
        console.error("Booking container not found");
        return;
    }

    let currentStep = 1;
    let selectedDate = "";
    let selectedTime = [];
    let selectedPackage = "";

    // Render Navigation Buttons
    function renderNavigationButtons(step) {
        return `
            <div class="navigation-buttons">
                ${step > 1 ? '<button id="prev-step">Back</button>' : ""}
                ${step < 4 ? '<button id="next-step">Next</button>' : ""}
            </div>
        `;
    }

    // Render Step 1: Date Selection
    function renderDateSelection() {
        currentStep = 1;
        const dateHtml = `
            <div id="step-1">
                <h2>Select Date</h2>
                <input type="date" id="booking-date" value="${selectedDate}" required>
                ${renderNavigationButtons(currentStep)}
            </div>
        `;
        bookingContainer.innerHTML = dateHtml;
        document.querySelector("#booking-date").addEventListener("change", (e) => {
            selectedDate = e.target.value;
        });
        setupNavigation();
    }

    // Render Step 2: Time Selection
    function renderTimeSelection() {
        currentStep = 2;
        const timeSlots = [
            "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        ];
        const timeHtml = `
            <div id="step-2">
                <h2>Select Time (min 3h, max 48h)</h2>
                <div class="time-slots">
                    ${timeSlots
                        .map(
                            (time) => `<button class="time-slot ${selectedTime.includes(time) ? "selected" : ""}" data-time="${time}">${time} o'clock</button>`
                        )
                        .join("")}
                </div>
                ${renderNavigationButtons(currentStep)}
            </div>
        `;
        bookingContainer.innerHTML = timeHtml;
        document.querySelectorAll(".time-slot").forEach((slot) => {
            slot.addEventListener("click", handleTimeSelection);
        });
        setupNavigation();
    }

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
        currentStep = 3;
        const packageHtml = `
            <div id="step-3">
                <h2>Select Package</h2>
                <label>
                    <input type="radio" name="package" value="Basic" ${selectedPackage === "Basic" ? "checked" : ""}> Basic Package
                </label>
                <label>
                    <input type="radio" name="package" value="Premium" ${selectedPackage === "Premium" ? "checked" : ""}> Premium Package
                </label>
                <label>
                    <input type="radio" name="package" value="Luxury" ${selectedPackage === "Luxury" ? "checked" : ""}> Luxury Package
                </label>
                ${renderNavigationButtons(currentStep)}
            </div>
        `;
        bookingContainer.innerHTML = packageHtml;
        document.querySelectorAll("input[name='package']").forEach((radio) => {
            radio.addEventListener("change", (e) => {
                selectedPackage = e.target.value;
            });
        });
        setupNavigation();
    }

    // Render Step 4: Overview
    function renderOverview() {
        currentStep = 4;
        const overviewHtml = `
            <div id="step-4">
                <h2>Booking Overview</h2>
                <p>Date: ${selectedDate}</p>
                <p>Time: ${selectedTime.join(", ")}</p>
                <p>Package: ${selectedPackage}</p>
                <button id="confirm-booking">Confirm Booking</button>
                ${renderNavigationButtons(currentStep)}
            </div>
        `;
        bookingContainer.innerHTML = overviewHtml;
        document.querySelector("#confirm-booking").addEventListener("click", confirmBooking);
        setupNavigation();
    }

    // Confirm Booking
    function confirmBooking() {
        alert("Booking confirmed! Details have been sent to your email.");
        resetBooking();
    }

    function resetBooking() {
        selectedDate = "";
        selectedTime = [];
        selectedPackage = "";
        renderDateSelection();
    }

    // Setup Navigation
    function setupNavigation() {
        if (document.querySelector("#prev-step")) {
            document.querySelector("#prev-step").addEventListener("click", () => {
                if (currentStep === 2) renderDateSelection();
                else if (currentStep === 3) renderTimeSelection();
                else if (currentStep === 4) renderPackageSelection();
            });
        }
        if (document.querySelector("#next-step")) {
            document.querySelector("#next-step").addEventListener("click", () => {
                if (currentStep === 1) renderTimeSelection();
                else if (currentStep === 2) renderPackageSelection();
                else if (currentStep === 3) renderOverview();
            });
        }
    }

    // Start the booking system
    renderDateSelection();
})();
