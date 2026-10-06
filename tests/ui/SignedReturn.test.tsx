import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SignedReturn } from '../../app/src/components/SignedReturn';

it('styles only negative returns and keeps their minus sign and percentage', () => {
  const html = renderToStaticMarkup(
    <>
      <SignedReturn value={-0.123} />
      <SignedReturn value={0.123} />
      <SignedReturn value={0} />
    </>,
  );

  expect(html).toBe(
    '<span class="financial-return--negative">-12.3%</span><span>12.3%</span><span>0%</span>',
  );
});
