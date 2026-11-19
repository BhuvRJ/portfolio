#!/usr/bin/env node
// Checks the Midas landing page (midas/index.html) before a push:
//   - every "Get Midas" button points at the public TestFlight link
//   - every local file the page references exists in the repo
//   - the page is listed in sitemap.xml
//   - no em dashes (site writing rule)
// Run `node scripts/check-midas-landing.js`. Exits 1 on the first failed check.
// No dependencies.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANDING_DIR = path.join(ROOT, 'midas');
const LANDING_FILE = path.join(LANDING_DIR, 'index.html');
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/JpYmDbsC';
const LANDING_URL = 'https://bhuvanrj.me/portfolio/midas/';
const EXPECTED_BUTTON_COUNT = 3;

const failures = [];

function recordFailure(message) {
  failures.push(message);
}

function collectMatches(source, pattern) {
  const found = [];
  let match = pattern.exec(source);
  while (match) {
    found.push(match);
    match = pattern.exec(source);
  }
  return found;
}

function isExternalReference(reference) {
  return /^(https?:|mailto:|#|data:)/.test(reference);
}

function checkInstallButtons(html) {
  const buttonPattern = /<a class="button[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g;
  const buttons = collectMatches(html, buttonPattern);
  if (buttons.length !== EXPECTED_BUTTON_COUNT) {
    recordFailure(`expected ${EXPECTED_BUTTON_COUNT} install buttons, found ${buttons.length}`);
  }
  for (const button of buttons) {
    const buttonTarget = button[1];
    const buttonLabel = button[2].trim();
    if (buttonTarget !== TESTFLIGHT_URL) {
      recordFailure(`button "${buttonLabel}" points at ${buttonTarget}, not the TestFlight link`);
    }
    if (buttonLabel !== 'Get Midas') {
      recordFailure(`button label is "${buttonLabel}", expected "Get Midas"`);
    }
  }
}

function checkLocalReferences(html) {
  // Covers href, src and poster attributes, plus the font url() in the inline CSS.
  const attributePattern = /(?:href|src|poster)="([^"]+)"/g;
  const cssUrlPattern = /url\("([^"]+)"\)/g;
  const attributeMatches = collectMatches(html, attributePattern);
  const cssUrlMatches = collectMatches(html, cssUrlPattern);
  const allMatches = attributeMatches.concat(cssUrlMatches);
  for (const referenceMatch of allMatches) {
    const reference = referenceMatch[1];
    if (isExternalReference(reference)) {
      continue;
    }
    const resolvedPath = path.resolve(LANDING_DIR, reference);
    // A reference to a folder (such as "./" or "../") is served as that folder's index.html.
    const isFolder = fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory();
    const fileToFind = isFolder ? path.join(resolvedPath, 'index.html') : resolvedPath;
    if (!fs.existsSync(fileToFind)) {
      recordFailure(`missing file for reference "${reference}"`);
    }
  }
}

function checkVideoPlaysOnArrival(html) {
  const videoTagMatch = html.match(/<video [^>]*>/);
  if (!videoTagMatch) {
    recordFailure('page has no video');
    return;
  }
  const videoTag = videoTagMatch[0];
  // Browsers refuse to autoplay a video with sound, and iPhone needs playsinline to play it in the page.
  const requiredAttributes = ['autoplay', 'muted', 'playsinline'];
  for (const attribute of requiredAttributes) {
    const attributePattern = new RegExp(`\\s${attribute}(\\s|>|=)`);
    if (!attributePattern.test(videoTag)) {
      recordFailure(`video is missing "${attribute}", so it will not play on arrival`);
    }
  }
}

function checkSitemap() {
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  if (!sitemap.includes(`<loc>${LANDING_URL}</loc>`)) {
    recordFailure(`sitemap.xml does not list ${LANDING_URL} (run node scripts/build.js)`);
  }
}

function checkNoEmDashes(html) {
  if (html.includes('—') || html.includes('&mdash;')) {
    recordFailure('page contains an em dash');
  }
}

function runChecks() {
  if (!fs.existsSync(LANDING_FILE)) {
    recordFailure('midas/index.html does not exist');
    return;
  }
  const html = fs.readFileSync(LANDING_FILE, 'utf8');
  checkInstallButtons(html);
  checkLocalReferences(html);
  checkVideoPlaysOnArrival(html);
  checkSitemap();
  checkNoEmDashes(html);
}

runChecks();

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}
console.log('Midas landing page checks passed');
