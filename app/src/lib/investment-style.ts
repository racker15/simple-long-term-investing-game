import type { AssetId } from './contracts';
const broad = {
  cash: {
    color: '#53675f',
    symbol: '▣',
    kind: 'Cash',
    explanation: 'Money held in cash.',
  },
  bonds: {
    color: '#986127',
    symbol: '▤',
    kind: 'Bonds',
    explanation: 'Loans to governments or companies.',
  },
  us_total: {
    color: '#346da4',
    symbol: '◆',
    kind: 'US stock basket',
    explanation: 'Small shares in many US companies.',
  },
  international_ex_us: {
    color: '#247c7a',
    symbol: '◎',
    kind: 'International basket',
    explanation: 'Small shares in many companies outside the US.',
  },
};
export function investmentStyle(id: AssetId, ids: readonly AssetId[]) {
  if (id in broad) return broad[id as keyof typeof broad];
  const index = Math.max(
    0,
    ids.filter((value) => value.startsWith('hot:')).indexOf(id),
  );
  return {
    color: ['#7657a4', '#ac4d67', '#a05724'][index % 3],
    symbol: ['▲', '■', '●'][index % 3],
    kind: 'One company',
    explanation: 'A share of ownership in this company.',
  };
}
