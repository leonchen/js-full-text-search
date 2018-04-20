import * as lunr from 'lunr';

export default class FullTextSearch<T> {
  private index: lunr.Index;
  private itemList: T[];
  private itemLookup: { [k: string]: T };

  constructor(items: T[], fields: (keyof T)[], ref: keyof T) {
    const self = this;
    this.itemList = items;
    this.itemLookup = {};

    this.index = lunr(function() {
      this.ref(ref);

      for (const f of fields) {
        this.field(f);
      }

      for (const item of items) {
        self.itemLookup[item[ref].toString()] = item;
        this.add(item as Object);
      }
    });
  }

  search(text: string): T[] {
    if (!text.length) return this.itemList;
    const res = this.index.search(text);
    return res.map(r => this.itemLookup[r.ref]);
  }
}
