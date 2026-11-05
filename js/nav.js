const burgerButton = document.getElementById("burger-btn");
const navMenu = document.getElementById("nav-menu");

burgerButton.addEventListener("click", () => {
  const isClosed = navMenu.classList.toggle("hidden");
  burgerButton.setAttribute("aria-expanded", String(!isClosed));
  burgerButton.classList.toggle("burger-open", !isClosed);
});

document.addEventListener("click", (event) => {
  if (!burgerButton.contains(event.target) && !navMenu.contains(event.target)) {
    navMenu.classList.add("hidden");
    burgerButton.setAttribute("aria-expanded", "false");
    burgerButton.classList.remove("burger-open");
  }
});
