import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App.jsx";

afterEach(cleanup);

function setup() {
  const user = userEvent.setup();
  render(<App />);
  return {
    user,
    input: screen.getByLabelText("Length"),
    from: screen.getByLabelText("From"),
    to: screen.getByLabelText("To"),
    convert: screen.getByRole("button", { name: "Convert" }),
    clear: screen.getByRole("button", { name: "Clear" }),
  };
}

const resultValue = () => screen.queryByTestId("result-value");
const output = () => screen.getByRole("status");

async function convertWith(ctx, value, from, to) {
  await ctx.user.clear(ctx.input);
  if (value) await ctx.user.type(ctx.input, value);
  await ctx.user.selectOptions(ctx.from, from);
  await ctx.user.selectOptions(ctx.to, to);
  await ctx.user.click(ctx.convert);
}

describe("S1: input and unit selection", () => {
  it("S1: on load the input and output are empty, From = metre, To = centimetre", () => {
    const { input, from, to } = setup();
    expect(input.value).toBe("");
    expect(from.value).toBe("m");
    expect(to.value).toBe("cm");
    expect(resultValue()).toBeNull();
  });

  it("S1: each dropdown lists exactly the five units", () => {
    const { from, to } = setup();
    const expected = ["foot (ft)", "inch (in)", "centimetre (cm)", "metre (m)", "kilometre (km)"];
    for (const select of [from, to]) {
      const labels = Array.from(select.options).map((o) => o.textContent);
      expect(labels).toEqual(expected);
    }
  });

  it("S1: the input has a visible label programmatically linked to it", () => {
    const { input } = setup();
    const label = screen.getByText("Length", { selector: "label" });
    expect(label.getAttribute("for")).toBe(input.id);
  });
});

describe("S2: convert on click or Enter", () => {
  it("S2: converts 1 ft to 30.48 cm on Convert click", async () => {
    const ctx = setup();
    await convertWith(ctx, "1", "ft", "cm");
    expect(resultValue().textContent).toBe("30.48 cm");
  });

  it("S2: converts 1 km to 1000 m when Enter is pressed", async () => {
    const { user, input, from, to } = setup();
    await user.selectOptions(from, "km");
    await user.selectOptions(to, "m");
    await user.type(input, "1{Enter}");
    expect(resultValue().textContent).toBe("1000 m");
  });

  it("S2: changing the value or a unit without Convert/Enter calculates no result", async () => {
    const { user, input, from, to } = setup();
    await user.type(input, "1");
    await user.selectOptions(from, "ft");
    await user.selectOptions(to, "km");
    expect(resultValue()).toBeNull();
  });
});

describe("S3: neat result formatting", () => {
  it.each([
    ["1", "in", "m", "0.0254 m"],
    ["1", "in", "km", "0.000025 km"],
    ["2.5", "m", "cm", "250 cm"],
  ])("S3: input %s, %s to %s shows %s", async (value, from, to, expected) => {
    const ctx = setup();
    await convertWith(ctx, value, from, to);
    expect(resultValue().textContent).toBe(expected);
    expect(resultValue().textContent).not.toMatch(/e/i);
  });
});

describe("S4: inline error messages", () => {
  it.each([
    ["", "Please enter a valid number"],
    ["abc", "Please enter a valid number"],
    ["-5", "Length cannot be negative"],
  ])("S4: input %j + Convert shows %s and no result", async (value, message) => {
    const ctx = setup();
    await convertWith(ctx, value, "m", "cm");
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe(message);
    expect(ctx.input.getAttribute("aria-describedby")).toBe(alert.id);
    expect(ctx.input.getAttribute("aria-invalid")).toBe("true");
    expect(resultValue()).toBeNull();
  });

  it("S4: after an error, a valid number + Convert removes the error and shows the result", async () => {
    const ctx = setup();
    await convertWith(ctx, "-5", "m", "cm");
    expect(screen.getByRole("alert")).toBeTruthy();
    await ctx.user.clear(ctx.input);
    await ctx.user.type(ctx.input, "2");
    await ctx.user.click(ctx.convert);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(ctx.input.getAttribute("aria-invalid")).toBeNull();
    expect(resultValue().textContent).toBe("200 cm");
  });
});

describe("S5: stale result guard", () => {
  it("S5: editing the input empties the output", async () => {
    const ctx = setup();
    await convertWith(ctx, "1", "ft", "cm");
    expect(resultValue()).not.toBeNull();
    await ctx.user.type(ctx.input, "0");
    expect(resultValue()).toBeNull();
    expect(output().textContent).not.toContain("cm");
  });

  it("S5: changing From empties the output", async () => {
    const ctx = setup();
    await convertWith(ctx, "1", "ft", "cm");
    await ctx.user.selectOptions(ctx.from, "in");
    expect(resultValue()).toBeNull();
  });

  it("S5: changing To empties the output", async () => {
    const ctx = setup();
    await convertWith(ctx, "1", "ft", "cm");
    await ctx.user.selectOptions(ctx.to, "m");
    expect(resultValue()).toBeNull();
  });
});

describe("S6: Clear resets everything", () => {
  it("S6: with a value, changed units and a result, Clear restores the defaults", async () => {
    const ctx = setup();
    await convertWith(ctx, "1", "ft", "km");
    expect(resultValue()).not.toBeNull();
    await ctx.user.click(ctx.clear);
    expect(ctx.input.value).toBe("");
    expect(resultValue()).toBeNull();
    expect(ctx.from.value).toBe("m");
    expect(ctx.to.value).toBe("cm");
  });

  it("S6: with an error shown, Clear removes the error", async () => {
    const ctx = setup();
    await convertWith(ctx, "abc", "m", "cm");
    expect(screen.getByRole("alert")).toBeTruthy();
    await ctx.user.click(ctx.clear);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(ctx.input.getAttribute("aria-invalid")).toBeNull();
  });
});

describe("S7: keyboard and accessibility", () => {
  it("S7: Tab moves through input, From, To, Convert, Clear in order", async () => {
    const { user, input, from, to, convert, clear } = setup();
    for (const el of [input, from, to, convert, clear]) {
      await user.tab();
      expect(document.activeElement).toBe(el);
    }
  });

  it("S7: every input and dropdown is found by its accessible label", () => {
    setup();
    expect(screen.getByRole("textbox", { name: "Length" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "From" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "To" })).toBeTruthy();
  });

  it("S7: the whole flow works with the keyboard only", async () => {
    const { user, input } = setup();
    await user.tab();
    await user.keyboard("1");
    await user.tab(); // From
    await user.tab(); // To
    await user.tab(); // Convert
    await user.keyboard("{Enter}");
    expect(resultValue().textContent).toBe("100 cm");
    await user.tab();
    await user.keyboard(" ");
    expect(input.value).toBe("");
    expect(resultValue()).toBeNull();
  });

  it("S7: the result region is announced politely", () => {
    setup();
    expect(output().getAttribute("aria-live")).toBe("polite");
  });
});
