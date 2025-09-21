document.addEventListener("DOMContentLoaded", () => {
  const serviceButtons = document.querySelectorAll(".service-btn");

  serviceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const service = btn.dataset.service;
      if (!service) {
        alert("❌ نام خدمت مشخص نیست!");
        return;
      }
      window.location.href = `reservation.html?service=${encodeURIComponent(service)}`;
    });
  });
});