// ==UserScript==
// @name        MouseHunt LGBot
// @author      Peter
// @version     1.0
// @description If activated, this script will automatically arms Grubling Chow Charm during stampede.
// @grant       none
// @include     http://mousehuntgame.com/*
// @include     https://mousehuntgame.com/*
// @include     http://www.mousehuntgame.com/*
// @include     https://www.mousehuntgame.com/*
// @include     http://apps.facebook.com/mousehunt/*
// @include     https://apps.facebook.com/mousehunt/*
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
	var
		settings,
		settingsKey = 'lg_bot',
		loopDelayMs = 30000;

	if(localStorage.getItem(settingsKey)) {
		settings = JSON.parse(localStorage.getItem(settingsKey));
	} else {
		settings = {
			sand_dunes: true,
			lost_city: true,
			cursed_city: true
		};
	}

    var App_Container = document.getElementById('hgAppContainer');

    var hudDom = document.getElementById('hudLocationContent');

    var Settings_Box = document.createElement('div');

    App_Container.insertBefore(Settings_Box, App_Container.firstChild);

    Settings_Box.setAttribute('style', 'border-top: 3px double #FC6;'
    	+ ' border-bottom: 3px double #FC6; padding: 5px 0 5px;');

	// Initialization
	(function () {
        var div, temp;

        /* Line 1 */
        div = document.createElement('div');
        temp = document.createElement('a');
        temp.href = "https://github.com/pciang/AutobotScript";
        temp.textContent = "MouseHunt LGBot";
        temp.target = "_blank";
        temp.setAttribute("style", "font-weight: bold");
        div.appendChild(temp);

        Settings_Box.appendChild(div);

        /* Line 2 */
        div = document.createElement('div');

        temp = document.createElement('b');
        temp.appendChild(document.createTextNode('Sand Dunes: '));
        div.appendChild(temp);

        temp = document.createElement('input');
        temp.setAttribute('type', 'checkbox');
        temp.checked = settings.sand_dunes;
        temp.onchange = function (e) {
            settings.sand_dunes = this.checked;
            localStorage.setItem(settingsKey, JSON.stringify(settings));
        };
        div.appendChild(temp);

        temp = document.createElement('i');
        temp.appendChild(document.createTextNode('(auto arm Grubling charm)'));
        div.appendChild(temp);

        Settings_Box.appendChild(div);

        /* Line 3 */
        div = document.createElement('div');

        temp = document.createElement('b');
        temp.appendChild(document.createTextNode('Lost City: '));
        div.appendChild(temp);

        temp = document.createElement('input');
        temp.setAttribute('type', 'checkbox');
        temp.checked = settings.lost_city;
        temp.onchange = function (e) {
            settings.lost_city = this.checked;
            localStorage.setItem(settingsKey, JSON.stringify(settings));
        };
        div.appendChild(temp);

        temp = document.createElement('i');
        temp.appendChild(document.createTextNode('(auto arm Searcher charm)'));
        div.appendChild(temp);

        Settings_Box.appendChild(div);

        /* Line 4 */
        div = document.createElement('div');

        temp = document.createElement('b');
        temp.appendChild(document.createTextNode('Cursed City: '));
        div.appendChild(temp);

        temp = document.createElement('input');
        temp.setAttribute('type', 'checkbox');
        temp.checked = settings.cursed_city;
        temp.onchange = function (e) {
            settings.cursed_city = this.checked;
            localStorage.setItem(settingsKey, JSON.stringify(settings));
        };
        div.appendChild(temp);

        temp = document.createElement('i');
        temp.appendChild(document.createTextNode('(auto remove all curses, provided that user has enough charm)'));
        div.appendChild(temp);

        Settings_Box.appendChild(div);
	}());

	var grublingQty = 0;
	var grublingCharm = 'grubling_chow_trinket';
	var grublingId = 1016;

	var searcherQty = 0;
	var searcherCharm = 'searcher_trinket';
	var searcherId = 1018;

	var CURSE_MINIGAME = {
		fear: {
			charm: 'bravery_trinket',
			charmId: 1011,
			charmQty: 0,
			domSelector: '.curse.fear.active'
		},
		darkness: {
			charm: 'shiny_trinket',
			charmId: 1019,
			charmQty: 0,
			domSelector: '.curse.darkness.active'
		},
		mist: {
			charm: 'clarity_trinket',
			charmId: 1012,
			charmQty: 0,
			domSelector: '.curse.mist.active'
		}
	};

	function listen() {
		if(settings.sand_duens) {
			var
				_ = hudDom.querySelector('.hasStampede');

			if(_) {
			    hg.utils.UserInventory.getItem(grublingCharm,
			        function (e) {
			        	grublingQty = e.quantity;
			        },
			        function () {}
			    );

				// If stampede and have enough charm
				if(grublingQty > 0) {
					if(user.trinket_item_id != grublingId) {
						hg.utils.TrapControl.setTrinket(grublingCharm).go();
					} else {
						// Charm armed, do nothing
					}
				}
			// If not stampede
			} else if(!_) {
				if(user.trinket_item_id == grublingId) {
					hg.utils.TrapControl.disarmTrinket().go();
				} else {
					// Do nothing
				}
			}
		}
		if(settings.lost_city) {
			var
				_ = hudDom.querySelector('.curse.active');

			if(_ && _.scrollHeight > 0) {
			    hg.utils.UserInventory.getItem(searcherCharm,
			        function (e) {
			        	searcherQty = e.quantity;
			        },
			        function () {}
			    );

				// If cursed and have enough charm
				if(searcherQty > 0) {
					if(user.trinket_item_id != searcherId) {
						hg.utils.TrapControl.setTrinket(searcherCharm).go();
					} else {
						// Charm armed, do nothing
					}
				}
			// If not cursed
			} else if(!_ || _.scrollHeight == 0) {
				if(user.trinket_item_id == searcherId) {
					hg.utils.TrapControl.disarmTrinket().go();
				} else {
					// Do nothing
				}
			}
		}
		if(settings.cursed_city) {
			// AFAIK, these get quantity functions do not send any request to server

		    hg.utils.UserInventory.getItem(CURSE_MINIGAME.fear.charmId,
		        function (e) {
		        	CURSE_MINIGAME.fear.charmQty = e.quantity;
		        },
		        function () {}
		    );

		    hg.utils.UserInventory.getItem(CURSE_MINIGAME.darkness.charmId,
		        function (e) {
		        	CURSE_MINIGAME.darkness.charmQty = e.quantity;
		        },
		        function () {}
		    );

		    hg.utils.UserInventory.getItem(CURSE_MINIGAME.mist.charmId,
		        function (e) {
		        	CURSE_MINIGAME.mist.charmQty = e.quantity;
		        },
		        function () {}
		    );

			// If hunter is feared by the curse
			if(document.querySelector(CURSE_MINIGAME.fear.domSelector) != null && CURSE_MINIGAME.fear.charmQty > 0) {
				if(user.trinket_item_id != CURSE_MINIGAME.fear.charmId) {
					hg.utils.TrapControl.setTrinket(CURSE_MINIGAME.fear.charm).go();
				} else {
					// Charm armed, do nothing
				}
			// If hunter finds oneself in the darkness
			} else if(document.querySelector(CURSE_MINIGAME.darkness.domSelector) != null && CURSE_MINIGAME.darkness.charmQty > 0) {
				if(user.trinket_item_id != CURSE_MINIGAME.darkness.charmId) {
					hg.utils.TrapControl.setTrinket(CURSE_MINIGAME.darkness.charm).go();
				} else {
					// Charm armed, do nothing
				}
			// If hunter is shrouded by mist
			} else if(document.querySelector(CURSE_MINIGAME.mist.domSelector) != null && CURSE_MINIGAME.mist.charmQty > 0) {
				if(user.trinket_item_id != CURSE_MINIGAME.mist.charmId) {
					hg.utils.TrapControl.setTrinket(CURSE_MINIGAME.mist.charm).go();
				} else {
					// Charm armed, do nothing
				}
			}
		}
		setTimeout(listen, loopDelayMs);
	}

	setTimeout(listen, 2000);
});