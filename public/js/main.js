let currentTrips = [];
let editingTripId = null;

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU");
}

function formatTime(timeString) {
  return timeString ? timeString.slice(0, 5) : "";
}

function toTimeInputValue(timeString) {
  return formatTime(timeString);
}

function closeViewModal() {
  const viewModal = document.getElementById("view-modal");
  if (!viewModal) {
    return;
  }

  viewModal.classList.remove("is-open");
  viewModal.setAttribute("aria-hidden", "true");
}

function openViewModal(trip) {
  const viewModal = document.getElementById("view-modal");
  const detailAirlineReference = document.getElementById("detail-airline-reference");
  const detailOrigin = document.getElementById("detail-origin");
  const detailDestination = document.getElementById("detail-destination");
  const detailDate = document.getElementById("detail-date");
  const detailTime = document.getElementById("detail-time");
  const detailSeats = document.getElementById("detail-seats");

  if (
    !viewModal ||
    !detailAirlineReference ||
    !detailOrigin ||
    !detailDestination ||
    !detailDate ||
    !detailTime ||
    !detailSeats
  ) {
    return;
  }

  detailAirlineReference.textContent = trip.airline_reference;
  detailOrigin.textContent = trip.origin_city;
  detailDestination.textContent = trip.destination_city;
  detailDate.textContent = formatDate(trip.date_of_departure);
  detailTime.textContent = formatTime(trip.departure_time);
  detailSeats.textContent = String(trip.seats_booked);
  viewModal.dataset.tripId = String(trip.trip_id);

  viewModal.classList.add("is-open");
  viewModal.setAttribute("aria-hidden", "false");
}

async function deleteTrip(tripId) {
  const response = await fetch(`/api/bookings/${tripId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Server error: ${response.status}`);
  }
}

// Load bookings from the API/server and displays them in the HTML table element.
async function loadBookings() {
  try {
    const response = await fetch("/api/bookings");

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const bookings = await response.json();
    currentTrips = bookings;
    const tbody = document.getElementById("added-trips-body");

    tbody.innerHTML = "";

    if (bookings.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8">No trips found.</td></tr>';
      return;
    }

    bookings.forEach((booking) => {
      const row = document.createElement("tr");
      const viewCell = document.createElement("td");
      const deleteCell = document.createElement("td");
      const viewButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      const values = [
        booking.airline_reference,
        booking.origin_city,
        booking.destination_city,
        formatDate(booking.date_of_departure),
        formatTime(booking.departure_time),
        String(booking.seats_booked),
      ];

      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      viewButton.type = "button";
      viewButton.className = "table-action-btn";
      viewButton.dataset.action = "view";
      viewButton.dataset.tripId = String(booking.trip_id);
      viewButton.textContent = "View";

      deleteButton.type = "button";
      deleteButton.className = "table-action-btn table-action-delete";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.tripId = String(booking.trip_id);
      deleteButton.textContent = "Delete";

      viewCell.appendChild(viewButton);
      deleteCell.appendChild(deleteButton);
      row.appendChild(viewCell);
      row.appendChild(deleteCell);

      tbody.appendChild(row);
    });
  } 
  
  catch (err) {
    console.error("Failed to load bookings:", err);
    document.getElementById("added-trips-body").innerHTML =
      '<tr><td colspan="8">Error loading trips. Is the server running?</td></tr>';
  }
}

function setupRowActions() {
  const tbody = document.getElementById("added-trips-body");

  if (!tbody) {
    return;
  }

  tbody.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const action = target.dataset.action;
    const tripId = Number(target.dataset.tripId);

    if (!action || !Number.isInteger(tripId)) {
      return;
    }

    if (action === "view") {
      const trip = currentTrips.find((item) => item.trip_id === tripId);
      if (trip) {
        openViewModal(trip);
      }
      return;
    }

    if (action === "delete") {
      const shouldDelete = window.confirm("Delete this trip?");
      if (!shouldDelete) {
        return;
      }

      try {
        await deleteTrip(tripId);
        closeViewModal();
        await loadBookings();
      } 
      
      catch (err) {
        console.error("Failed to delete trip:", err);
        window.alert("Could not delete trip. Try again.");
      }
    }
  });
}

function setupViewModal() {
  const viewModal = document.getElementById("view-modal");
  const closeBtn = document.getElementById("view-modal-close-btn");
  const editBtn = document.getElementById("view-modal-edit-action");
  const closeActionBtn = document.getElementById("view-modal-close-action");

  if (!viewModal || !closeBtn || !closeActionBtn || !editBtn) {
    return;
  }

  closeBtn.addEventListener("click", closeViewModal);
  editBtn.addEventListener("click", () => {
    const tripId = Number(viewModal.dataset.tripId);
    const trip = currentTrips.find((item) => item.trip_id === tripId);

    if (!trip) {
      window.alert("Trip not found.");
      return;
    }

    const modal = document.getElementById("add-modal");
    const modalTitle = document.getElementById("booking-modal-title");
    const saveBtn = document.getElementById("modal-save-btn");
    const airlineRefInput = document.getElementById("airline-reference");
    const originSelect = document.getElementById("origin-city");
    const destinationSelect = document.getElementById("destination-city");
    const departureDateInput = document.getElementById("departure-date");
    const departureTimeInput = document.getElementById("departure-time");
    const seatsBookedInput = document.getElementById("seats-booked");
    const errorMessage = document.getElementById("city-error");

    if (
      !modal ||
      !modalTitle ||
      !saveBtn ||
      !airlineRefInput ||
      !originSelect ||
      !destinationSelect ||
      !departureDateInput ||
      !departureTimeInput ||
      !seatsBookedInput
    ) {
      return;
    }

    airlineRefInput.value = trip.airline_reference;
    originSelect.value = String(trip.origin_id);
    destinationSelect.value = String(trip.destination_id);
    departureDateInput.value = trip.date_of_departure;
    departureTimeInput.value = toTimeInputValue(trip.departure_time);
    seatsBookedInput.value = String(trip.seats_booked);

    editingTripId = trip.trip_id;
    modalTitle.textContent = "Edit Trip";
    saveBtn.textContent = "UPDATE";

    if (errorMessage) {
      errorMessage.textContent = "";
    }

    closeViewModal();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  });
  closeActionBtn.addEventListener("click", closeViewModal);

  viewModal.addEventListener("click", (event) => {
    if (event.target === viewModal) {
      closeViewModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewModal.classList.contains("is-open")) {
      closeViewModal();
    }
  });
}

async function loadCities() {
  try {
    const response = await fetch("/api/cities");

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const cities = await response.json();
    const originSelect = document.getElementById("origin-city");
    const destinationSelect = document.getElementById("destination-city");

    if (!originSelect || !destinationSelect) {
      return;
    }

    const buildOption = (city) => {
      const option = document.createElement("option");
      option.value = city.city_id;
      option.textContent = `${city.city_name}, ${city.country}`;
      return option;
    };

    cities.forEach((city) => {
      originSelect.appendChild(buildOption(city));
      destinationSelect.appendChild(buildOption(city));
    });
  } 
  
  catch (err) {
    console.error("Failed to load cities:", err);
  }
}

function setupCityValidation() {
  const originSelect = document.getElementById("origin-city");
  const destinationSelect = document.getElementById("destination-city");
  const errorMessage = document.getElementById("city-error");
  const saveBtn = document.getElementById("modal-save-btn");

  if (!originSelect || !destinationSelect || !errorMessage || !saveBtn) {
    return;
  }

  const validate = () => {
    const origin = originSelect.value;
    const destination = destinationSelect.value;

    if (origin && destination && origin === destination) {
      errorMessage.textContent = "Origin and destination must be different.";
      saveBtn.disabled = true;
      return;
    }

    errorMessage.textContent = "";
    saveBtn.disabled = false;
  };

  originSelect.addEventListener("change", validate);
  destinationSelect.addEventListener("change", validate);
  validate();
}

function setupBookingModal() {
  const bookBtn = document.getElementById("add-trip-btn");
  const modal = document.getElementById("add-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const saveBtn = document.getElementById("modal-save-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const airlineRefInput = document.getElementById("airline-reference");
  const originSelect = document.getElementById("origin-city");
  const destinationSelect = document.getElementById("destination-city");
  const departureDateInput = document.getElementById("departure-date");
  const departureTimeInput = document.getElementById("departure-time");
  const seatsBookedInput = document.getElementById("seats-booked");
  const errorMessage = document.getElementById("city-error");

  if (!bookBtn || !modal || !closeBtn || !saveBtn || !cancelBtn) {
    return;
  }

  const openModal = () => {
    const modalTitle = document.getElementById("booking-modal-title");
    saveBtn.textContent = "SAVE";
    editingTripId = null;
    if (modalTitle) {
      modalTitle.textContent = "Add a Trip";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    const modalTitle = document.getElementById("booking-modal-title");

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    if (modalTitle) {
      modalTitle.textContent = "Add a Trip";
    }

    saveBtn.textContent = "SAVE";
    editingTripId = null;
  };

  const submitBooking = async () => {
    if (
      !airlineRefInput ||
      !originSelect ||
      !destinationSelect ||
      !departureDateInput ||
      !departureTimeInput ||
      !seatsBookedInput
    ) {
      return;
    }

    const airlineReference = airlineRefInput.value.trim();
    const originId = originSelect.value;
    const destinationId = destinationSelect.value;
    const departureDate = departureDateInput.value;
    const departureTime = departureTimeInput.value;
    const seatsBooked = Number(seatsBookedInput.value);

    // Data validation, checking if all required fields are filled and valid.
    if (!airlineReference || !originId || !destinationId || !departureDate || !departureTime) {
      if (errorMessage) {
        errorMessage.textContent = "Please complete all fields.";
      }
      return;
    }

    if (!Number.isInteger(seatsBooked) || seatsBooked < 1) {
      if (errorMessage) {
        errorMessage.textContent = "Seats booked must be 1 or more.";
      }
      return;
    }

    if (originId === destinationId) {
      if (errorMessage) {
        errorMessage.textContent = "Origin and destination must be different.";
      }
      return;
    }

    // Edit trip if editingTripId is set, otherwise create new trip
    try {
      const isEdit = Number.isInteger(editingTripId);
      const response = await fetch(
        isEdit ? `/api/bookings/${editingTripId}` : "/api/bookings",
        {
          method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airline_reference: airlineReference,
          origin_id: Number(originId),
          destination_id: Number(destinationId),
          departure_date: departureDate,
          departure_time: departureTime,
          seats_booked: seatsBooked,
        }),
      }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (errorMessage) {
        errorMessage.textContent = "";
      }

      closeModal();
      await loadBookings();
    } 
    
    catch (err) {
      console.error("Failed to add booking:", err);
      if (errorMessage) {
        errorMessage.textContent = "Could not add booking. Try again.";
      }
    }
  };

  bookBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  saveBtn.addEventListener("click", submitBooking);
  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadBookings();
  loadCities();
  setupCityValidation();
  setupBookingModal();
  setupRowActions();
  setupViewModal();
});
