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

  const showFileButton = document.getElementById('showFile') as HTMLElement;
  showFileButton.addEventListener("click", onShowFileClick);

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

function onShowFileClick():void {
  let fileName = (document.getElementById("jsonFile")as any).files[0];
  if(fileName) {
    var reader = new FileReader();
    reader.readAsText(fileName, "UTF-8");
    reader.onload = function (evt:any) {
        t.setQueryJson(JSON.parse(evt.target.result));
        t.processQuery();
        t.processTimeline();
    }
    reader.onerror = function (evt) {
        alert('Failed to read the contents!');
    }
  }
  
}
main(); // Call editDom.
