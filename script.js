document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.add("light");
  }

  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  });

  const startBtn = document.getElementById("start-btn");
  startBtn.addEventListener("click", () => {
    const minInput = document.getElementById("duration-minutes");
    const secInput = document.getElementById("duration-seconds");
    const minutes = parseInt(minInput.value, 10) || 0;
    const seconds = parseInt(secInput.value, 10) || 0;
    const totalSeconds = minutes * 60 + seconds;
    // Prevent zero duration
    if (totalSeconds < 1) {
      alert("Please set a session time greater than 0.");
      return;
    }
    window.location.href = `session.html?duration=${minutes}&seconds=${seconds}`;
  });
});