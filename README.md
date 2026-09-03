# warphold-site

The source of **https://warphold.com** — two static pages, no framework and no build step.

| Path | What it is |
|---|---|
| `index.html` | Home tab: the single-machine app |
| `fleet.html` | Fleet tab: the server, the dashboard and the security model |
| `site.css` | The whole design system — the Kinetic tokens and `@font-face` rules copied from the product UI repo |
| `site.js` | The copy buttons on the install blocks. That is all the JavaScript there is |
| `assets/fonts/` | Self-hosted Unbounded, Space Grotesk and Space Mono (WOFF2) with their OFL licences |
| `assets/screenshots/` | Product screenshots at 1440 px and 412 px, served through `<picture>` |
| `CNAME` | `warphold.com` — GitHub Pages' custom-domain file |

## Rules this repo keeps

- **No third-party requests.** No analytics, no cookies, no CDN, no hosted fonts. Both pages carry
  `Content-Security-Policy: default-src 'self'`, so anything external would fail loudly rather than quietly ship.
- **No install scripts here.** `get.warphold.com/app.sh` and `/fleet.sh` are Cloudflare redirects to the release
  assets in `hodyhq/warphold`, whose `scripts/install/` is their only home. The site links to them; it never
  hosts a copy that could drift.
- **Every screenshot has real alt text**, and no screenshot contains a real host, address, account or device name —
  they are captured over seeded demo data.

Check the first rule after any edit:

```sh
grep -rn 'https\?://' index.html fleet.html site.css
```

Every hit must be a deliberate link to `warphold.com`, `github.com` or `docs.warphold.com` in the page text —
never a `src`, `href="…css"` or `@import`.

## Preview locally

```sh
python3 -m http.server 8080
# then open http://localhost:8080/
```

A plain `file://` open works too, but the server matches how Pages serves it.

## How it deploys

`.github/workflows/pages.yml` uploads the repository as-is on every push to `main` and deploys it to GitHub
Pages; the actions are pinned by commit SHA. There is nothing to build, so what is in `main` is what is live.
`CNAME` holds the custom domain; DNS (apex + `www` → Pages, `warphold.dev` → 301) and HTTPS enforcement are
configured once in Cloudflare and in the repository's Pages settings.

## Updating the screenshots

They are generated, never edited. Regenerate them in the UI repo (`scripts/screenshots.sh`, which seeds a demo
Fleet server and captures every screen at both widths), then copy the ones this site uses:

```sh
for s in $(ls assets/screenshots | sed 's/@.*//' | sort -u); do
  cp ../warphold-ui/docs/screenshots/$s@1440.png ../warphold-ui/docs/screenshots/$s@412.png assets/screenshots/
done
```

Both sizes always travel together: `<picture>` serves the 412 px capture below a 640 px viewport, and the
`width`/`height` attributes on each `<source>` and `<img>` must match the files, or the pages reflow while
loading. If a screen is renamed upstream, update the `<picture>` blocks and the `alt` text with it.

## Before publishing

- [ ] TODO: regenerate two stale screenshot captures — `fleet-targets` (says "Sync to B2 is a later feature";
  that feature is now built) and `solo-repository` (the Fleet-server card has moved to Settings). Waits on the
  screenshot pipeline; see "Updating the screenshots" above.
- [ ] Re-verify every feature sentence in `fleet.html` against the merged code before Task 37 flips the repo
  public.

## Licence

Apache-2.0, the same as the product — see `LICENSE`. The bundled fonts are under the SIL Open Font Licence;
their licence files sit next to them in `assets/fonts/`.
