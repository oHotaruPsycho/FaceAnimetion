//=============================================================================
// FaceAnimation.js
//=============================================================================

/*:ja
 * v0.1.0
 * @plugindesc
 * 顔グラのアニメーションを行う
 *
 * @author オオホタルサイコ
 *
 * @param FaceIndex
 * @default 0
 * @desc 表示する顔グラのインデックス番号
 *
 * @param EyeAnmCnt
 * @default 4
 * @desc 目のアニメーション数
 *
 * @param MouthAnmCnt
 * @default 2
 * @desc 口のアニメーション数
 *
 * @param FaceWidth
 * @default 144
 * @desc 顔グラの横幅
 *
 * @param FaceHeight
 * @default 144
 * @desc 顔グラの縦幅
 *
 * @param OffsetX
 * @default 18
 * @desc 顔グラの調整X座標
 *
 * @param OffsetY
 * @default 0
 * @desc 顔グラの調整Y座標
 *
 * @param DispFace
 * @default 0
 * @desc 顔グラの表示場所
 *
 * @help
 * ■概要
 * FaceAnimationプラグインを利用するにはプラグインコマンドから実行します。
 * プラグインコマンドを実行すると会話中の顔グラの表示を変更することが可能です。
 * [FaceWidth] [FaceHeight] [offsetX] [offsetY]は省略可能
 *
 * ■プラグインコマンド
 *   FaceAnimation set [FaceIndex] [EyeAnmCnt] [MouthAnmCnt] 　　　　　　　　　　　　　　　　　　　　　　　　　　 　           # 顔グラを設定します
 *   FaceAnimation set [FaceIndex] [EyeAnmCnt] [MouthAnmCnt] [FaceWidth]                                 　           # 顔グラを設定します
 *   FaceAnimation set [FaceIndex] [EyeAnmCnt] [MouthAnmCnt] [FaceWidth] [FaceHeight]                    　           # 顔グラを設定します
 *   FaceAnimation set [FaceIndex] [EyeAnmCnt] [MouthAnmCnt] [FaceWidth] [FaceHeight] [OffsetX]          　           # 顔グラを設定します
 *   FaceAnimation set [FaceIndex] [EyeAnmCnt] [MouthAnmCnt] [FaceWidth] [FaceHeight] [OffsetX] [OffsetY]　           # 顔グラを設定します
 *   FaceAnimation set [FaceIndex] [EyeAnmCnt] [MouthAnmCnt] [FaceWidth] [FaceHeight] [OffsetX] [OffsetY]　[DispFace] # 顔グラを設定します
 *   FaceAnimation clear                                                   　　　　　                         # 初期設定状態に戻します
 */

//name space
var fcanm = fcanm || (fcanm = {});

(function(fcanm){
  var FaceAnimation = (function(){
    //constructor
    function FaceAnimation(){
    this.initialize();
    };

    //member methods
    FaceAnimation.prototype.initialize = function(){
      var parameters = PluginManager.parameters("FaceAnimation");
      this.faceIndex = Number(parameters["FaceIndex"] || 0);
      this.eyeAnmCnt = Number(parameters["EyeAnmCnt"] || 0);
      this.mouthAnmCnt = Number(parameters["MouthAnmCnt"] || 0);
      this.faceWidth = Number(parameters["FaceWidth"] || Window_Base._faceWidth);
      this.faceHeight = Number(parameters["FaceHeight"] || Window_Base._faceHeight);
      this.offsetX = Number(parameters["OffsetX"] || this.standardPadding());
      this.offsetY = Number(parameters["OffsetY"] || 0);
      this.dispFace = Number(parameters["DispFace"] || 0);
    };

    FaceAnimation.prototype.setParameter = function(args){
      //parse
      if(args.length < 4){
        this._tr("setParameter: args is invalid.");
        return false;
      }

      var parameters = PluginManager.parameters('FaceAnimation');
      this.faceIndex = Number(args[1]);
      this.eyeAnmCnt = Number(args[2]);
      this.mouthAnmCnt = Number(args[3]);
      this.faceWidth = Number(args[4] || this.faceWidth);
      this.faceHeight = Number(args[5] || this.faceHeight);
      this.offsetX = Number(args[6] || this.offsetX);
      this.offsetY = Number(args[7] || this.offsetY);
      this.dispFace = Number(args[8] || this.dispFace);

      return true;
    };

      return FaceAnimation;
    }
  )();

  FaceAnimation.prototype.clearParameter = function(){
    this.initialize();
  };
  fcanm.FaceAnimation = new FaceAnimation();
}(fcanm || (fcanm = { }) ));

(function(){
  //-----------------------------------------------------------------------------
	// parse and dispatch plugin command
	//-----------------------------------------------------------------------------
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args){
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if(command === 'FaceAnimation'){
			switch(args[0]){
				case 'set':
					fcanm.FaceAnimation.setParameter(args);
					break;
				case 'clear':
					fcanm.FaceAnimation.clearParameter();
					break;
					default:
				break;
			}
		}
	};


  var msgInit = Window_Message.prototype.initialize;
  Window_Message.prototype.initialize = function(){
    msgInit.call(this);
    fcanm.FaceAnimation.initialize();
    this._eyeAnimationFlg = false;
    this._faceSprite = new Sprite_Base();
    this._eyeSprite = new Sprite_Base();
    this._eyeCnt = 0;
    this._mouthSprite = new Sprite_Base();
    this.addChild(this._faceSprite);
    this.addChild(this._eyeSprite);
    this.addChild(this._mouthSprite);
  }

  Window_Message.prototype.newLineX = function() {
      return (fcanm.FaceAnimation.dispFace > 0 || $gameMessage.faceName() == "")  ? 0 : fcanm.FaceAnimation.faceWidth;
  };

	Window_Message.prototype.drawMessageFace = function() {
	    this.drawFace($gameMessage.faceName(), fcanm.FaceAnimation.faceIndex, 0, 0, fcanm.FaceAnimation.faceWidth, fcanm.FaceAnimation.faceHeight);
	};

	Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    this._eyeCnt = 0;
    this.procCnt = 0;
    this.cnt = 0;
    this._eyeAnimationFlg = false;
    this.eyeIndex = 0;
    this.mouthIndex = 1;
    if(faceName != ""){
      var bitmap = ImageManager.loadFace(faceName);
      width = (width > 0) ? width : Window_Base._faceWidth;
      height = (height > 0) ? height : Window_Base._faceHeight;
      var bitmap = ImageManager.loadFace(faceName);
      var sw = width;
      var sh = height;
      var dx = Math.floor(x);
      var dy = Math.floor(y);
      var sx = 0;
      var sy = Math.floor(faceIndex) * sh;
      // // EyeSprite
      var sx2 = sw;
      var sy2 = Math.floor(faceIndex) * sh;
      // // MouthSprite
      var sx3 = (fcanm.FaceAnimation.eyeAnmCnt + 1) * sw;
      var sy3 = Math.floor(faceIndex) * sh;
      this._faceSprite.bitmap = bitmap;
      this._faceSprite.setFrame(sx, sy, sw, sh);
      this._faceSprite.x = 0 + fcanm.FaceAnimation.offsetX;
      this._faceSprite.y = (Window_Base._faceHeight + this.lineHeight()/2) - height + fcanm.FaceAnimation.offsetY;
      this._eyeSprite.bitmap = bitmap;
      this._eyeSprite.setFrame(sx2, sy2, sw, sh);
      this._eyeSprite.x = 0 + fcanm.FaceAnimation.offsetX;
      this._eyeSprite.y = (Window_Base._faceHeight + this.lineHeight()/2) - height + fcanm.FaceAnimation.offsetY;
      this._mouthSprite.bitmap = bitmap;
      this._mouthSprite.setFrame(sx3, sy3, sw, sh);
      this._mouthSprite.x = 0 + fcanm.FaceAnimation.offsetX;
      this._mouthSprite.y = (Window_Base._faceHeight + this.lineHeight()/2) - height + fcanm.FaceAnimation.offsetY;
    }
  }

	Window_Message.prototype.drawFaceEye = function(faceName, faceIndex, eyeIndex, x, y, width, height) {
    if(this._eyeSprite.bitmap != null){
      width = (width > 0) ? width : Window_Base._faceWidth;
      height = (height > 0) ? height : Window_Base._faceHeight;
      var sw = width;
      var sh = height;
      var dx = Math.floor(x);
      var dy = Math.floor(y);
      var sx = (eyeIndex + 1) * sw;
      var sy = Math.floor(faceIndex) * sh;
      this._eyeSprite.setFrame(sx, sy, sw, sh);
    }
	};

	Window_Message.prototype.drawFaceMouth = function(faceName, faceIndex, mouthIndex, x, y, width, height) {
    if(this._mouthSprite.bitmap != null){
      width = (width > 0) ? width : Window_Base._faceWidth;
	    height = (height > 0) ? height : Window_Base._faceHeight;
	    var sw = width;
	    var sh = height;
	    var dx = Math.floor(x);
	    var dy = Math.floor(y);
	    var sx = (fcanm.FaceAnimation.eyeAnmCnt + mouthIndex + 1) * sw;
	    var sy = Math.floor(faceIndex) * sh;
      this._mouthSprite.setFrame(sx, sy, sw, sh);
    }
	};

  var msgUpd = Window_Message.prototype.update;
  Window_Message.prototype.update = function() {
    this.cnt = this.cnt + 1;
    if(!this._eyeAnimationFlg && Math.floor(Math.random() * (120 - 1 + 1) + 1) == 3){
      this._eyeAnimationFlg = true;
    }
    if(this._eyeAnimationFlg && this.cnt%10 == 0){
      if(this._eyeSprite.bitmap != null){
        this.eyeIndex = this.eyeIndex % fcanm.FaceAnimation.eyeAnmCnt;
        this.drawFaceEye($gameMessage.faceName(), fcanm.FaceAnimation.faceIndex, this.eyeIndex, this._faceSprite.x, this._faceSprite.y, this._faceSprite.width, this._faceSprite.height);
        this.eyeIndex = this.eyeIndex + 1;
        this._eyeCnt = this._eyeCnt + 1;
        if(this._eyeCnt == fcanm.FaceAnimation.eyeAnmCnt + 1){
          this._eyeAnimationFlg = false;
          this._eyeCnt = 0;
          this.eyeIndex = 0;
        }
      }
    }
    msgUpd.call(this);
  };

  var msgProcChara = Window_Message.prototype.processCharacter
  Window_Message.prototype.processCharacter = function(textState){
    msgProcChara.call(this, this._textState);
    this.procCnt = this.procCnt + 1;
    if(this.procCnt%5 == 0){
      if(this._mouthSprite.bitmap != null){
        this.mouthIndex = (this.mouthIndex + 1) % fcanm.FaceAnimation.mouthAnmCnt;
        this.drawFaceMouth($gameMessage.faceName(), fcanm.FaceAnimation.faceIndex, this.mouthIndex, this._faceSprite.x, this._faceSprite.y, this._faceSprite.width, this._faceSprite.height);
      }
    }
  };

  var msgClose = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() {
    this._faceSprite.bitmap = null;
    this._mouthSprite.bitmap = null;
    this._eyeSprite.bitmap = null;
    msgClose.call(this);
  };

})();
