export default defineContentScript({
  matches: [
    'https://github.com/*',
    'https://*.github.com/*'
  ],
  main() {
    console.log('FirstCommit content script loaded on GitHub.');
  },
});
