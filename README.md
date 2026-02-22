# Quotation + Production File Web App

This project provides a simple private web app for aluminum/fabrication teams to:

1. **Generate instant quotations** from Width, Height, Quantity.
2. **Generate production cutting lists** by applying configurable subtraction formulas per series/sub-category.

## Why this fits your use case

- Accountant can quickly generate quotes when owner shares dimensions remotely.
- Supports multiple product series and sub-categories.
- Keeps your formulas private (no subscription cloud dependency).
- Can be extended with your existing Excel code/price sheet.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Configure series, categories, rates, formulas

Edit `PRODUCT_LIBRARY` in `app.js`.

Each category contains:
- `ratePerSqm`
- `productionRules` (part-wise width/height subtraction and piece count)
- `notes`

Example:

```js
"2 Track 2 Shutter": {
  ratePerSqm: 1550,
  productionRules: {
    track: { widthSubtract: 70, heightSubtract: 40, pieces: 2 },
    shutter: { widthSubtract: 95, heightSubtract: 65, pieces: 2 }
  }
}
```

## Next implementation step (after you share Excel)

- Import your SKU/code and pricing matrix from Excel.
- Add admin panel to maintain formulas per hardware type.
- Add printable PDF quotation and production file.
- Add login + role access (owner, accountant, production).
