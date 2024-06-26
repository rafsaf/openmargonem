/*
openmargonem  
Copyright (C) 2024  Rafał Safin <rafal.safin@rafsaf.pl>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
interface MargonemEngine {
  addonsPanel: AddonsPanel;
  hero: Hero;
  items: Items;
  dead: boolean;
}

interface MargonemAPI {
  addCallbackToEvent: (event: string, callback: Function) => void;
  removeCallbackFromEvent: (event: string, callback: Function) => void;
}

interface Items {
  fetchLocationItems: (type: string) => Item[];
}
interface Item {
  id: string;
  name: string;
  _cachedStats: ItemStats;
}

interface ItemStats {
  // usually available but for fullheal potions it is undefined
  amount: string | undefined;
  // normal healing potions eg. 5000 hp
  leczy: string | undefined;
  // percentage healing potions eg. always 15% hp
  perheal: string | undefined;
  // full hp healing potion eg. 100k hp potion
  fullheal: string | undefined;
}

interface Hero {
  d: WarriorData;
}

interface WarriorData {
  warrior_stats: WarriorStats;
}
interface WarriorStats {
  hp: number;
  maxhp: number;
}
interface AddonsPanel {
  createOneAddonOnList: (data: object, addonId: string) => void;
  createOneAddonDescription: (data: object, addonId: string) => void;
  setButtonState: (id: string, active: boolean) => void;
  setWindgetColor: (id: string, active: boolean) => void;
  getStorageStateOfAddon: (id: string) => boolean;
  getAddonIdKey: (id: string) => string;
  setStateAddon: (data: any, active: boolean, id: string, p1: any, p2: any) => void;
  startAddonScript: (data: any, id: string, active: boolean, p1: any) => void;
}

var Engine: MargonemEngine;
var API: MargonemAPI;
// get language
var _l: () => string;
// to run tasks?
var _g: (cmd: string) => void;
