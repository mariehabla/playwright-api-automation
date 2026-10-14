# Playwright API Automation — Learning Portfolio

> **SDET learning project | Playwright + TypeScript | Taglish project guide**
>
> **Current milestone:** Phase 7 — GitHub Actions CI/CD setup. Confirmed locally: lifecycle GET validation passed; exploratory POST without `name` returned HTTP 200 with `name: null`. GitHub Actions workflow is being prepared and **has not yet been verified in CI**.

## 1. Ano ang purpose ng project?

Practice project ito para matutunan kung paano mag-design ng **maintainable API automation framework**, hindi lang basta magsulat ng GET/POST requests.

Ginagamit natin ang:
- **Playwright Test** — test runner, API request fixture, assertions, at reports.
- **TypeScript** — typed code at early error checking.
- **REST demo API** — `https://api.restful-api.dev` para sa practice. External/public service ito; maaaring magbago ang data, responses, o availability.
- **Node.js** — runtime; `node:crypto` para sa `randomUUID()`.

### Roadmap

| Phase | Topic | Learning status |
|---|---|---|
| 1 | Project setup + first GET test | Discussed |
| 2 | CRUD workflow | Discussed |
| 3 | Reusable API client | Discussed |
| 4 | Negative & boundary testing | Discussed; API behavior needs contract verification |
| 5 | Fixtures, factories, setup/teardown | Implemented for mini-project; lifecycle test passed |
| 6 | Essential API validation + negative behavior | Lifecycle assertions passed; negative POST behavior observed; updated assertions pending full-suite verification |
| **7** | **GitHub Actions CI/CD and reporting** | **Current — workflow setup, not yet run on GitHub** |
| 8 | GitHub portfolio polish and publishing | Upcoming |

> *Discussed* ≠ fully mastered. We verify hands-on exercises separately.

## 2. Project folder structure

Ito ang **expected learning structure** mula sa lessons natin. Kung may file na hindi mo ginawa, okay lang—huwag muna itong i-assume na existing.

```text
playwright-api-automation/
├── clients/
│   └── products.api.ts
├── fixtures/
│   ├── api.fixture.ts
│   └── product.fixture.ts
├── test-data/
│   └── product.factory.ts
├── tests/
│   ├── products.api.spec.ts
│   ├── products-crud.api.spec.ts
│   ├── products-negative.api.spec.ts
│   ├── products-fixture.api.spec.ts
│   └── products-lifecycle.api.spec.ts
├── .github/
│   └── workflows/
│       └── playwright-api.yml               # CI workflow to add/verify
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

May iba pang generated folders gaya ng `node_modules/`, `test-results/`, at `playwright-report/`. Normally, hindi sila manually ine-edit o kino-commit.

## 3. Purpose ng bawat file

### `clients/products.api.ts` — **Taga-send ng API requests**

Dito nakatira ang `ProductsApi` class at reusable methods:

- `createProduct(payload)` → POST `/objects`
- `getProduct(id)` → GET `/objects/{id}`
- `updateProduct(id, payload)` → PATCH `/objects/{id}`
- `deleteProduct(id)` → DELETE `/objects/{id}`

**Tandaan:** API client ang bahala sa **paano mag-send**. Ang test file ang bahala sa **ano ang dapat i-validate**.

### `fixtures/api.fixture.ts` — **Taga-prepare ng API client**

Custom Playwright fixture na nagbibigay ng `productsApi` sa test. Hindi na kailangang ulit-ulitin ang `new ProductsApi(request)` sa bawat test.

### `fixtures/product.fixture.ts` — **Taga-setup at cleanup ng test product**

`createdProduct` fixture na:
1. Gumagamit ng factory para gumawa ng payload.
2. Gumagamit ng API client para mag-POST.
3. Kumukuha ng `id` at nagbibigay ng product sa test gamit ang `await use(product)`.
4. Pagkatapos ng test, **nag-a-attempt** mag-DELETE sa `finally` block.

**Note:** Cleanup is attempted, not guaranteed. Kung pumalya ang server o request, puwede ring pumalya ang deletion.

### `test-data/product.factory.ts` — **Taga-generate ng sample data**

May `createProductPayload()` function na gumagawa ng JavaScript object, halimbawa unique product name gamit ang `randomUUID()`, price, at color.

**Important:** Hindi ito nagse-send ng API request. Data lang ang ginagawa nito sa memory.

### `tests/` — **Actual test cases**

| File | Para saan? |
|---|---|
| `products.api.spec.ts` | Basic GET request + assertions (Phase 1) |
| `products-crud.api.spec.ts` | One complete create → retrieve → update → delete workflow |
| `products-negative.api.spec.ts` | GET nonexistent product (expects 404) + POST missing name (observed HTTP 200 with `name: null`); second test was updated with assertions, pending rerun |
| `products-fixture.api.spec.ts` | Practice ng custom fixture at factory/unique names |
| `products-lifecycle.api.spec.ts` | GET test with automatic product creation/cleanup; validates HTTP 200, JSON content-type, matching ID/name, and string types (passed locally) |

Ang ilan dito ay **practice files**, kaya puwedeng may overlap. Ire-refactor natin sila kapag final portfolio cleanup na.

### Root configuration files

| File | Para saan? |
|---|---|
| `playwright.config.ts` | Test folder, API `baseURL`, headers, reporters |
| `tsconfig.json` | TypeScript compiler/type settings; includes Node.js types |
| `package.json` | Project metadata, npm dependencies, scripts |
| `package-lock.json` | Locked dependency versions for consistent installs |
| `.gitignore` | Excludes `node_modules`, reports, temporary outputs, secrets |
| `.github/workflows/playwright-api.yml` | GitHub Actions workflow: install, type-check, run API tests, upload HTML report; CI run pending |
| `README.md` | Documentation at cheat sheet na ito |

## 4. Paano nag-uusap ang mga files?

Simplified dependency map:

```text
                  tests/products-lifecycle.api.spec.ts
                                |
                   imports custom test from
                                v
                     fixtures/product.fixture.ts
                         /                \
          needs productsApi       calls createProductPayload()
                     |                     |
                     v                     v
             fixtures/api.fixture.ts   test-data/product.factory.ts
                     |
           creates ProductsApi(request)
                     |
                     v
              clients/products.api.ts
                     |
              sends HTTP requests
                     v
               REST API SERVER
```

**Mas madaling tandaan:**

- **Test** = ano ang ite-test at ia-assert.
- **Factory** = anong data ang gagamitin.
- **API client** = paano magse-send ng HTTP request.
- **Fixture** = sino ang maghahanda at maglilinis.

`product.fixture.ts` **extends** `api.fixture.ts`, kaya available sa lifecycle test ang parehong `createdProduct` at `productsApi`.

## 5. Actual execution sequence — lifecycle test

Kapag pinatakbo ang `tests/products-lifecycle.api.spec.ts`:

1. **Playwright starts the test.** Nakita nitong kailangan ang `productsApi` at `createdProduct` fixtures.
2. **`api.fixture.ts` creates `ProductsApi`.** Ipinapasa rito ang built-in Playwright `request` context.
3. **`product.fixture.ts` calls the factory.** Gumagawa ng unique product payload sa memory.
4. **Fixture sends POST.** Ginagamit ang `productsApi.createProduct(payload)` para gumawa ng product sa server.
5. **Fixture captures the ID.** Kinukuha ang product details mula sa API response.
6. **`await use(product)` hands it to the test.** Dito magpapatuloy ang actual test body.
7. **Test sends GET.** `productsApi.getProduct(createdProduct.id)` at chine-check ang HTTP 200, JSON content-type, ID, name, at string types.
8. **Test finishes.** Bumabalik ang execution sa fixture pagkatapos ng `await use(product)`.
9. **`finally` attempts DELETE.** `productsApi.deleteProduct(product.id)` para mag-cleanup.

```text
SETUP (fixture)          TEST BODY                 TEARDOWN (fixture)
Factory → POST → ID  →  GET → assertions  →  DELETE attempt
```

Kaya **walang POST o DELETE na nakasulat sa lifecycle test file**, pero nangyayari pa rin sila sa fixture.

## 6. Quick reference — anong file ang bubuksan ko?

| Gusto kong... | Bubuksan ko... |
|---|---|
| Baguhin ang endpoint/path ng products API | `clients/products.api.ts` |
| Magdagdag ng API method | `clients/products.api.ts` |
| Baguhin ang default product name/price/color | `test-data/product.factory.ts` |
| Baguhin kung paano ibinibigay ang API client sa tests | `fixtures/api.fixture.ts` |
| Baguhin ang automatic POST/DELETE setup at cleanup | `fixtures/product.fixture.ts` |
| Gumawa o mag-edit ng assertions/test scenarios | `tests/*.spec.ts` |
| Baguhin ang API base URL or reporters | `playwright.config.ts` |
| Ayusin ang TypeScript module/types settings | `tsconfig.json` |
| Magdagdag ng npm package/script | `package.json` (prefer `npm install` / `npm pkg` commands) |
| Alamin ang buong architecture | `README.md` |
| Baguhin ang GitHub CI steps/triggers | `.github/workflows/playwright-api.yml` |

## 7. Useful commands

Run from the project root in VS Code terminal:

```powershell
# Type-check TypeScript (no JS output)
npx tsc --noEmit

# Run the lifecycle test only
npx playwright test tests/products-lifecycle.api.spec.ts

# Run the factory/fixture practice test only
npx playwright test tests/products-fixture.api.spec.ts

# Run the CRUD workflow only
npx playwright test tests/products-crud.api.spec.ts

# Run negative scenarios only
npx playwright test tests/products-negative.api.spec.ts

# Run all tests (before GitHub push)
npx playwright test

# Open the most recent HTML report (if generated)
npx playwright show-report
```

**Note:** Running the entire suite may include exploratory or unfinished exercises, especially negative tests. Don't assume every sample has a verified API contract yet.

## 8. Key syntax — quick cheat sheet

| Syntax | Simpleng meaning |
|---|---|
| `import { ... } from '...'` | Humihiram ng exported function/class/value mula sa ibang file |
| `export` | Ginagawang available sa ibang files |
| `class ProductsApi` | Blueprint ng reusable API client |
| `new ProductsApi(request)` | Gumagawa ng actual API client instance |
| `async` | Function/method na puwedeng gumamit ng `await` |
| `await` | Hinihintay ang Promise result bago magpatuloy sa current async flow |
| `payload` | Variable na may request body data |
| `type` | TypeScript description ng expected shape/type |
| `base.extend(...)` | Gumagawa ng custom Playwright test na may dagdag na fixtures |
| `await use(product)` | Ibinibigay ang fixture value sa test; after test, nagpapatuloy ang teardown |
| `try...finally` | Sinusubukang patakbuhin ang cleanup kahit mag-fail ang test |
| `randomUUID()` | Gumagawa ng highly unique ID para sa test-data naming |

## 9. Observed API behavior and coverage

### Positive lifecycle GET — locally passed

The lifecycle test uses `createdProduct` to create data and validates:

- `response.status() === 200`
- `content-type` includes `application/json`
- Returned `id` and `name` match the created product
- Both fields have JavaScript type `string`

This is **basic response validation**, not full JSON Schema validation.

### Negative / exploratory scenarios

1. **GET nonexistent ID:** Test asserts `404`. The latest shared run indicated both tests passed, but verify again when running the complete suite.
2. **POST without `name`:** Actual observed response was **HTTP 200** and `name: null`, with an assigned `id` and submitted `data.price: 1500`. This does **not automatically mean a bug**; a requirement/API contract is needed to decide whether `name` should be mandatory.

The updated second test is a **behavior characterization test**, asserting HTTP 200, truthy ID, null name, and returned price. Its updated assertions still need a confirmed rerun.

**Data hygiene:** The missing-name POST test creates a record but does not currently clean it up. Before presenting the repository as finalized, add a reliable cleanup attempt for this test or document why the public demo service does not support it. Don't claim that every test cleans up after itself.

## 10. GitHub Actions CI/CD — Phase 7 (in progress)

**Workflow file:** `.github/workflows/playwright-api.yml`

Planned triggers:
- Push to `main`
- Pull request targeting `main`
- Manual execution via `workflow_dispatch`

Planned job on GitHub-hosted Ubuntu:

```text
Checkout repo
   ↓
Set up Node.js 22 with npm cache
   ↓
npm ci
   ↓
npx tsc --noEmit
   ↓
npx playwright test
   ↓
Upload playwright-report/ artifact (even if tests fail)
```

**Why no browser install?** This project currently uses Playwright's API request context rather than browser UI tests. Browser binaries are not required for the API-only suite.

**Prerequisites:** Commit `package.json` and `package-lock.json` for `npm ci`. Keep `node_modules/`, `playwright-report/`, `test-results/`, and `.env` files out of Git. Avoid committing tokens or credentials. The HTML report upload requires that Playwright's HTML reporter is enabled in `playwright.config.ts`.

**CI status:** Workflow content has been provided during the lesson, but we have **not confirmed the file exists in the local repository**, nor pushed it or seen a GitHub Actions run. Don't display a passing CI badge until verified.

## 11. Portfolio completion checklist

- [x] Reusable `ProductsApi` CRUD client
- [x] Custom API fixture, test-data factory, product lifecycle fixture
- [x] Lifecycle GET test with response validations — passed locally
- [x] Missing-name POST behavior investigated (HTTP 200 / null name)
- [ ] Rerun updated negative test assertions
- [ ] Add/verify cleanup for the exploratory POST test
- [ ] Run `npx tsc --noEmit` and **entire** `npx playwright test` suite
- [ ] Create/verify `.github/workflows/playwright-api.yml`
- [ ] Confirm `.gitignore`, scripts and dependencies
- [ ] Publish repository to GitHub
- [ ] Confirm green GitHub Actions run and downloadable HTML report

**After publishing:** Focus on common real-world API automation: authentication/authorization, business workflows, negative and boundary validation, schema/contracts, test-data strategy, API+UI integration, and CI regression suites.

---

*This README documents the learning project and the observed local results; it does not imply every test or CI run has been independently verified.*
