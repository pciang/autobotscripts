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
	var App_Container = document.getElementById('hgAppContainer');

	var Settings_Box = document.createElement('div');

	App_Container.insertBefore(Settings_Box, App_Container.firstChild);

	Settings_Box.setAttribute('style', 'border-left: 1px inset #830300;'
			+ ' border-right: 1px inset #830300; border-top: 3px double #830300;'
			+ ' border-bottom: 3px double #830300; padding: 5px 0 5px;');

	Settings_Box.appendChild(document.createTextNode('MouseHunt EasterBot loaded!'));

	var Charge_Qty = document.getElementsByClassName("chargeQuantity")[0];

	var chargeQty = parseInt(Charge_Qty.textContent.substring(0, Charge_Qty.textContent.indexOf('/')));
	
	// hg.utils.TrapControl.setTrinket(item.type).go();
	// alert(hg);

	var eggchargeCharm = 'egg_charge_trinket';
	var eggstraCharm = 'eggstra_trinket';

	function listen() {
		// Workaround for arming charms
		if(chargeQty < 18) {
			hg.utils.TrapControl.setTrinket(eggchargeCharm).go();
		} else if(chargeQty >= 18) {
			hg.utils.TrapControl.setTrinket(eggstraCharm).go();
		}

		setTimeout(listen, 10000);
	}

	listen();
});