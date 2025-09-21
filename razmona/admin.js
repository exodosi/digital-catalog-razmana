document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reservationList");
  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  if (reservations.length === 0) {
    container.innerHTML = "<p>هیچ درخواست در انتظار تأیید وجود ندارد.</p>";
    return;
  }

  reservations.forEach(item => {
    const card = document.createElement("div");
    card.className = "reservation-card";

    let statusColor = "#f5e6c8";
    if (item.status === "تأیید شده ✅") statusColor = "#d4edda";
    if (item.status === "رد شده ❌") statusColor = "#f8d7da";

    card.style.backgroundColor = statusColor;
    card.style.color = "#1a3d2f";

    card.innerHTML = `
      <p><strong>نام:</strong> ${item.name}</p>
      <p><strong>شماره تماس:</strong> ${item.phone}</p>
      <p><strong>خدمت:</strong> ${item.service || "نامشخص"}</p>
      <p><strong>روز:</strong> ${item.day}</p>
      <p><strong>ساعت:</strong> ${item.hour}:00</p>
      <p><strong>تاریخ:</strong> ${item.date}</p>
      <p><strong>وضعیت:</strong> <span class="status-text">${item.status}</span></p>
      ${item.status === "در انتظار تأیید" ? `
        <button onclick="updateStatus(${item.id}, 'confirmed')">تأیید ✅</button>
        <button onclick="updateStatus(${item.id}, 'rejected')">رد ❌</button>
      ` : `<span>✅ عملیات انجام شده</span>`}
    `;
    container.appendChild(card);
  });
});

function updateStatus(id, status) {
  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
  const index = reservations.findIndex(r => r.id == id);

  if (index !== -1) {
    reservations[index].status = status === 'confirmed' ? 'تأیید شده ✅' : 'رد شده ❌';
    localStorage.setItem("reservations", JSON.stringify(reservations));
    alert("✅ وضعیت رزرو به‌روزرسانی شد.");
    location.reload();
  } else {
    alert("❌ رزرو مورد نظر یافت نشد.");
  }
}