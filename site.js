// Copy buttons on the install blocks. Nothing else runs on this site.
for (const button of document.querySelectorAll("button.copy")) {
  button.addEventListener("click", async () => {
    const pre = document.getElementById(button.getAttribute("aria-controls"));
    try {
      await navigator.clipboard.writeText(pre.textContent.trim());
      button.textContent = "Copied";
    } catch {
      button.textContent = "Press Ctrl+C";
      getSelection().selectAllChildren(pre);
    }
    setTimeout(() => { button.textContent = "Copy"; }, 2000);
  });
}
