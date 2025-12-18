  const form = document.getElementById("replayForm");
      const container = document.querySelector("section:last-of-type");

      let replays = [];
      let editId = null;

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = form.title.value.trim();
        const dSplit = title.split("|");

        // console.log(dSplit[1]);
        // console.log(title);

        const link = form.linkReplay.value.trim();

        if (!title || !link) return;

        if (editId) {
          // UPDATE
          const replay = replays.find((r) => r.id === editId);
          replay.title = dSplit[0];
          replay.materi = dSplit[1];
          replay.session = dSplit[2];
          replay.link = link;
          editId = null;
        } else {
          // CREATE
          replays.push({
            id: Date.now(),
            title: dSplit[0],
            materi: dSplit[1],
            link,
            date: new Date().toDateString(),
            session: dSplit[2],
          });
        }

        form.reset();
        render();
      });

      function render() {
        container.innerHTML = "";

        replays.forEach((r) => {
          const card = document.createElement("div");
          card.className =
            "border flex items-start justify-between p-2  rounded-lg mb-2";

          card.innerHTML = `
        <div class="border-r-2 pr-4 replay-content">
          <p>Matkul   : ${r.title}</p>
          <p>Tanggal  : ${r.date}</p>
          <p>Materi   : ${r.materi}</p>
          <p>Session  : ${r.session}</p>
          <p>Replay   : <a href="${r.link}">Klik here</a></p>
        </div>

        <div class="flex flex-col gap-1 p-2">
          <button class="edit bg-yellow-400 text-white px-4 py-2 rounded-lg">Edit</button>
          <button class="delete bg-red-400 text-white px-4 py-2 rounded-lg">Delete</button>
          <button class="copy bg-gray-400 text-white px-4 py-2 rounded-lg">
            <span class="copy-label">Copy</span>
          </button>
        </div>
      `;

          // EDIT
          card.querySelector(".edit").onclick = () => {
            form.title.value = r.title + "|" + r.materi + "|" + r.session;
            form.linkReplay.value = r.link;
            editId = r.id;
          };

          // DELETE
          card.querySelector(".delete").onclick = () => {
            replays = replays.filter((x) => x.id !== r.id);
            render();
          };

          // COPY
          card.querySelector(".copy").onclick = () => {
            const text = `
Matkul   : ${r.title}
Tanggal  : ${r.date}
Materi   : ${r.materi}
Session  : ${r.session}
Replay   : ${r.link}
        `.trim();

            navigator.clipboard.writeText(text).then(() => {
              const label = card.querySelector(".copy-label");
              label.textContent = "Copied!";
              setTimeout(() => (label.textContent = "Copy"), 1500);
            });
          };

          container.appendChild(card);
        });
      }


// CSV CODE
       const exportCSVBtn = document.getElementById("exportCSV");
      const exportExcelBtn = document.getElementById("exportExcel");

      function generateCSV() {
        if (replays.length === 0) {
          alert("Data masih kosong!");
          return "";
        }

        const headers = ["Matkul", "Tanggal", "Session", "Replay"];
        const rows = replays.map((r) => [r.title, r.date, r.session, r.link]);

        let csvContent = headers.join(",") + "\n";
        rows.forEach((row) => {
          csvContent += row.map((v) => `"${v}"`).join(",") + "\n";
        });

        return csvContent;
      }

      function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
      }

      exportCSVBtn.addEventListener("click", () => {
        const csv = generateCSV();
        if (!csv) return;

        downloadFile(csv, "replay-data.csv", "text/csv");
      });

      exportExcelBtn.addEventListener("click", () => {
        const csv = generateCSV();
        if (!csv) return;

        // Excel compatible
        downloadFile(csv, "replay-data.xls", "application/vnd.ms-excel");
      });