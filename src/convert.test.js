import { describe, expect, it } from "vitest";
import { DEFAULTS, MESSAGES, UNITS, convertLength, formatResult, parseLength } from "./convert.js";

// Reference values for input 1, from the exact metre factors, rounded to 6 decimals.
const PAIRS = [
  ["ft", "in", "12 in"],
  ["ft", "cm", "30.48 cm"],
  ["ft", "m", "0.3048 m"],
  ["ft", "km", "0.000305 km"],
  ["in", "ft", "0.083333 ft"],
  ["in", "cm", "2.54 cm"],
  ["in", "m", "0.0254 m"],
  ["in", "km", "0.000025 km"],
  ["cm", "ft", "0.032808 ft"],
  ["cm", "in", "0.393701 in"],
  ["cm", "m", "0.01 m"],
  ["cm", "km", "0.00001 km"],
  ["m", "ft", "3.28084 ft"],
  ["m", "in", "39.370079 in"],
  ["m", "cm", "100 cm"],
  ["m", "km", "0.001 km"],
  ["km", "ft", "3280.839895 ft"],
  ["km", "in", "39370.07874 in"],
  ["km", "cm", "100000 cm"],
  ["km", "m", "1000 m"],
];

describe("convert module", () => {
  it("S1: lists exactly five units in display order with labels", () => {
    expect(UNITS.map((u) => u.id)).toEqual(["ft", "in", "cm", "m", "km"]);
    expect(UNITS.map((u) => u.label)).toEqual([
      "foot (ft)",
      "inch (in)",
      "centimetre (cm)",
      "metre (m)",
      "kilometre (km)",
    ]);
  });

  it("S1: defaults are empty input, metre to centimetre, no result or error", () => {
    expect(DEFAULTS).toEqual({ inputValue: "", fromUnit: "m", toUnit: "cm", result: null, error: null });
  });

  it("S8: the table covers all 20 distinct unit pairs", () => {
    const keys = new Set(PAIRS.map(([f, t]) => `${f}-${t}`));
    expect(keys.size).toBe(20);
    PAIRS.forEach(([f, t]) => expect(f).not.toBe(t));
  });

  it.each(PAIRS)("S2/S8: converts 1 %s to %s as %s", (from, to, expected) => {
    expect(formatResult(convertLength(1, from, to), to)).toBe(expected);
  });

  it("S2: converts 1 ft to 30.48 cm", () => {
    expect(convertLength(1, "ft", "cm")).toBeCloseTo(30.48, 10);
  });

  it("S2: throws for an unknown unit", () => {
    expect(() => convertLength(1, "mi", "m")).toThrow("Unknown unit: mi");
  });

  it("S3: trims trailing zeros (1 in to m is 0.0254 m)", () => {
    expect(formatResult(convertLength(1, "in", "m"), "m")).toBe("0.0254 m");
  });

  it("S3: shows tiny values with max 6 decimals and no scientific notation", () => {
    const text = formatResult(convertLength(1, "in", "km"), "km");
    expect(text).toBe("0.000025 km");
    expect(text).not.toMatch(/e/i);
    expect(formatResult(1e-7, "m")).toBe("0 m");
    expect(formatResult(-0, "m")).toBe("0 m");
  });

  it("S3: shows whole numbers without a decimal point (2.5 m to cm is 250 cm)", () => {
    expect(formatResult(convertLength(2.5, "m", "cm"), "cm")).toBe("250 cm");
  });

  it.each(["", "   ", "abc", "1,5", "1.", "1e3", "--1", "1.2.3"])(
    "S4: parseLength(%j) is invalid",
    (raw) => {
      expect(parseLength(raw)).toEqual({ ok: false, error: "invalid" });
    }
  );

  it("S4: parseLength rejects negatives", () => {
    expect(parseLength("-5")).toEqual({ ok: false, error: "negative" });
    expect(parseLength("-.5")).toEqual({ ok: false, error: "negative" });
  });

  it("S4: parseLength accepts trimmed dot decimals and zero", () => {
    expect(parseLength(" 2.5 ")).toEqual({ ok: true, value: 2.5 });
    expect(parseLength(".5")).toEqual({ ok: true, value: 0.5 });
    expect(parseLength("0")).toEqual({ ok: true, value: 0 });
  });

  it("S4: messages match the approved wording", () => {
    expect(MESSAGES.invalid).toBe("Please enter a valid number");
    expect(MESSAGES.negative).toBe("Length cannot be negative");
  });
});
