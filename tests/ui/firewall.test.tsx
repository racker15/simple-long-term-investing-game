import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Allocation } from '../../app/src/components/Allocation';
import { ScenarioView } from '../../app/src/components/ScenarioView';
import { decisionContext } from '../../app/src/lib/validation';
import { fixture } from '../../app/src/data/fixture';
it('starting rendering consumes only known-at-start data, with no outcome or cohort text', () => {
  const html = renderToStaticMarkup(
    <ScenarioView context={decisionContext(fixture.known)} />,
  );
  expect(html).toContain('Acme Computing');
  expect(html).not.toContain('Example Telecom becomes worthless');
  expect(html).not.toContain(fixture.future.reflection.what_nobody_knew);
  expect(html).not.toContain(fixture.known.metadata.selection.mode);
  const futureChanged = structuredClone(fixture);
  futureChanged.future.reflection.what_nobody_knew = 'LEAK';
  expect(
    renderToStaticMarkup(
      <ScenarioView context={decisionContext(futureChanged.known)} />,
    ),
  ).toBe(html);
});

it('removes nested internal sentinel fields from the entire decision context and pre-investment HTML', () => {
  const known = structuredClone(fixture.known);
  const sentinels: string[] = [];
  const sentinel = (field: string, index: number) => {
    const value = `INTERNAL_SENTINEL_${field}_${index}`;
    sentinels.push(value);
    return value;
  };
  known.headlines.forEach((story, i) => {
    story.selection_note = sentinel('headline_selection_note', i);
    story.source_ids = [sentinel('headline_source_ids', i)];
  });
  known.hot_stocks.forEach((stock, i) => {
    stock.selection_rationale = sentinel('hot_stock_selection_rationale', i);
    stock.source_ids = [sentinel('hot_stock_source_ids', i)];
  });
  known.macro.forEach((item, i) => {
    item.source_ids = [sentinel('macro_source_ids', i)];
  });
  known.forecasts.forEach((item, i) => {
    item.source_ids = [sentinel('forecast_source_ids', i)];
  });
  known.recent_returns.forEach((item, i) => {
    item.source_ids = [sentinel('recent_return_source_ids', i)];
  });
  known.asset_definitions.forEach((item, i) => {
    item.source_ids = [sentinel('asset_definition_source_ids', i)];
  });
  const context = decisionContext(known);
  const projected = JSON.stringify(context);
  const html = renderToStaticMarkup(
    <>
      <ScenarioView context={context} />
      <Allocation context={context} onCommit={() => {}} />
    </>,
  );
  expect(context).toEqual(decisionContext(fixture.known));
  for (const value of sentinels) {
    expect(projected).not.toContain(value);
    expect(html).not.toContain(value);
  }
  for (const field of ['selection_note', 'selection_rationale', 'source_ids'])
    expect(projected).not.toContain(field);
  expect(known.headlines[0].selection_note).toBe(
    'INTERNAL_SENTINEL_headline_selection_note_0',
  );
});

it('keeps Cash displayed and predictable while providing allocation controls only for the other six assets', () => {
  const html = renderToStaticMarkup(
    <Allocation context={decisionContext(fixture.known)} onCommit={() => {}} />,
  );
  expect(html).toContain('aria-label="Cash allocation"');
  expect(html).toContain('$10,000');
  expect(html).toContain('value="cash"');
  expect(html).not.toContain('Add $500 to Cash');
  expect(html).not.toContain('Remove $500 from Cash');
  expect(html.match(/aria-label="Add \$500 to /g)).toHaveLength(6);
  expect(html.match(/aria-label="Remove \$500 from /g)).toHaveLength(6);
});
