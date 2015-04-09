// ==UserScript==
// @name        MouseHunt EasterBot
// @author      Peter
// @version     1.0
// @description This script will automatically switch between Eggstra charm and Eggscavator Charge charm.
// @grant       none
// @include     http://mousehuntgame.com/*
// @include     https://mousehuntgame.com/*
// @include     http://www.mousehuntgame.com/*
// @include     https://www.mousehuntgame.com/*
// @include     http://apps.facebook.com/mousehunt/*
// @include     https://apps.facebook.com/mousehunt/*
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function (arg) {
    var easterSettings,
        storageKey = 'easterbot_settings';

    if (localStorage.getItem(storageKey)) {
        easterSettings = JSON.parse(localStorage.getItem(storageKey));
    } else {
        easterSettings = {
            activate: true,
            useNewCharm: false
        };
    }

    var App_Container = document.getElementById('hgAppContainer');

    var Settings_Box = document.createElement('div');

    App_Container.insertBefore(Settings_Box, App_Container.firstChild);

    Settings_Box.setAttribute('style', 'border-top: 3px double #FC6;'
            + ' border-bottom: 3px double #FC6; padding: 5px 0 5px;');

    var Notice_Log = document.createElement('div');
    Notice_Log.setAttribute('style', 'color: #f90; font-size: 1.125em; display: none;');

    // Settings_Box content
    (function () {
        var div, temp;

        /* Line 1 */
        div = document.createElement('div');

        temp = document.createElement('b');
        temp.appendChild(document.createTextNode('MouseHunt EasterBot'));
        div.appendChild(temp);

        Settings_Box.appendChild(div);


        /* Line 2 */
        div = document.createElement('div');

        temp = document.createElement('b');
        temp.appendChild(document.createTextNode('Activate bot: '));
        div.appendChild(temp);

        temp = document.createElement('input');
        temp.setAttribute('type', 'checkbox');
        temp.checked = easterSettings.activate;
        temp.onchange = function (e) {
            easterSettings.activate = this.checked;
            localStorage.setItem(storageKey, JSON.stringify(easterSettings));
            if (easterSettings.activate) {
                listen();
            }
        };
        div.appendChild(temp);

        Settings_Box.appendChild(div);

        /* Line 3 */
        div = document.createElement('div');

        temp = document.createElement('b');
        temp.appendChild(document.createTextNode('Use Eggstra Charge Charm: '));
        div.appendChild(temp);

        temp = document.createElement('input');
        temp.setAttribute('type', 'checkbox');
        temp.checked = easterSettings.useNewCharm;
        temp.onchange = function (e) {
            easterSettings.useNewCharm = this.checked;
            localStorage.setItem(storageKey, JSON.stringify(easterSettings));
        };
        div.appendChild(temp);

        temp = document.createElement('i');
        temp.appendChild(document.createTextNode('(Swap between Eggstra Charge Charm (x2 egg + charge) & Eggstra Charm (x2 egg)!)'));
        div.appendChild(temp);

        Settings_Box.appendChild(div);

        /* Line 4 */
        Settings_Box.appendChild(Notice_Log);
    })();

    var Charge_Qty = document.getElementsByClassName("chargeQuantity")[0];

    var chargeQty = parseInt(Charge_Qty.textContent.substring(0, Charge_Qty.textContent.indexOf('/')));

    // hg.utils.TrapControl.setTrinket(item.type).go();
    // alert(hg);

    var loadedCharmId = 0;

    var eggchargeCharm = 'egg_charge_trinket';
    var eggchargeCharmId = 1164;
    var eggchargeCharmQty = 0;

    var eggstraCharm = 'eggstra_trinket';
    var eggstraCharmId = 851;
    var eggstraCharmQty = 0;

    var newCharm = 'eggstra_charge_trinket';
    var newCharmId = 1714;
    var newCharmQty = 0;

    hg.utils.UserInventory.getItem(eggchargeCharm,
        function (e) { eggchargeCharmQty = e.quantity; },
        function (e) { console.log(e); }
    );
    hg.utils.UserInventory.getItem(eggstraCharm,
        function (e) { eggstraCharmQty = e.quantity; },
        function (e) { console.log(e); }
    );
    hg.utils.UserInventory.getItem(newCharm,
        function (e) { newCharmQty = e.quantity; },
        function (e) { console.log(e); }
    );

    function listen() {
        console.log("Checking...");
        // If bot is allowed to activate
        if (easterSettings.activate) {
            loadedCharmId = user.trinket_item_id;
            chargeQty = parseInt(Charge_Qty.textContent.substring(0, Charge_Qty.textContent.indexOf('/')), 10);

            // If user is in camp
            if (window.location.href == "http://www.mousehuntgame.com/"
                    || window.location.href == "http://www.mousehuntgame.com/#"
                    || window.location.href == "http://www.mousehuntgame.com/?switch_to=standard"
                    || window.location.href == "https://www.mousehuntgame.com/"
                    || window.location.href == "https://www.mousehuntgame.com/#"
                    || window.location.href == "https://www.mousehuntgame.com/?switch_to=standard"
                    || window.location.href.indexOf("mousehuntgame.com/turn.php") != -1
                    || window.location.href.indexOf("mousehuntgame.com/index.php") != -1
                    || window.location.href.indexOf("mousehuntgame.com/canvas/index.php") != -1
                    || window.location.href.indexOf("mousehuntgame.com/canvas/turn.php") != -1
                    || window.location.href.indexOf("mousehuntgame.com/canvas/?") != -1) {
                // Workaround for arming charms
                if (chargeQty < 19) {
                    // Use new charm
                    if (easterSettings.useNewCharm && loadedCharmId !== newCharmId && newCharmQty > 0) {
                        hg.utils.TrapControl.setTrinket(newCharm).go();
                        console.log("Changed to Eggscavator Charge Charm!");
                    // Use Eggscavator Charge Charm
                    } else if ((newCharmQty === 0 || !easterSettings.useNewCharm) && loadedCharmId !== eggchargeCharmId && eggchargeCharmQty > 0) {
                        hg.utils.TrapControl.setTrinket(eggchargeCharm).go();
                        console.log("Changed to Eggstra Charge Charm!");
                    }
                // Use Eggstra charm
                } else if (chargeQty >= 19 && loadedCharmId !== eggstraCharmId && eggstraCharmQty > 0) {
                    hg.utils.TrapControl.setTrinket(eggstraCharm).go();
                    console.log("Changed to Eggstra Charge Charm!");
                }
            } else {
                Notice_Log.style.display = 'block';
                Notice_Log.textContent = 'EasterBot is automatically deactivated when Hunter is not in Camp.';
            }
            setTimeout(listen, 10000);
        }

    }

    if (easterSettings.activate) {
        setTimeout(listen, 2000);
    }
});
