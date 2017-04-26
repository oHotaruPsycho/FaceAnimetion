//=============================================================================
// FaceAnimetion.js
//=============================================================================

/*:ja
 * v0.0.1
 * @plugindesc
 * 自作ゲージのメーターを増減する
 *
 * @author Declare War
 *
 * @param OutLine
 * @default 
 * @desc 外枠(img/system)
 *
 * @param InLine
 * @default 
 * @desc ゲージ(img/system)
 *
 * @param X
 * @default 0
 * @desc 出力X座標
 *
 * @param Y
 * @default 0
 * @desc 出力Y座標
 *
 * @param InLineMarginL
 * @default 0
 * @desc ゲージ余白
 *
 * @param InLineWidth
 * @default 0
 * @desc ゲージ横幅
 *
 * @param InLineHeight
 * @default 0
 * @desc ゲージ縦幅
 *
 * @param OutLineHeight
 * @default 0
 * @desc ゲージ外枠縦
 *
 * @param MaxGauge
 * @default 200
 * @desc ゲージ最大値
 *
 * @param Visible
 * @default true
 * @desc 表示状態
 *
 * @help ■概要
 * gaugeUpDownプラグインを利用するにはプラグインコマンドから実行します。
 * プラグインコマンドを実行すると会話中のSE効果を変更することが可能です。
 *
 * ■プラグインコマンド
 *   gaugeUpDown add [増減値] [表示状態] [アニメーション]                  	# ゲージを増減します
 */

//name space
// var faceAnimetion = faceAnimetion || (faceAnimetion = {});

var parseIntStrict = function(value) {
    var result = parseInt(value, 10);
    if (isNaN(result)) result = 0;
    return result;
};
    
// (function(faceAnimetion){
// 	var GaugeUpDown = (function(){
//              //constructor
//              function GaugeUpDown(){
//                  this.outLine = '';
//                  this.OutLineSprite = new Sprite();
//                  this.inLine = '';
//                  this.InLineSprite = new Sprite();
//                  this.x = 0;
//                  this.y = 0;
//                  this.inLineMarginL = 0;
//                  this.inLineWidth = 0;
//                  this.inLineHeight = 0;
//                  this.outLineHeight = 0;
//                  this.MaxGauge = 100;
//                 //1メモリのサイズ
//                 this.memory = 0;
//                 //現在のゲージ数
//                 this.curGauge = this.MaxGauge;
//                  this.visible = true;
//                  this._tr = null;
                 
//                  //増減する値たち
//                  this.upDown = 0;
//                  this.isMinus = false;
//                  this.isGaugeAnimation = false;
//                  this.doneGaugeAnimation = true;

//                  //上下移動判定
//                  this.isVisible = false;
//                  this.isVisibleAnimation = false;
//                  this.doneVisibleAnimation = true;
                 
                 
//                  this.initialize();
//              };
             
//              //member methods
//              GaugeUpDown.prototype.initialize = function(){
//                 this.parameters = PluginManager.parameters('GaugeUpDown');
//                 this.outLine = this.parameters['OutLine'] || '';
//                 this.inLine = this.parameters['InLine'] || '';
//                 this.x = parseIntStrict(this.parameters['X']) || 0;
//                 this.outLineHeight = parseIntStrict(this.parameters['OutLineHeight']) || 0;
//                 this.isVisible = eval(this.parameters['Visible']);
//                 if(this.isVisible){
//                     this.y = parseIntStrict(this.parameters['Y']) || 0;
//                 }else{
//                     this.y = -1 * outLineHeight;
//                 }
//                 this.inLineMarginL = parseIntStrict(this.parameters['InLineMarginL']) || 0;
//                 this.inLineWidth = parseIntStrict(this.parameters['InLineWidth']) || 0;
//                 this.inLineHeight = parseIntStrict(this.parameters['InLineHeight']) || 0;
//                 this.MaxGauge = parseIntStrict(this.parameters['MaxGauge']) || 0;
//                 this.visible = true;
//                  //1メモリのサイズ
//                 this.memory = (this.inLineWidth - this.inLineMarginL) / this.MaxGauge;
//                 //現在のゲージ数
//                 this.curGauge = this.MaxGauge;
//                 this.setOutLineSprite();
//                 this.setInLineSprite();
//              };
             
//              GaugeUpDown.prototype.setParameter = function(args){
//                  //parse
//                  if(args.length < 2){
//                      this._tr("setParameter: args is invalid.");
//                      return false;
//                  }
//                  if(args[0] =='visible'){
//                     this.isVisible = eval(args[1]);
//                     this.isVisibleAnimation = true;
//                 }else{
//                     this.upDown = Math.abs(parseIntStrict(args[1]));
//                     this.isMinus = (parseIntStrict(args[1]) < 0);
//                     this.isGaugeAnimation = true;
//                 }
//                  return true;
//              };
                          
//              GaugeUpDown.prototype.update = function(){
//                 if(this.isVisibleAnimation && this.doneGaugeAnimation){
//                     if(this.isVisible){
//                         //this.yまでSpriteを移動させる
//                         var vy = parseIntStrict(this.parameters['Y']);
//                         if(vy > this.y){
//                             this.doneVisibleAnimation = false;
//                             this.y += 1;
//                         }else{
//                             this.doneVisibleAnimation = true;
//                             this.isVisibleAnimation = false;
//                         }
//                     }else{
//                         //0-this.outLineHeightまで移動させる
//                         var vy = -1 * this.outLineHeight;
//                         if(vy < this.y){
//                             this.doneVisibleAnimation = false;
//                             this.y -= 1;
//                         }else{
//                             this.doneVisibleAnimation = true;
//                             this.isVisibleAnimation = false;
//                         }
//                     }
//                 }
//                 if(this.isGaugeAnimation && this.doneVisibleAnimation){
//                         //ゲージのアニメーションを行う
//                         if(this.upDown > 0){
//                             this.doneGaugeAnimation = false;
//                             this.upDown -= 1;
//                             var upper = 1;
//                             if(this.isMinus){
//                                 upper *= -1;
//                             }
//                             this.curGauge += upper;
//                             if(this.curGauge < 0) this.curGauge = 0;
//                             if(this.curGauge > this.MaxGauge) this.curGauge = this.MaxGauge;
//                         }else{
//                             this.doneGaugeAnimation = true;
//                             this.isGaugeAnimation = false;
//                         }
//                 }
//                 this.setOutLineSprite();
//                 this.setInLineSprite();
                                    
//                  return true;
//              };
             
//              GaugeUpDown.prototype.setOutLineSprite = function(){
//             	this.OutLineSprite.bitmap = ImageManager.loadSystem(this.outLine);
//             	this.OutLineSprite.x = this.x;
//             	this.OutLineSprite.y = this.y;
//                 this.OutLineSprite.visible = this.visible
//              };
//              GaugeUpDown.prototype.setInLineSprite = function(){
//             	this.InLineSprite.bitmap = ImageManager.loadSystem(this.inLine);
//             	this.InLineSprite.x = this.x;
//             	this.InLineSprite.y = this.y;
//                 this.InLineSprite.visible = this.visible
//     	        var gauge = this.curGauge * this.memory + this.inLineMarginL;
//     	        this.InLineSprite.setFrame(0, 0, gauge, this.inLineHeight);
//              };
             
//          return GaugeUpDown;
//      }
// )();
//  	faceAnimetion.GaugeUpDown = new GaugeUpDown();
//  }(faceAnimetion || (faceAnimetion = { }) ));

(function(){
	
 //-----------------------------------------------------------------------------
 // parse and dispatch plugin command
 //-----------------------------------------------------------------------------
 var _Game_Interpreter_pluginCommand =
     Game_Interpreter.prototype.pluginCommand;
     Game_Interpreter.prototype.pluginCommand = function(command, args){
        _Game_Interpreter_pluginCommand.call(this, command, args);
         if(command === 'FaceAnimetion'){
            var gUD = faceAnimetion.GaugeUpDown
            switch(args[0]){
            case 'set':
                //アニメーションの設定
                faceAnimetion.GaugeUpDown.setParameter(args);
                break;
            case 'start':
                //フェイスを表示する
                faceAnimetion.GaugeUpDown.setParameter(args);
                break;
            default:
               break;
            }
        }
    };

// 　var createUpper = Spriteset_Map.prototype.createUpperLayer;
// 	Spriteset_Map.prototype.createUpperLayer = function(){
// 		createUpper.call(this);
//     	this.addChild(faceAnimetion.GaugeUpDown.OutLineSprite);
//     	this.addChild(faceAnimetion.GaugeUpDown.InLineSprite);
//     	};

// 　var updt = Spriteset_Map.prototype.update;
// 	Spriteset_Map.prototype.update = function(){
// 		updt.call(this);
// 		faceAnimetion.GaugeUpDown.update();
		
// 	};
})();

var init = Window_Message.prototype.initMembers;

Window_Message.prototype.initMembers = function() {
    init.call(this);
    this._animetionWidth = 200;
    this._animetionHeight = 200;
    this._offsetX = 0;
    this._offsetY = 0;
    this._eyeAnimetionCnt = 0;
    this._mouthAnimetionCnt = 0;
    this._textstateOffsetX = 0;
};

Window_Message.prototype.windowHeight = function() {
    return this._animetionHeight > 0 ? this._animetionHeight : this.fittingHeight(this.numVisibleRows());
};

Window_Message.prototype.numVisibleRows = function() {
    return 4;
};

Window_Message.prototype.drawMessageFace = function() {
    this.drawFace($gameMessage.faceName(), /*$gameMessage.faceIndex()*/0, this._offsetX, this._offsetY, this._animetionWidth, this._animetionHeight);
};

Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = width;
    var ph = height;
    var sw = width;
    var sh = height;
    var dx = Math.floor(x);
    var dy = Math.floor(y);
    var sx = 0;
    var sy = Math.floor(faceIndex) * ph;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

Window_Message.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var w = this.width;
        var h = this.fittingHeight(this.numVisibleRows());
        var m = this.padding;
        var c1 = this.dimColor1();
        var c2 = this.dimColor2();
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};

// Window_Message.prototype.drawMessageFace = function() {
//     this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0);
// };