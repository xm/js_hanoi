(function () {
  var Hanoi = window.Hanoi = (window.Hanoi || {});

  var UI = Hanoi.UI = function UI (game, $el) {
    this.game = game;
    this.$el = $el;
    this.numDiscs = this.game.numDiscs;
    this.selectedTower = null;
  };
  
  UI.TOWER_MARGIN = 10;
  UI.DISC_WIDTH = 30;
  UI.DISC_HEIGHT = 30;

  UI.prototype.play = function () {
    this.setUpHanoi();
    this.render();
    this.bindEvents();
  };
  
  UI.prototype.bindEvents = function () {
    var ui = this;
    
    $('.tower').click(function (event) {
      ui.clickTower(event);
    });
  };
  
  UI.prototype.clickTower = function (event) {
    if (this.game.isWon()) {
      this.error("the game is already over!");
      return;
    }
    
    this.clearText();
    
    var $tower = $(event.currentTarget);
    towerIdx = $tower.data("id");
    
    if (this.selectedTower === null) {
      this.selectedTower = towerIdx;
      $tower.addClass('selected');
    } else {
      if (!this.game.move(this.selectedTower, towerIdx)) {
        this.error("invalid move!");
      }
      
      $($('.tower')[this.selectedTower]).removeClass('selected');
      
      this.selectedTower = null;
      this.render();
      
      if (this.game.isWon()) {
        this.message("Congratulations, you win!");
      }
    }
  };
  
  UI.prototype.message = function (msg) {
    $('.message').text(msg);
    $('.message').show();
  };
  
  UI.prototype.error = function (msg) {
    $('.error').text("Error: " + msg);
    $('.error').show();
  };

  UI.prototype.clearText = function () {
    $('.error').text("");
    $('.error').hide();   
    $('.message').text("");
    $('.message').hide(); 
  };

  UI.prototype.setUpHanoi = function () {
    var towerWidth = UI.DISC_WIDTH * this.numDiscs;
    var towerHeight = (UI.DISC_HEIGHT * this.numDiscs) + 1;
    var hanoiWidth = 3 * ((UI.TOWER_MARGIN * 2) + towerWidth);
    
    this.$el.css('border-spacing', UI.TOWER_MARGIN);
    this.$el.css('height', towerHeight);
    this.$el.css('width', hanoiWidth);
    
    for (var i = 0; i < 3; i++) {
      var $tower = $('<div class="tower"></div>');
      $tower.data('id', i);
      this.$el.append($tower);
    }
    
    $('.tower').css('width', towerWidth);
    $('.tower').css('height', towerHeight);
    $('.tower').css('margin-right', UI.TOWER_MARGIN);
    $('.tower:last').css('margin-right', 0);
  };

  UI.prototype.render = function () {
    $('.tower').empty();
    for (var i = 0; i < 3; i++) {
      this.renderTower(i);
    }
  };

  UI.prototype.renderTower = function (towerIdx) {
    var $tower = $($('.tower')[towerIdx]);
    var discs = this.game.towers[towerIdx];
    
    for (var i = discs.length - 1; i >= 0; --i) {
      $tower.append('<div class="disc"></div>');
      $disc = $('.disc:last');
      $disc.width(UI.DISC_WIDTH * discs[i]);
    }
    
    $('.disc').css('height', UI.DISC_HEIGHT);
  };
})();
