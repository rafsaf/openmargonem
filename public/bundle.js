var a=()=>document.querySelector('[tip-id="296"], [index="0"]'),s=()=>document.getElementsByClassName("addons-panel")[0].getElementsByClassName("addon-list")[0],c=()=>document.getElementsByClassName("addons-panel")[0].getElementsByClassName("scroll-pane")[0],l=(d,n,e)=>{let t=document.createElement("div");return t.append(p(e=e),r(n=n)),t.classList.add("one-addon-on-list","addon-on-list-".concat(d)),t},r=d=>{let n=document.createElement("div"),e=document.createElement("div"),t=document.createTextNode(d);return e.appendChild(t),e.classList.add("addon-title"),n.classList.add("title-wrapper"),n},p=d=>{let n=document.createElement("div"),e=document.createElement("div"),t=document.createElement("div");return e.appendChild(t),n.appendChild(n),t.classList.add("addon-img","icon"),t.setAttribute("style",'background: url("/img/gui/addons-icons.png?v=1715672874201") -376px -34px;'),e.classList.add("widget-button","no-hover"),d?e.classList.add("green"):e.classList.add("red"),n.classList.add("img-wrapper"),n},i=(d,n)=>{let e=document.createElement("div"),t=document.createElement("div"),o=document.createElement("div");return t.classList.add("description-label"),t.setAttribute("data-trans","#description#extManager"),t.appendChild(document.createTextNode("Opis: ")),o.classList.add("description-text"),o.appendChild(document.createTextNode(n)),e.classList.add("one-addon-description","desc-".concat(d)),e.setAttribute("style","display: none;"),e.append(m(),t,o),e},m=()=>{let d=document.createElement("div"),n=document.createElement("div"),e=document.createElement("div"),t=document.createElement("div"),o=document.createTextNode("W\u0142\u0105cz");return t.appendChild(o),n.append(e,t),d.append(n),d.classList.add("on-off-button"),n.classList.add("button","green","small"),e.classList.add("background"),t.classList.add("label"),d};var u=async()=>{console.log("start OpenMargonemClientSetup"),window.addEventListener("load",function(){a().addEventListener("click",()=>{console.log("event!"),s().appendChild(l(21031123123,"OM AutoHeal",!1)),c().append(i(21031123123,"Open Margonem AutoHeal"))})},!1)};u();
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
