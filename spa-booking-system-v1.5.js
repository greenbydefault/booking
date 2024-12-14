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
    const packagePrices = { Basic: 100, Premium: 200, Luxury: 300 };
    const hourlyRate = 30;

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
                <h2 class="booking-header">Select Date</h2>
                <input type="date" id="booking-date" value="${selectedDate}" required class="booking-input">
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
                <h2 class="booking-header">Select Time (min 3h, max 48h)</h2>
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
                <h2 class="booking-header">Select Package</h2>
                <div class="package-options">
                    <label class="package-label">
                        <input type="radio" name="package" value="Basic" ${selectedPackage === "Basic" ? "checked" : ""} class="package-input"> Basic Package (€100)
                    </label>
                    <label class="package-label">
                        <input type="radio" name="package" value="Premium" ${selectedPackage === "Premium" ? "checked" : ""} class="package-input"> Premium Package (€200)
                    </label>
                    <label class="package-label">
                        <input type="radio" name="package" value="Luxury" ${selectedPackage === "Luxury" ? "checked" : ""} class="package-input"> Luxury Package (€300)
                    </label>
                </div>
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
        const hours = selectedTime.length;
        const totalTimePrice = hours * hourlyRate;
        const packagePrice = packagePrices[selectedPackage] || 0;
        const totalPrice = totalTimePrice + packagePrice;

        const overviewHtml = `
            <div id="step-4">
                <h2 class="booking-header">Booking Overview</h2>
                <div class="booking-summary">
                    <p class="summary-item"><strong>Date:</strong> ${selectedDate}</p>
                    <p class="summary-item"><strong>Time:</strong> ${selectedTime.join(", ")}</p>
                    <p class="summary-item"><strong>Package:</strong> ${selectedPackage} (€${packagePrice})</p>
                    <p class="summary-item"><strong>Total Hours:</strong> ${hours} (€${totalTimePrice})</p>
                    <p class="summary-item"><strong>Total Price:</strong> €${totalPrice}</p>
                </div>
                <button id="confirm-booking" class="confirm-button">Confirm Booking</button>
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

    // Apply minimalistic styling
    const style = document.createElement("style");
    style.innerHTML = `
        .booking-header {
            font-family: Arial, sans-serif;
            font-size: 1.5rem;
            color: #333;
            text-align: center;
            margin-bottom: 1rem;
        }
        .booking-input {
            display: block;
            margin: 0 auto 1rem;
            padding: 0.5rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 80%;
            max-width: 300px;
        }
        .time-slots {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 0.5rem;
            justify-content: center;
        }
        .time-slot {
            padding: 0.5rem;
            background-color: #28a745;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            font-size: 0.9rem;
        }
        .time-slot.selected {
            background-color: #ffc107;
            color: #000;
        }
        .package-options {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        .package-label {
            font-size: 1rem;
            color: #333;
        }
        .confirm-button {
            display: block;
            margin: 1rem auto;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .summary-item {
            font-size: 1rem;
            color: #555;
            margin-bottom: 0.5rem;
        }
        .navigation-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;
        }
        .navigation-buttons button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background-color: #6c757d;
            color: #fff;
        }
    `;
    document.head.appendChild(style);
})();
