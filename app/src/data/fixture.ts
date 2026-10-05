import known from '../../../data/scenarios/dev-fictional/known_at_start.json';
import future from '../../../data/scenarios/dev-fictional/future_outcomes.json';
import provenance from '../../../data/scenarios/dev-fictional/provenance.json';
import { loadScenario } from '../lib/validation';
export const fixture = loadScenario({ known, future, provenance });
