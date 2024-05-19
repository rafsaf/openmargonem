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

Source code: https://github.com/rafsaf/openmargonem
*/
interface MargonemEngine {
  addonsPanel: AddonsPanel;
}

interface AddonsPanel {
  createOneAddonOnList: (data: object, addonId: string) => void;
  createOneAddonDescription: (data: object, addonId: string) => void;
  setButtonState: (id: string, active: boolean) => void;
  setWindgetColor: (id: string, active: boolean) => void;
  getStorageStateOfAddon: (id: string) => boolean;
  getAddonIdKey: (id: string) => string;
  setStateAddon: (
    data: object,
    active: boolean,
    id: string,
    p1: any,
    p2: any
  ) => void;
  startAddonScript: (
    data: object,
    id: string,
    active: boolean,
    p1: any
  ) => void;
}

var Engine: MargonemEngine;
// get language
var _l: () => string;
