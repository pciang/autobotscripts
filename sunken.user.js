// ==UserScript==
// @name        MouseHunt SunkenBot
// @author      Peter
// @version     1.0
// @description This script will automatically arm/disarm Empowered Anchor Charm
// @grant       none
// @include     http://mousehuntgame.com/*
// @include     https://mousehuntgame.com/*
// @include     http://www.mousehuntgame.com/*
// @include     https://www.mousehuntgame.com/*
// @include     http://apps.facebook.com/mousehunt/*
// @include     https://apps.facebook.com/mousehunt/*
// ==/UserScript==


document.addEventListener('DOMContentLoaded', function (arg) {
    var sunkenSettings,
        storageKey = 'sunkenbot_settings';

    if (localStorage.getItem(storageKey)) {
        sunkenSettings = JSON.parse(localStorage.getItem(storageKey));
    } else {
        sunkenSettings = {
            activate: true
        };
    }

    var App_Container = document.getElementById('hgAppContainer');

    var hudDom = document.getElementById('hudLocationContent');

    var Settings_Box = document.createElement('div');

    App_Container.insertBefore(Settings_Box, App_Container.firstChild);

    Settings_Box.setAttribute('style', 'border-top: 3px double #FC6;'
        + ' border-bottom: 3px double #FC6; padding: 5px 0 5px;');

    // Settings_Box content
    (function () {
        var div, temp, helpText;

        /* Line 1 */
        div = document.createElement('div');
        temp = document.createElement('a');
        temp.href = "https://github.com/pciang/AutobotScript";
        temp.textContent = "MouseHunt SunkenBot";
        temp.target = "_blank";
        temp.setAttribute("style", "font-weight: bold");
        div.appendChild(temp);

        Settings_Box.appendChild(div);


        /* Line 2 */
        div = document.createElement('div');

        temp = document.createElement('b');
        temp.appendChild(document.createTextNode('Auto arm Empowered Anchored Charm: '));
        div.appendChild(temp);

        temp = document.createElement('input');
        temp.setAttribute('type', 'checkbox');
        temp.checked = sunkenSettings.activate;
        temp.onchange = function (e) {
            sunkenSettings.activate = this.checked;
            localStorage.setItem(storageKey, JSON.stringify(sunkenSettings));
            if (sunkenSettings.activate) {
                listen();
            }
        };
        div.appendChild(temp);

        Settings_Box.appendChild(div);
    })();

    var loadedCharmId = 0;

    var anchorCharm = 'anchor_trinket';
    var anchorCharmId = 423;
    var anchorCharmQty = 0;

    var importantDOM = document.getElementsByClassName('zoneName')[0];
    var importantPattern = /dollar|pearl|treasure|oxygen/;

    function listen() {
        if(sunkenSettings.activate) {
            loadedCharmId = user.trinket_item_id;
            var exploring = importantDOM.textContent.toLowerCase();
            if(importantPattern.test(exploring)) {

                if(loadedCharmId != anchorCharmId) {
                    hg.utils.UserInventory.getItem(anchorCharm,
                        function (e) { anchorCharmQty = e.quantity; },
                        function (e) { console.log(e); }
                    );
                    if(anchorCharmQty > 0) {
                        hg.utils.TrapControl.setTrinket(anchorCharm).go();
                    }
                }
            } else if(loadedCharmId == anchorCharmId) {
                hg.utils.TrapControl.disarmTrinket().go();
            }
            setTimeout(listen, 10000);
        }
    }

    if(sunkenSettings.activate) {
        setTimeout(listen, 2000);
    }
});