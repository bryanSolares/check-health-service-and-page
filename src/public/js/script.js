const fileInput = document.getElementById("file-input");
const fileUploadBtn = document.getElementById("file-upload");
const exportCsvBtn = document.getElementById("export-csv");
const loadingDiv = document.getElementById("loading");
const resultsDiv = document.getElementById("results");
const totalAnalyzedSpan = document.getElementById("total-analyzed");
const totalSuccessfulSpan = document.getElementById("total-successful");
const totalUnsuccessfulSpan = document.getElementById("total-unsuccessful");

fileUploadBtn.addEventListener("click", function () {
  fileInput.click();
  loadingDiv.style.display = "block"; // Mostrar el indicador de carga
  resultsDiv.innerHTML = ""; // Eliminar la tabla si ya existe
});

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  const formData = new FormData();
  formData.append("file", file);

  loadingDiv.style.display = "block"; // Mostrar el indicador de carga
  resultsDiv.innerHTML = ""; // Eliminar la tabla si ya existe

  totalAnalyzedSpan.textContent = "0";
  totalSuccessfulSpan.textContent = "0";
  totalUnsuccessfulSpan.textContent = "0";

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      exportCsvBtn.style.display = "inline-block";
      loadingDiv.style.display = "none"; // Ocultar el indicador de carga
      resultsDiv.innerHTML = "";

      const table = document.createElement("table");
      const headerRow = document.createElement("tr");
      const headers = ["Server", "Port", "Status", "Health"];

      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      table.appendChild(headerRow);

      let successfulCount = 0;
      let unsuccessfulCount = 0;

      data.forEach((result) => {
        const row = document.createElement("tr");
        Object.values(result).forEach((value) => {
          const td = document.createElement("td");

          console.log();

          if (String(value).includes("http")) {
            const link = document.createElement("a");
            link.textContent = value;
            link.href = value;
            link.target = "_blank";
            link.style.color = "white";
            td.appendChild(link);
          } else {
            td.textContent = value;
          }

          row.appendChild(td);
        });

        // Añadir icono de check al final de la fila
        const checkIconCell = document.createElement("td");
        const checkIcon = document.createElement("i");
        checkIcon.classList.add("fa", "fa-lg", result.status === "success" ? "fa-circle-check" : "fa-times");
        checkIcon.classList.add(result.status === "success" ? "fa-bounce" : "fa-shake");
        checkIcon.style.color = result.status === "success" ? "#16b161" : "#f20202";
        checkIconCell.appendChild(checkIcon);
        row.appendChild(checkIconCell);

        table.appendChild(row);

        if (result.status === "success") {
          successfulCount++;
        } else {
          unsuccessfulCount++;
        }
      });

      totalAnalyzedSpan.textContent = data.length;
      totalSuccessfulSpan.textContent = successfulCount;
      totalUnsuccessfulSpan.textContent = unsuccessfulCount;

      resultsDiv.appendChild(table);
    })
    .catch((error) => {
      console.error(error);
      loadingDiv.style.display = "none"; // Ocultar el indicador de carga en caso de error
      exportCsvBtn.style.display = "none";
      alert("An error occurred while uploading file.");
    });
});

exportCsvBtn.addEventListener("click", function () {
  fetch("/export-csv")
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "results.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while exporting to CSV.");
    });
});
