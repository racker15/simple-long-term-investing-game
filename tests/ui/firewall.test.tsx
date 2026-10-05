import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
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
