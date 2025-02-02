var getGVerify = function (id) {
    function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
        this.options = { //默认options参数值
            id: "", //容器Id
            canvasId: "verifyCanvas", //canvas的ID
            width: "100", //默认canvas宽度
            height: "30", //默认canvas高度
            type: "blend", //图形验证码默认类型blend:数字字母混合类型
            code: ""
        }

        if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
            for(var i in options) { //根据传入的参数，修改默认参数值
                this.options[i] = options[i];
            }
        }
        else{
            this.options.id = options;
        }

        this.options.numArr = getAllNumber();
        this.options.letterArr = getAllLetter();

        this._init();
        this.refresh();
    }

    GVerify.prototype = {
        /**版本号**/
        version: '2.1.0',

        /**初始化方法**/
        _init: function() {
            var con = document.getElementById(this.options.id);
            var canvas = document.createElement("canvas");
            canvas.id = this.options.canvasId;
            canvas.width = this.options.width;
            canvas.height = this.options.height;
            canvas.title = '点击更换验证码';
            canvas.style.cursor = "pointer";
            canvas.innerHTML = "您的浏览器版本不支持canvas";
            con.appendChild(canvas);
            var parent = this;
            canvas.onclick = function(){
              parent.refresh();
            }
        },

        /**生成验证码**/
        refresh: function() {
            this.options.code = '';
            var canvas = document.getElementById(this.options.canvasId);
            if(canvas.getContext) {
                var ctx = canvas.getContext('2d');
            }

            ctx.textBaseline = "middle";
            ctx.fillStyle = randomColor(180, 240);
            ctx.fillRect(0, 0, this.options.width, this.options.height);

            /*验证码长度为4*/
            var txtArr = new Array(4);
            /*方法一：后台获取验证码*/
            /*var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    txtArr = xhr.responseText.split(","); //返回如: a,b,c,d
                }
            }
            xhr.open('get', '/signin/getVerifyCode', false); //同步

            /*方法二：前端直接生成验证码*/
            var codeLetter = getAllNumber().concat(getAllLetter());
            for(var i = 0; i < 4; i++){
                txtArr[i] = codeLetter[Math.floor(Math.random() * codeLetter.length)];
            }
            for(var i = 1; i <= 4; i++) {
                //选取
                var txt = txtArr[i-1];
                this.options.code += txt;

                //设置字体大小
                ctx.font = '30px SimHei';
                //ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei';

                //随机生成字体颜色
                ctx.fillStyle = randomColor(50, 160);
                ctx.shadowBlur = randomNum(-3, 3);
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";

                /**设置旋转角度和坐标原点**/
                var x = this.options.width / 5 * i;
                var y = this.options.height / 2;
                var deg = randomNum(-30, 30);
                ctx.translate(x, y);
                ctx.rotate(deg * Math.PI / 180);
                ctx.fillText(txt, 0, 0);
                /**恢复旋转角度和坐标原点**/
                ctx.rotate(-deg * Math.PI / 180);
                ctx.translate(-x, -y);
            }
            /**绘制干扰线**/
            for(var i = 0; i < 4; i++) {
                ctx.strokeStyle = randomColor(40, 180);
                ctx.beginPath();
                ctx.moveTo(randomNum(0, this.options.width/2),
                           randomNum(0, this.options.height/2));
                ctx.lineTo(randomNum(0, this.options.width/2), 
                           randomNum(0, this.options.height));
                ctx.stroke();
            }
            /**绘制干扰点**/
            for(var i = 0; i < this.options.width/4; i++) {
                ctx.fillStyle = randomColor(0, 255);
                ctx.beginPath();
                ctx.arc(randomNum(0, this.options.width), 
                        randomNum(0, this.options.height), 
                        1, 
                        0, 
                        2 * Math.PI);
                ctx.fill();
            }
        },

        /**验证验证码**/
        validate: function(code){
            var verifyCode = code.toLowerCase();
            var v_code = this.options.code.toLowerCase();
            return verifyCode == v_code;
        }
    }
    /**生成数字数组**/
    function getAllNumber() {
        return "0,1,2,3,4,5,6,7,8,9".split(",");
    }
    /**生成字母数组**/
    function getAllLetter() {
        var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,\
        C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        return letterStr.split(",");
    }
    /**生成一个随机数**/
    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**生成一个随机色**/
    function randomColor(min, max) {
        var r = randomNum(min, max);
        var g = randomNum(min, max);
        var b = randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    return new GVerify(id);
}

export {
    getGVerify
}