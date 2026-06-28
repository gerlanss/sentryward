// SEMA-GOVERNED: module sentryward.scanner; guard registry follows contratos/sentryward_scanner.sema.
import type { Guard } from "../types/index.js";
import { authGuard } from "./auth/index.js";
import { browserExposureGuard } from "./browserExposure/index.js";
import { ciGuard } from "./ci/index.js";
import { corsGuard } from "./cors/index.js";
import { databaseGuard } from "./database/index.js";
import { dependenciesGuard } from "./dependencies/index.js";
import { dockerGuard } from "./docker/index.js";
import { firebaseGuard } from "./firebase/index.js";
import { promptInjectionGuard } from "./promptInjection/index.js";
import { routesGuard } from "./routes/index.js";
import { secretsGuard } from "./secrets/index.js";
import { sessionsGuard } from "./sessions/index.js";
import { supabaseGuard } from "./supabase/index.js";
import { uploadsGuard } from "./uploads/index.js";
import { webhooksGuard } from "./webhooks/index.js";

export const allGuards: Guard[] = [
  secretsGuard,
  browserExposureGuard,
  routesGuard,
  authGuard,
  databaseGuard,
  uploadsGuard,
  corsGuard,
  sessionsGuard,
  webhooksGuard,
  dockerGuard,
  ciGuard,
  dependenciesGuard,
  promptInjectionGuard,
  supabaseGuard,
  firebaseGuard,
];
