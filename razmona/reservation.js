document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get("service");

  if (!service) {
    alert("❌ خدمتی انتخاب نشده است.");
    window.location.href = "main.html";
    return;
  }

  document.getElementById("serviceName").textContent = service;
  document.getElementById("selectedService").value = service;

  const grid = document.getElementById("reservationGrid");
  const formContainer = document.getElementById("bookingFormContainer");
  const selectedSlot = document.getElementById("selectedSlot");
  const selectedDay = document.getElementById("selectedDay");
  const selectedHour = document.getElementById("selectedHour");
  const reserveForm = document.getElementById("reserveForm");

  const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
  const hours = Array.from({length: 12}, (_, i) => 9 + i);

  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  function isSlotReserved(day, hour) {
    return reservations.some(r => 
      r.day === day && 
      r.hour == hour && 
      r.status !== "رد شده ❌"
    );
  }

  let tableHTML = `<table class="reservation-table"><thead><tr><th>ساعت</th>`;
  days.forEach(day => {
    tableHTML += `<th>${day}</th>`;
  });
  tableHTML += `</tr></thead><tbody>`;

  hours.forEach(hour => {
    tableHTML += `<tr><td class="hour-cell">${hour}:00</td>`;
    days.forEach(day => {
      const isReserved = isSlotReserved(day, hour);
      tableHTML += `
        <td class="slot-cell ${isReserved ? 'reserved' : 'available'}" 
            data-day="${day}" 
            data-hour="${hour}"
            ${isReserved ? 'title="این ساعت رزرو شده است"' : 'onclick="selectSlot(this)"'}>
          ${isReserved ? '❌' : '✅'}
        </td>`;
    });
    tableHTML += `</tr>`;
  });

  tableHTML += `</tbody></table>`;
  grid.innerHTML = tableHTML;

  window.selectSlot = function(cell) {
    if (cell.classList.contains("reserved")) return;

    document.querySelectorAll(".slot-cell.selected").forEach(el => el.classList.remove("selected"));
    cell.classList.add("selected");

    const day = cell.dataset.day;
    const hour = cell.dataset.hour;
    selectedSlot.textContent = `${day} ساعت ${hour}`;
    selectedDay.value = day;
    selectedHour.value = hour;
    formContainer.style.display = "block";
    formContainer.scrollIntoView({ behavior: "smooth" });
  };

  window.cancelSelection = function() {
    document.querySelectorAll(".slot-cell.selected").forEach(el => el.classList.remove("selected"));
    formContainer.style.display = "none";
  };

  reserveForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = this.name.value.trim();
    const phone = this.phone.value.trim();

    if (!name) {
      alert("⚠️ لطفاً نام خود را وارد کنید.");
      return;
    }

    if (!/^09\d{9}$/.test(phone)) {
      alert("⚠️ لطفاً یک شماره موبایل معتبر وارد کنید (با 09 شروع شود و 11 رقمی باشد).");
      return;
    }

    const newReservation = {
      id: Date.now(),
      name,
      phone,
      service: document.getElementById("selectedService").value,
      day: selectedDay.value,
      hour: selectedHour.value,
      status: "در انتظار تأیید",
      date: new Date().toLocaleString("fa-IR")
    };

    reservations.push(newReservation);
    localStorage.setItem("reservations", JSON.stringify(reservations));

    alert(`✅ درخواست رزرو شما ثبت شد!\nنام: ${name}\nتلفن: ${phone}\nخدمت: ${newReservation.service}\nروز: ${newReservation.day}\nساعت: ${newReservation.hour}\nوضعیت: در انتظار تأیید ادمین`);

    location.reload();
  });
});