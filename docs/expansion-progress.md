# Expansion toward fifty historical scenarios

Target: 25 important dates and 25 random dates, preserving all six qualified pilots. The 2026-10-06 expansion uses a preregistered fixed seed and only excludes exact selected-date duplicates before drawing. This deliberately supersedes the pilot spacing rule for the added dates; it does not rewrite the original pilot draw. Overlapping windows and repeated stock choices are not independent experiments.

## Completed additions

- 1982-09: recession concerns, international debt, IBM competition, diplomacy and culture. Starting bundle committed at `31fe23e2cbc8281bb432e1ead44a8093cc773803` before its new stock outcome request.
- 1982-10: rate-cut hopes, unemployment and elections, Poland, archaeology and film. Same separate starting commit. Its final month includes October 1987; the September scenario ends before that month. Both dates remain because the random draw selected them, not because of their contrasting outcomes.

Both have six contemporary stories, five economic indicators plus professional outlook text, three preselected stocks, seven coherent 60-month paths, sourced events and four short reflection sections. Shared macro indicators use preceding-month reconstructed FRED values and are clearly marked approximate; these are not original-release vintages. Stock returns use public adjusted-price proxies. Neither news-source diversity nor institutional-grade precision is a release quota.

## Verification

`npm run check` passed: formatting, schemas, deterministic data rebuilding, all scenario validation, 117 tests, TypeScript and production build. The development fixture's deliberate bankruptcy warning is expected. Browser expansion coverage is pending. No site deployment or merge is claimed.

A transfer initially appended one newline to shared upstream research files. The new starting-lock hashes were corrected to exact upstream bytes, and new protocol/draw JSON received repository formatting. No starting prose, selection, stock choice or numeric value changed; the lock notes disclose this byte-format repair. The original pilot locks and data remain unchanged.

Remaining selected dates are research commitments, not complete scenarios. Only complete validated entries appear in the manifest.
