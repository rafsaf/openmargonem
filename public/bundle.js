var o="openmargonem",g=()=>{console.log("start OpenMargonemClientRun");var e={pl:{name:"Autoheal",description:'Autoheal <b>test</b> <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"><label for="vehicle1"> I have a bike</label><br>'},en:{name:"Autoheal",description:'Autoheal <b>test</b> <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"><label for="vehicle1"> I have a bike</label><br>'},image:"/img/gui/addons-icons.png|-376 -34",options:0,id:"openmargonem-1"};window.Engine.addonsPanel.createOneAddonOnList(e,e.id),window.Engine.addonsPanel.createOneAddonDescription(e,e.id),window.Engine.addonsPanel.setButtonState(e.id,!0),window.Engine.addonsPanel.setWindgetColor(e.id,!0);let i=window.Engine.addonsPanel.getStorageStateOfAddon;window.Engine.addonsPanel.getStorageStateOfAddon=n=>n.startsWith(o)?localStorage.getItem("OpenMargonemClientRun-".concat(o,"-").concat(n,"-active"))!==null:i(n);let d=window.Engine.addonsPanel.setStateAddon;window.Engine.addonsPanel.setStateAddon=(n,t,a,l,r)=>(a.startsWith(o)&&(t?localStorage.setItem("OpenMargonemClientRun-".concat(o,"-").concat(a,"-active"),"1"):localStorage.removeItem("OpenMargonemClientRun-".concat(o,"-").concat(a,"-active")),window.Engine.addonsPanel.setButtonState(e.id,t),window.Engine.addonsPanel.setWindgetColor(e.id,t)),d(n,t,a,l,r))},s=setInterval(function(){if(typeof window.Engine>"u"){console.log("OpenMargonemClientSetup - Engine undefined");return}if(!("addonsPanel"in window.Engine)){console.log("OpenMargonemClientSetup - Engine.addonsPanel undefined");return}if(window.Engine.addonsPanel===null){console.log("OpenMargonemClientSetup - Engine.addonsPanel undefined");return}clearInterval(s),g()},100);
/*!
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
//!
