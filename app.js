const PRODUCT_LIBRARY = {
  "Sliding Series": {
    categories: {
      "2 Track 2 Shutter": {
        ratePerSqm: 1550,
        productionRules: {
          track: { widthSubtract: 70, heightSubtract: 40, pieces: 2 },
          shutter: { widthSubtract: 95, heightSubtract: 65, pieces: 2 },
          bead: { widthSubtract: 100, heightSubtract: 70, pieces: 4 },
        },
        notes: "Standard two-track aluminum sliding setup.",
      },
      "3 Track 3 Shutter": {
        ratePerSqm: 1850,
        productionRules: {
          track: { widthSubtract: 82, heightSubtract: 45, pieces: 3 },
          shutter: { widthSubtract: 108, heightSubtract: 70, pieces: 3 },
          interlock: { widthSubtract: 120, heightSubtract: 80, pieces: 6 },
        },
        notes: "Three-track system with additional interlock profiles.",
      },
    },
  },
  "Casement Series": {
    categories: {
      "Openable Single Sash": {
        ratePerSqm: 2100,
        productionRules: {
          outerFrame: { widthSubtract: 55, heightSubtract: 55, pieces: 2 },
          sash: { widthSubtract: 88, heightSubtract: 92, pieces: 2 },
          mullion: { widthSubtract: 90, heightSubtract: 95, pieces: 2 },
        },
        notes: "Single sash side-hung window profile set.",
      },
      "Openable Double Sash": {
        ratePerSqm: 2350,
        productionRules: {
          outerFrame: { widthSubtract: 60, heightSubtract: 60, pieces: 2 },
          sashLeft: { widthSubtract: 102, heightSubtract: 96, pieces: 2 },
          sashRight: { widthSubtract: 102, heightSubtract: 96, pieces: 2 },
          transom: { widthSubtract: 110, heightSubtract: 100, pieces: 1 },
        },
        notes: "Double shutter openable configuration.",
      },
    },
  },
};

const seriesSelect = document.getElementById("series");
const subcategorySelect = document.getElementById("subcategory");
const form = document.getElementById("calculator-form");
const results = document.getElementById("results");

const outputRefs = {
  series: document.getElementById("out-series"),
  subcategory: document.getElementById("out-subcategory"),
  area: document.getElementById("out-area"),
  rate: document.getElementById("out-rate"),
  unitPrice: document.getElementById("out-unit-price"),
  totalPrice: document.getElementById("out-total-price"),
  notes: document.getElementById("out-notes"),
  cuttingListBody: document.getElementById("cutting-list-body"),
};

function toCurrency(value) {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function toFixed(value) {
  return Number(value).toFixed(2);
}

function populateSeries() {
  seriesSelect.innerHTML = "";
  Object.keys(PRODUCT_LIBRARY).forEach((seriesName) => {
    const option = document.createElement("option");
    option.value = seriesName;
    option.textContent = seriesName;
    seriesSelect.appendChild(option);
  });
  populateSubcategories();
}

function populateSubcategories() {
  const selectedSeries = PRODUCT_LIBRARY[seriesSelect.value];
  subcategorySelect.innerHTML = "";
  Object.keys(selectedSeries.categories).forEach((categoryName) => {
    const option = document.createElement("option");
    option.value = categoryName;
    option.textContent = categoryName;
    subcategorySelect.appendChild(option);
  });
}

function buildCuttingList(width, height, quantity, rules) {
  return Object.entries(rules).map(([part, rule]) => {
    const cutWidth = Math.max(width - rule.widthSubtract, 0);
    const cutHeight = Math.max(height - rule.heightSubtract, 0);

    return {
      part,
      cutWidth,
      cutHeight,
      quantity: rule.pieces * quantity,
    };
  });
}

function renderCuttingList(cuttingItems) {
  outputRefs.cuttingListBody.innerHTML = "";

  cuttingItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.part}</td>
      <td>${toFixed(item.cutWidth)}</td>
      <td>${toFixed(item.cutHeight)}</td>
      <td>${item.quantity}</td>
    `;
    outputRefs.cuttingListBody.appendChild(row);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const width = Number(document.getElementById("width").value);
  const height = Number(document.getElementById("height").value);
  const quantity = Number(document.getElementById("quantity").value);
  const color = document.getElementById("color").value.trim();
  const requirements = document.getElementById("requirements").value.trim();

  const selectedSeries = PRODUCT_LIBRARY[seriesSelect.value];
  const selectedCategory = selectedSeries.categories[subcategorySelect.value];

  const area = (width * height) / 1_000_000;
  const unitPrice = area * selectedCategory.ratePerSqm;
  const totalPrice = unitPrice * quantity;

  const cuttingItems = buildCuttingList(
    width,
    height,
    quantity,
    selectedCategory.productionRules,
  );

  outputRefs.series.textContent = seriesSelect.value;
  outputRefs.subcategory.textContent = subcategorySelect.value;
  outputRefs.area.textContent = toFixed(area);
  outputRefs.rate.textContent = toCurrency(selectedCategory.ratePerSqm);
  outputRefs.unitPrice.textContent = toCurrency(unitPrice);
  outputRefs.totalPrice.textContent = toCurrency(totalPrice);

  outputRefs.notes.textContent = [
    selectedCategory.notes,
    color ? `Color/Finish: ${color}` : "",
    requirements ? `Requirements: ${requirements}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  renderCuttingList(cuttingItems);
  results.classList.remove("hidden");
});

seriesSelect.addEventListener("change", populateSubcategories);
populateSeries();
