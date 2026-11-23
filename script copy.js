const nav = document.getElementById("nav");
const container = document.querySelector(".container");
const total = container.children.length;
const desktop = window.matchMedia("(min-width: 48.0625rem)");

let current = 0;
let locked = false;

const waitTransition = (el) =>
  new Promise((resolve) =>
    el.addEventListener("transitionend", resolve, { once: true }),
  );

async function goToSlide(index) {
  if (locked || index === current || index < 0 || index >= total) return;

  locked = true;
  current = index;
  document.body.dataset.active = index;

  await waitTransition(container.children[index]);
  locked = false;
}

window.addEventListener(
  "wheel",
  (e) => {
    if (!desktop.matches) return;
    e.preventDefault();
    if (!locked && Math.abs(e.deltaY) >= 25) {
      goToSlide(current + Math.sign(e.deltaY));
    }
  },
  { passive: false },
);

window.addEventListener("keydown", (e) => {
  if (!desktop.matches) return;
  if (e.key === "ArrowDown" || e.key === "PageDown") goToSlide(current + 1);
  if (e.key === "ArrowUp" || e.key === "PageUp") goToSlide(current - 1);
});

nav.addEventListener("click", (e) => {
  const btn = e.target.closest(".nav__item");
  if (btn) goToSlide(Number(btn.dataset.index));
});
