import type { ChapterData } from '../../core/types';
import { CHAPTER_1 } from './chapter1';
import { CHAPTER_2 } from './chapter2';
import { CHAPTER_3 } from './chapter3';
import { CHAPTER_4 } from './chapter4';
import { CHAPTER_5 } from './chapter5';
import { CHAPTER_6 } from './chapter6';
import { CHAPTER_7 } from './chapter7';
import { CHAPTER_8 } from './chapter8';
import { CHAPTER_9 } from './chapter9';
import { CHAPTER_10 } from './chapter10';

export const CHAPTERS: Record<string, ChapterData> = {
  ch1: CHAPTER_1,
  ch2: CHAPTER_2,
  ch3: CHAPTER_3,
  ch4: CHAPTER_4,
  ch5: CHAPTER_5,
  ch6: CHAPTER_6,
  ch7: CHAPTER_7,
  ch8: CHAPTER_8,
  ch9: CHAPTER_9,
  ch10: CHAPTER_10,
};

export const CHAPTER_ORDER: string[] = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9', 'ch10'];
