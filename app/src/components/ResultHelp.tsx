export function ResultHelp() {
  return (
    <details className="result-help">
      <summary>What do these numbers mean?</summary>
      <dl>
        <div>
          <dt>Portfolio</dt>
          <dd>All the investments you chose, added together.</dd>
        </div>
        <div>
          <dt>Return</dt>
          <dd>
            The change in value. A 10% return turns $100 into $110; a −10%
            return leaves $90.
          </dd>
        </div>
        <div>
          <dt>Diversified benchmark</dt>
          <dd>
            A comparison that starts with 60% in US stocks, 20% in stocks
            outside the US, and 20% in bonds. It holds those investments for
            five years, just like you.
          </dd>
        </div>
        <div>
          <dt>Drawdown</dt>
          <dd>
            A fall from an earlier high. A drop from $12,000 to $9,000 is a 25%
            drawdown, even if the value later recovers.
          </dd>
        </div>
      </dl>
      <p>
        Dollar amounts do not account for rising prices. $10,000 at two
        different dates may buy different amounts of things.
      </p>
    </details>
  );
}
