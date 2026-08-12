export type ChapterMeta = {
  readonly id: string;
  readonly name: string;
  readonly chapterNumber: number;
  readonly implemented: boolean;
};

export const CAMPAIGN: ChapterMeta[] = [
  { id: 'ch1', name: 'Chapter 1: The Road to Kuta', chapterNumber: 1, implemented: true },
  { id: 'ch2', name: 'Chapter 2: The Sasu Crossing', chapterNumber: 2, implemented: true },
  { id: 'ch3', name: 'Chapter 3: The Shiine Hills', chapterNumber: 3, implemented: true },
  { id: 'ch4', name: 'Chapter 4: The Cape of Tsutsu', chapterNumber: 4, implemented: true },
  { id: 'ch5', name: 'Chapter 5: Kaneda, Above the Clouds', chapterNumber: 5, implemented: true },
  { id: 'ch6', name: 'Chapter 6: The Harbour at Kechi', chapterNumber: 6, implemented: true },
  { id: 'ch7', name: 'Chapter 7: What the Wall Held', chapterNumber: 7, implemented: true },
  { id: 'ch8', name: 'Chapter 8: The Last Stand on Yatate', chapterNumber: 8, implemented: true },
  { id: 'ch9', name: 'Chapter 9: The Empty Place', chapterNumber: 9, implemented: true },
  { id: 'ch10', name: 'Chapter 10: The Sands of Komoda', chapterNumber: 10, implemented: true },
  { id: 'ch11', name: 'Chapter 11: The Ash Road', chapterNumber: 11, implemented: false },
  { id: 'ch12', name: 'Chapter 12: The Silent Village', chapterNumber: 12, implemented: false },
  { id: 'ch13', name: 'Chapter 13: The Uchiyama Basin', chapterNumber: 13, implemented: false },
  { id: 'ch14', name: 'Chapter 14: The Shrine on the Cape', chapterNumber: 14, implemented: false },
  { id: 'ch15', name: 'Chapter 15: The Burning of Tsutsu', chapterNumber: 15, implemented: false },
  {
    id: 'ch16',
    name: 'Chapter 16: The Man Who Filed Nothing',
    chapterNumber: 16,
    implemented: false,
  },
  { id: 'ch17', name: 'Chapter 17: The Fords of Sasu', chapterNumber: 17, implemented: false },
  { id: 'ch18', name: 'Chapter 18: Two Crowns', chapterNumber: 18, implemented: false },
  { id: 'ch19', name: 'Chapter 19: The Flame on Shiratake', chapterNumber: 19, implemented: false },
  {
    id: 'ch20',
    name: 'Chapter 20: The Wood That Was Never Cut',
    chapterNumber: 20,
    implemented: false,
  },
  { id: 'ch21', name: 'Chapter 21: The Forbidden Ground', chapterNumber: 21, implemented: false },
  { id: 'ch22', name: 'Chapter 22: Sworn Brothers', chapterNumber: 22, implemented: false },
  {
    id: 'ch23',
    name: 'Chapter 23: The Oath of Three Hundred',
    chapterNumber: 23,
    implemented: false,
  },
  { id: 'ch24', name: 'Chapter 24: The Cliffs of Are', chapterNumber: 24, implemented: false },
  { id: 'ch25', name: 'Final: The Sea Gate', chapterNumber: 25, implemented: false },
];
