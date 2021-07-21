import { Matcher } from '@commitlint/types';

const RELEASE_REGEX = new RegExp('Releas(e|ing) v?\\d+\\.\\d+\\.\\d+');

export const releases: Matcher = (commit: string) => RELEASE_REGEX.test(commit);
