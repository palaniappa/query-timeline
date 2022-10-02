import { DataSet, Timeline } from 'vis';

export class QueryTimeline {
  public processTimeline(): void {
    const groups = new DataSet([
      { id: 0, content: 'First', value: 1 },
      { id: 1, content: 'Third', value: 3 },
      { id: 2, content: 'Second', value: 2 },
    ]);

    // create a dataset with items
    // note that months are zero-based in the JavaScript Date object, so month 3 is April
    const items = new DataSet([
      {
        id: 0,
        group: 0,
        content: 'item 0',
        start: new Date(2014, 3, 17),
        end: new Date(2014, 3, 21),
      },
      {
        id: 1,
        group: 0,
        content: 'item 1',
        start: new Date(2014, 3, 19),
        end: new Date(2014, 3, 20),
      },
      {
        id: 2,
        group: 1,
        content: 'item 2',
        start: new Date(2014, 3, 16),
        end: new Date(2014, 3, 24),
      },
      {
        id: 3,
        group: 1,
        content: 'item 3',
        start: new Date(2014, 3, 23),
        end: new Date(2014, 3, 24),
      },
      {
        id: 4,
        group: 1,
        content: 'item 4',
        start: new Date(2014, 3, 22),
        end: new Date(2014, 3, 26),
      },
      {
        id: 5,
        group: 2,
        content: 'item 5',
        start: new Date(2014, 3, 24),
        end: new Date(2014, 3, 27),
      },
    ]);

    // create visualization
    const container: HTMLElement | null = document.getElementById('timeline');
    if (container != null) {
      const options = {
        // groupOrder: function (a: any, b: any) {
        //   return a.value - b.value;
        // },
        editable: true,
      };

      const timeline = new Timeline(container, items);
      timeline.setOptions(options);
      timeline.setGroups(groups);
      timeline.setItems(items);
    }
  }
}
