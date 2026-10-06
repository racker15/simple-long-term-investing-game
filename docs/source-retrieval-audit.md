# Starting and outcome source retrieval audit

This is a historical record of one-time October 5 requests, not an ongoing qualification requirement. Player-facing content is stored locally; later URL failures do not block the game unless they reveal a material factual error. The October 6 scope realignment requires no routine URL reruns, source-body hashing or extra corroboration.

On 2026-10-05, `scripts/fetch/research-audit.py` fetched the HTTP(S) URLs in each scenario's starting provenance file. Pass `--outcome` to audit its outcome provenance file. Requests use unauthenticated Python `urllib` with four concurrent workers; temporary HTTP statuses (408, 425, 429, 500, 502, 503, and 504) are retried once. Each audit records the exact provenance URL, final response URL, HTTP status, content type, byte count, SHA-256, and any failure reason. PDF responses are accepted only when their bytes begin with `%PDF-`; obvious HTML access-denial and not-found pages are recorded as failures. Successful starting-source bodies remain under ignored `data/raw/research/<scenario>/`; outcome-source bodies are kept separately under `data/raw/research/<scenario>/outcome/`. Audit JSON files contain no article text.

The provenance publication date is copied unchanged. The actual retrieval timestamp and date are recorded separately, and the archive or migration date remains unknown. Local references and the modeled `asof-broad-proxies` and `asof-stock-prices` entries were excluded. The 119 public URL entries yielded 114 successful retrievals and five unsuccessful requests:

| Scenario | Retrieved | Audit                                                            |
| -------- | --------: | ---------------------------------------------------------------- |
| 1982-08  |   21 / 22 | [retrieval audit](../data/research/1982-08/retrieval-audit.json) |
| 1987-01  |   23 / 23 | [retrieval audit](../data/research/1987-01/retrieval-audit.json) |
| 2004-05  |   23 / 24 | [retrieval audit](../data/research/2004-05/retrieval-audit.json) |
| 2008-09  |   23 / 24 | [retrieval audit](../data/research/2008-09/retrieval-audit.json) |
| 2016-02  |   24 / 26 | [retrieval audit](../data/research/2016-02/retrieval-audit.json) |

The failed requests were:

- 1982-08, `apcpi1982`: HTTP 500, `text/html`, 314,497 bytes from [the Texas Tech download URL](https://newspapers.swco.ttu.edu/bitstreams/e2c56eda-a80a-486c-84bb-9d40e513e045/download).
- 2004-05, `earn04`: HTTP 503, “No healthy IP available for the backend,” from [the CNN Money URL](https://money.cnn.com/2004/04/08/markets/earningsmatter/?cnn=yes).
- 2008-09, `n08-house`: HTTP 503, “No healthy IP available for the backend,” from [the CNN/Fortune URL](https://money.cnn.com/2008/09/29/magazines/fortune/nobailout_easton.fortune/index.htm?cnn=yes).
- 2016-02, `ligo`: TLS certificate verification failed because the issuer could not be validated at [the LIGO URL](https://www.ligo.caltech.edu/LA/news/ligo20160211).
- 2016-02, `candidate-brk-b`: TLS hostname verification failed for `mail.berkshirehathaway.com` at [the Berkshire Hathaway PDF URL](https://mail.berkshirehathaway.com/news/feb2716.pdf).

## Outcome source retrieval

The outcome provenance files contain 57 public URL entries. All 57 returned nonempty successful responses, passed PDF signature checks where applicable, and had no clear HTML access-denial or not-found page detected. Seven PDFs passed the `%PDF-` signature check. Publication dates that are null in provenance remain null in the audit (24 entries); no dates were inferred. The `fed-crash87` source retains the provenance publication date of 2007-05-01; its archive or migration date remains unknown.

| Scenario | Retrieved | Audit                                                                            |
| -------- | --------: | -------------------------------------------------------------------------------- |
| 1982-08  |     8 / 8 | [outcome retrieval audit](../data/research/1982-08/outcome-retrieval-audit.json) |
| 1987-01  |     6 / 6 | [outcome retrieval audit](../data/research/1987-01/outcome-retrieval-audit.json) |
| 2004-05  |   13 / 13 | [outcome retrieval audit](../data/research/2004-05/outcome-retrieval-audit.json) |
| 2008-09  |   13 / 13 | [outcome retrieval audit](../data/research/2008-09/outcome-retrieval-audit.json) |
| 2016-02  |   17 / 17 | [outcome retrieval audit](../data/research/2016-02/outcome-retrieval-audit.json) |

No outcome URL had a failed retrieval in this pass. The starting-source failures above are results for those exact requests and do not establish general unavailability of the sites.
