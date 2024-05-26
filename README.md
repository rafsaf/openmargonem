# openmargonem
Free and open source margonem scripts under GNU AGPLv3.

Goals:
- No 3-party links to other sites, all code in user script
- No code obfuscation and minification
- Clear license

## AutoHeal

Heals after every battle. Adds new addon in game addons tab. Implements [Greedy algorithm](https://en.wikipedia.org/wiki/Greedy_algorithm), first using equally (whichever fits better) normal and percentage potions, only then full potions.

![Autoheal.png](https://raw.githubusercontent.com/rafsaf/openmargonem/main/images/Autoheal.png)

## Development

Feel free to use this code under LICENSE. 

To add new addon:

- create new file, use `autoheal.ts` as a base.
- new addon should implement `Addon` interface (note `Install` and `Uninstall`) and be created with `AddonCreate(...)` at some point in main script function in `index.ts`, it should be generic enough.
- `npm run build` creates files in public folder which is gitignored, try running those.