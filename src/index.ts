// Import helpers.
import { setMessage } from '@/helpers/set-message';
import { QueryTimeline } from './query-timeline';

/**
 * Will find #root element and set HTML to "Hello World!".
 */
function main(): void {
  const root = document.getElementById('root'); // Get root element.
  if (root) {
    root.innerHTML = `<p>${setMessage()}</p>`; // Set html of the root element.
  }
  const t: QueryTimeline = new QueryTimeline();
  t.processTimeline();
}

main(); // Call editDom.
