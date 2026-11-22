// Pure conversion logic: no React, DOM, storage or network code (NFR-07, NFR-05).

export const UNITS = Object.freeze([
  Object.freeze({ id: "ft", label: "foot (ft)", symbol: "ft", toMetre: 0.3048 }),
  Object.freeze({ id: "in", label: "inch (in)", symbol: "in", toMetre: 0.0254 }),
  Object.freeze({ id: "cm", label: "centimetre (cm)", symbol: "cm", toMetre: 0.01 }),
  Object.freeze({ id: "m", label: "metre (m)", symbol: "m", toMetre: 1 }),
  Object.freeze({ id: "km", label: "kilometre (km)", symbol: "km", toMetre: 1000 }),
]);

export const DEFAULTS = Object.freeze({
  inputValue: "",
  fromUnit: "m",
  toUnit: "cm",
  result: null,
  error: null,
});

export const MESSAGES = Object.freeze({
  invalid: "Please enter a valid number",
  negative: "Length cannot be negative",
});

function findUnit(id) {
  const unit = UNITS.find((u) => u.id === id);
  if (!unit) throw new Error(`Unknown unit: ${id}`);
  return unit;
}

export function parseLength(raw) {
  const text = String(raw ?? "").trim();
  if (!/^-?\d+(\.\d+)?$/.test(text) && !/^-?\.\d+$/.test(text)) {
    return { ok: false, error: "invalid" };
  }
  const value = Number(text);
  if (value < 0) return { ok: false, error: "negative" };
  return { ok: true, value };
}

export function convertLength(value, from, to) {
  return (value * findUnit(from).toMetre) / findUnit(to).toMetre;
}

export function formatResult(value, unitId) {
  const { symbol } = findUnit(unitId);
  let text = value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  if (text === "-0") text = "0";
  return `${text} ${symbol}`;
}
