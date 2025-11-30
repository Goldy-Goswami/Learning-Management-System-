
// BUY COURSE → QR POPUP
const buyButtons = document.querySelectorAll(".buy-btn");

buyButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    const courseName = this.dataset.course;

    document.getElementById("qrCourseName").innerText =
      `Payment for: ${courseName}`;

    document.getElementById("qrModal").style.display = "flex";
  });
});

// Close Modal
function closeQR() {
  document.getElementById("qrModal").style.display = "none";
}


async function checkLiveClass() {
  const res = await fetch("/api/live-status");
  const data = await res.json();

  if (data.live) {
    const section = document.getElementById("live-class");
    const joinBtn = document.getElementById("joinLiveBtn");

    section.style.display = "block";

    joinBtn.onclick = () => {
      showJoinPopup(data.link);
    };
  }
}

checkLiveClass();
setInterval(checkLiveClass, 5000); // check every 5 sec




function showJoinPopup(link) {
  const popup = document.getElementById("joinPopup");
  popup.style.display = "flex";

  document.getElementById("confirmJoin").onclick = () => {
    window.location.href = link;
  };

  document.getElementById("cancelJoin").onclick = () => {
    popup.style.display = "none";
  };
}
