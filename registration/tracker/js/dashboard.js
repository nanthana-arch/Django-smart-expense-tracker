document.addEventListener("DOMContentLoaded", () => {
  // Category doughnut
  const catCanvas = document.getElementById("categoryChart");
  if (catCanvas) {
    const labels = JSON.parse(document.getElementById("labels-data")?.textContent || "[]");
    const values = JSON.parse(document.getElementById("values-data")?.textContent || "[]");
    new Chart(catCanvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "#2563eb",
              "#16a34a",
              "#f59e0b",
              "#dc2626",
              "#9333ea",
              "#0ea5e9",
              "#ea580c",
              "#64748b",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }

  // Trend line
  const trendCanvas = document.getElementById("trendChart");
  if (trendCanvas) {
    const tLabels = JSON.parse(document.getElementById("trend-labels")?.textContent || "[]");
    const tValues = JSON.parse(document.getElementById("trend-values")?.textContent || "[]");
    new Chart(trendCanvas, {
      type: "line",
      data: {
        labels: tLabels,
        datasets: [
          {
            label: "Rs",
            data: tValues,
            tension: 0.35,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.15)",
            fill: true,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  // Payment method bar chart
  const methodCanvas = document.getElementById("methodChart");
  if (methodCanvas) {
    const mLabels = JSON.parse(document.getElementById("method-labels")?.textContent || "[]");
    const mValues = JSON.parse(document.getElementById("method-values")?.textContent || "[]");
    const methodColors = {
      Cash: "#16a34a",
      Card: "#2563eb",
      "UPI / Wallet": "#f59e0b",
      "Bank Transfer": "#9333ea",
      Other: "#ea580c",
    };
    new Chart(methodCanvas, {
      type: "bar",
      data: {
        labels: mLabels,
        datasets: [
          {
            data: mValues,
            backgroundColor: mLabels.map((label) => methodColors[label] || "#64748b"),
            borderRadius: 6,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  // Client-side search
  const searchInput = document.getElementById("searchInput");
  const table = document.getElementById("expenseTable");
  const methodFilter = document.getElementById("methodFilter");
  const minAmount = document.getElementById("minAmount");
  const minAmountLabel = document.getElementById("minAmountLabel");
  const sortAmountBtn = document.getElementById("sortAmount");

  if (table) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    const applyFilters = () => {
      const term = (searchInput?.value || "").toLowerCase();
      const method = methodFilter?.value || "";
      const minAmt = minAmount ? Number(minAmount.value || 0) : 0;

      rows.forEach((row) => {
        const title = row.querySelector(".expense-title")?.textContent.toLowerCase() || "";
        const category = row.dataset.category || "";
        const rowMethod = row.dataset.method || "";
        const rowAmt = Number(row.dataset.amount || 0);

        const matchTerm = title.includes(term) || category.includes(term);
        const matchMethod = !method || rowMethod === method;
        const matchAmount = rowAmt >= minAmt;

        row.style.display = matchTerm && matchMethod && matchAmount ? "" : "none";
      });
    };

    searchInput?.addEventListener("input", applyFilters);
    methodFilter?.addEventListener("change", applyFilters);
    minAmount?.addEventListener("input", () => {
      minAmountLabel.textContent = `Rs ${minAmount.value}`;
      applyFilters();
    });

    const sortRows = (direction = "desc") => {
      const tbody = table.querySelector("tbody");
      const sorted = rows.slice().sort((a, b) => {
        const aVal = Number(a.dataset.amount || 0);
        const bVal = Number(b.dataset.amount || 0);
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      });
      sorted.forEach((r) => tbody.appendChild(r));
    };

    sortAmountBtn?.addEventListener("click", (e) => {
      const dir = e.currentTarget.getAttribute("data-direction") === "desc" ? "asc" : "desc";
      e.currentTarget.setAttribute("data-direction", dir);
      e.currentTarget.textContent = dir === "asc" ? "Sort Amount ↑" : "Sort Amount ↓";
      sortRows(dir);
    });
  }
});
