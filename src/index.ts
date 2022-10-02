// Import helpers.
import { setMessage } from '@/helpers/set-message';
import { QueryTimelineOptions } from './model/queryTimelineOptions';
import { QueryTimeline } from './query-timeline';

/**
 * Will find #root element and set HTML to "Hello World!".
 */
let options: QueryTimelineOptions = new QueryTimelineOptions();
const t: QueryTimeline = new QueryTimeline(options);
function main(): void {
  // const root = document.getElementById('root'); // Get root element.
  // if (root) {
  //   root.innerHTML = `<p>${setMessage()}</p>`; // Set html of the root element.
  // }
  const showAllButton = document.getElementById('showAll') as HTMLButtonElement;
  showAllButton.addEventListener("click", onShowAllClick);

  const showOnlyStagesButton = document.getElementById('showOnlyStages') as HTMLButtonElement;
  showOnlyStagesButton.addEventListener("click", onShowOnlyStagesClick);

  options.showAll = true;
  t.processQuery();
  t.showOnlyStages();
}

function onShowAllClick():void {
  t.showAll();
}

function onShowOnlyStagesClick():void {
  t.showOnlyStages();
}

main(); // Call editDom.
