# Unfinished choice recovery

The historical-session workflow saved the queue and committed result, but a refresh while editing discarded the unfinished allocation and prediction. This follow-on stores each edit synchronously under a session-and-scenario-specific browser key, before any outcome is loaded.

Restoration returns to the editable allocation screen, even if the player had reached confirmation. It never invests automatically. Values are checked against the exact seven current assets and normal $500/$10,000 rules; malformed saved edits produce a warning rather than silently changing a choice. A committed choice is already stored separately, so its temporary draft is removed. New rounds and new sessions use distinct keys. Practice uses its own separate draft key.

No data, return calculations, allocation limits or staged-replay rules change. Browser storage can still be cleared or unavailable; failures are shown. Concurrent-tab editing and cross-device sync remain out of scope.

Verification includes invalid saved-edit unit cases and desktop/mobile browser recovery from confirmation to editable allocations, no early outcome request, a correct eventual commit, and a clean next-round allocation.
