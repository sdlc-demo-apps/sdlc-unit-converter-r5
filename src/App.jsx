import { useState } from "react";
import { DEFAULTS, MESSAGES, UNITS, convertLength, formatResult, parseLength } from "./convert.js";

export default function App() {
  const [inputValue, setInputValue] = useState(DEFAULTS.inputValue);
  const [fromUnit, setFromUnit] = useState(DEFAULTS.fromUnit);
  const [toUnit, setToUnit] = useState(DEFAULTS.toUnit);
  const [result, setResult] = useState(DEFAULTS.result);
  const [error, setError] = useState(DEFAULTS.error);

  function handleSubmit(event) {
    event.preventDefault();
    const parsed = parseLength(inputValue);
    if (!parsed.ok) {
      setError(MESSAGES[parsed.error]);
      setResult(null);
      return;
    }
    setResult(formatResult(convertLength(parsed.value, fromUnit, toUnit), toUnit));
    setError(null);
  }

  // Stale guard (S5): any change empties the result until the next Convert.
  function changeWith(setter) {
    return (event) => {
      setter(event.target.value);
      setResult(null);
    };
  }

  function handleClear() {
    setInputValue(DEFAULTS.inputValue);
    setFromUnit(DEFAULTS.fromUnit);
    setToUnit(DEFAULTS.toUnit);
    setResult(DEFAULTS.result);
    setError(DEFAULTS.error);
  }

  const options = UNITS.map((u) => (
    <option key={u.id} value={u.id}>
      {u.label}
    </option>
  ));

  return (
    <main>
      <div className="converter-card">
        <h1>Unit Converter</h1>
        <p className="sub">Convert a length between ft, in, cm, m and km.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="length-input">Length</label>
            <input
              id="length-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="e.g. 12.5"
              value={inputValue}
              onChange={changeWith(setInputValue)}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "length-error" : undefined}
            />
            {error && (
              <p id="length-error" className="error-msg" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="units">
            <div className="field">
              <label htmlFor="from-unit">From</label>
              <select id="from-unit" value={fromUnit} onChange={changeWith(setFromUnit)}>
                {options}
              </select>
            </div>
            <div className="field">
              <label htmlFor="to-unit">To</label>
              <select id="to-unit" value={toUnit} onChange={changeWith(setToUnit)}>
                {options}
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Convert
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
          <output className="result-box" htmlFor="length-input from-unit to-unit" aria-live="polite">
            <span className="result-label">Result</span>
            {result ? (
              <span className="result-value" data-testid="result-value">
                {result}
              </span>
            ) : (
              <span className="result-empty">Enter a length and press Convert.</span>
            )}
          </output>
        </form>
      </div>
    </main>
  );
}
