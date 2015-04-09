// ==UserScript==
// @name        MouseHunt EasterBot
// @author      Peter
// @version    	1.0
// @description This script will automatically switch between Eggstra charm and Eggscavator Charge charm.
// @grant		none
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function (arg) {
	var easterSettings;
	var storageKey = 'easterbot_settings';

	if(localStorage.getItem(storageKey)) {
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

	Settings_Box.setAttribute('style', 'border-left: 1px inset #830300;'
			+ ' border-right: 1px inset #830300; border-top: 3px double #830300;'
			+ ' border-bottom: 3px double #830300; padding: 5px 0 5px;');

	// Settings_Box content
	(function () {
		var div;
		var temp;

		/* Line 1 */
		div = document.createElement('div');
		div.appendChild(document.createTextNode('MouseHunt EasterBot loaded!'));
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
		};
		div.appendChild(temp);

		Settings_Box.appendChild(div);

		/* Line 3 */
		div = document.createElement('div');

		temp = document.createElement('b');
		temp.appendChild(document.createTextNode('!!Not working yet!!: '));
		div.appendChild(temp);

		temp = document.createElement('input');
		temp.setAttribute('type', 'checkbox');
		temp.checked = easterSettings.useNewCharm;
		temp.onchange = function (e) {
			easterSettings.useNewCharm = this.checked;
		};
		div.appendChild(temp);

		temp = document.createElement('i');
		temp.appendChild(document.createTextNode('(Enabling this will allow swapping between Eggstra Charge Charm & Eggstra Charm!)'));
		div.appendChild(temp);

		Settings_Box.appendChild(div);

		/* Line 4 */
		div = document.createElement('div');

		temp = document.createElement('button');
		temp.appendChild(document.createTextNode('Save'));
		temp.onclick = function (e) {
			console.log(JSON.stringify(easterSettings));
			localStorage.setItem(storageKey, JSON.stringify(easterSettings));
		};
		div.appendChild(temp);

		Settings_Box.appendChild(div);
	})();

	var Charge_Qty = document.getElementsByClassName("chargeQuantity")[0];

	var chargeQty = parseInt(Charge_Qty.textContent.substring(0, Charge_Qty.textContent.indexOf('/')));
	
	// hg.utils.TrapControl.setTrinket(item.type).go();
	// alert(hg);

	var loadedCharm = '';
	var eggchargeCharm = 'egg_charge_trinket';
	var eggstraCharm = 'eggstra_trinket';
	var newCharm = 'eggstra_charge_trinket';

	// Initialization
	(function () {
		if(chargeQty < 20) {
			hg.utils.TrapControl.setTrinket(eggchargeCharm).go();
		} else if(chargeQty == 20) {
			hg.utils.TrapControl.setTrinket(eggstraCharm).go();
		}
	})();

	function listen() {
		chargeQty = parseInt(Charge_Qty.textContent.substring(0, Charge_Qty.textContent.indexOf('/')));
		
		// If bot is allowed to activate
		if(easterSettings.activate) {
			// Workaround for arming charms
			if(chargeQty < 18 && loadedCharm !== eggchargeCharm) {
				hg.utils.TrapControl.setTrinket(loadedCharm = eggchargeCharm).go();
			} else if(chargeQty == 20 && loadedCharm !== eggstraCharm) {
				hg.utils.TrapControl.setTrinket(loadedCharm = eggstraCharm).go();
			}
		}

		setTimeout(listen, 10000);
	}

	alert('EasterBot script successfully loaded!');
	listen();
});