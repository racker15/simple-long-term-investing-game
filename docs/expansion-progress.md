# Expansion toward fifty historical scenarios

Target: 25 important dates and 25 random dates, preserving all six qualified pilots. The 2026-10-06 expansion uses a preregistered fixed seed and only excludes exact selected-date duplicates before drawing. This deliberately supersedes the pilot spacing rule for the added dates; it does not rewrite the original pilot draw. Overlapping windows and repeated stock choices are not independent experiments.

## Completed additions

- 1982-09: recession concerns, international debt, IBM competition, diplomacy and culture. Starting bundle committed at `31fe23e2cbc8281bb432e1ead44a8093cc773803` before its new stock outcome request.
- 1982-10: rate-cut hopes, unemployment and elections, Poland, archaeology and film. Same separate starting commit. Its final month includes October 1987; the September scenario ends before that month. Both dates remain because the random draw selected them, not because of their contrasting outcomes.

The first two additions have six contemporary stories, five economic indicators plus professional outlook text, three preselected stocks, seven coherent 60-month paths, sourced events and four short reflection sections. Shared macro indicators use preceding-month reconstructed FRED values and are clearly marked approximate; these are not original-release vintages. Stock returns use public adjusted-price proxies. Neither news-source diversity nor institutional-grade precision is a release quota.

## Verification

`npm run check` passed: formatting, schemas, deterministic data rebuilding, all scenario validation, 131 tests, TypeScript and production build. The development fixture's deliberate bankruptcy warning is expected. The first expansion commit also passed GitHub’s existing browser checks. New-date browser walkthroughs remain pending. No site deployment or merge is claimed.

A transfer initially appended one newline to shared upstream research files. The new starting-lock hashes were corrected to exact upstream bytes, and new protocol/draw JSON received repository formatting. No starting prose, selection, stock choice or numeric value changed; the lock notes disclose this byte-format repair. The original pilot locks and data remain unchanged.

Remaining selected dates are research commitments, not complete scenarios. Only complete validated entries appear in the manifest.

## Second batch

March 1980, August 1981, September 1981 and May 1983 are complete. Their starts were committed at `7825f641cbd0f3370cac5d7f19378a46651c344b` before outcome retrieval. Each adds six contemporary stories, six approximate economic indicators, a dated professional forecast, seven five-year return paths and three sourced events. Forecast release timing before 1990 is explicitly approximate, rather than an invented exact archive date. All four passed offline rebuilding and the full 121-test check. Twelve scenarios are registered; thirty-eight selected dates remain.

## Third and fourth batches

November 1984, September/November 1985, October 1987, December 1988 and January/November 1989 are complete. Their separate starting commits are `469871da62f91731aede5576a186143a325c8773` and `ee0c2cbecd31bef59ac81275858cd59956b5b52a`. News includes space, everyday products, diplomacy, entertainment and science alongside markets. The October 1987 start explicitly includes Black Monday as already known; the crash is not incorrectly replayed as a subsequent loss. Original issue indexes disambiguate TIME archive pages migrated with a 2005 web date. Public adjusted-price histories include US-traded Sony shares with dollar-denominated returns. All seven passed the full check, now 131 tests. Nineteen scenarios are registered; thirty-one selected dates remain.

## Fifth batch

August 1990 and February/November 1991 add three complete scenarios. Their starting context was committed at `d5099a44d4cd563671ea674a9852c93ee95a7bb8` before outcome retrieval. February includes the end-of-month Gulf cease-fire; November contrasts two computer partners whose subsequent shares diverged. Seven paths cover all 60 months. Twenty-two scenarios are registered; twenty-eight selected dates remain.

The fifth batch passed the full local check: 131 tests, data rebuilding, schemas, formatting, TypeScript and production build.

## Sixth batch

December 1991 and February/November 1992 are complete. Starting bundles were separately committed at `39064cd980ea5ce02d02b14aedd945cbc512c901` before future histories. New stock choices include Honda, Hasbro and Ford, selected from contemporary coverage. Twenty-five complete scenarios are registered, halfway to the target.

February 1994 is also complete, after starting lock `51751d83a3a99896590caabaef1016d5aeade4c8`. Its first rate-tightening announcement is known at the start. The collection now has 26 complete scenarios and 24 remaining selected dates. An interim aggregate validation correctly rejected the incomplete 1994 folder; no completed status was claimed from that attempt.

Final combined check passed with 135 tests, all 26 scenario validations, exact rebuilding, schemas, formatting, TypeScript and production build.
