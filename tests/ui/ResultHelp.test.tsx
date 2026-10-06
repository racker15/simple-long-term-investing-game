import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResultHelp } from '../../app/src/components/ResultHelp';
it('explains comparisons and risk with concrete examples and no outcome data', () => {
  const html = renderToStaticMarkup(<ResultHelp />);
  expect(html).toContain('What do these numbers mean?');
  expect(html).toContain('$12,000 to $9,000');
  expect(html).toContain('25% drawdown');
  expect(html).toContain('60% in US stocks');
  expect(html).toContain('do not account for rising prices');
  expect(html).not.toContain('open="');
});
