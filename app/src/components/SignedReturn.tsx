import { percent } from '../lib/format';

export function SignedReturn({ value }: { value: number }) {
  return (
    <span className={value < 0 ? 'financial-return--negative' : undefined}>
      {percent(value)}
    </span>
  );
}
