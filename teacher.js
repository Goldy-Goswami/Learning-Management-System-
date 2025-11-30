// Simple Upload System Using LocalStorage
async function startClass() {
  const res = await fetch('/api/create-class');
  const data = await res.json();
  window.location.href = data.link;
}

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// Load saved files on page load
document.addEventListener("DOMContentLoaded", loadFiles);

uploadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file!");
    return;
  }

  // Generate permanent blob URL
  const fileURL = URL.createObjectURL(file);

  const savedFiles = JSON.parse(localStorage.getItem("teacherUploads") || "[]");

  savedFiles.push({
    name: file.name,
    url: fileURL,
    type: file.type
  });

  localStorage.setItem("teacherUploads", JSON.stringify(savedFiles));

  fileInput.value = "";
  loadFiles();
});


function loadFiles() {
  fileList.innerHTML = "";

  const savedFiles = JSON.parse(localStorage.getItem("teacherUploads") || "[]");

  savedFiles.forEach((file, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${file.name}</span>
      <div style="display:flex; gap:10px;">
        <a href="${file.url}" target="_blank">View</a>
        <button class="deleteBtn" data-index="${index}">Delete</button>
      </div>
    `;
    fileList.appendChild(li);
  });

  // Attach delete button listeners  
  const deleteButtons = document.querySelectorAll(".deleteBtn");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", deleteFile);
  });
}


// DELETE FUNCTION
function deleteFile(e) {
  const index = e.target.getAttribute("data-index");

  let savedFiles = JSON.parse(localStorage.getItem("teacherUploads") || "[]");

  savedFiles.splice(index, 1); // remove ONE item at given index

  localStorage.setItem("teacherUploads", JSON.stringify(savedFiles));

  loadFiles(); // refresh UI
}
