<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <link rel="icon" href="{{url('/favicon.ico')}}" type="image/x-icon" />
    <link rel="shortcut icon" href="{{url('/favicon.ico')}}" type="image/x-icon" />
    <meta name="description" content="福州一中 校园音乐征集">
    <meta name="keywords" content="福州一中,校园音乐,FZYZ,FZYZ SCAN">
    <link rel="stylesheet" href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
    html,body {
        margin: 0;
        width: 100%;
        height: 100%;
    }
    body {
        background-color: #f7fafc;
    }
    </style>
    <title>登录</title>
</head>
<body>
    <div id="app"></div>
    <script src="{{ url('/js/login.js') }}"></script>
    <canvas width="1080" height="1608"></canvas>
        <script>
            /*document.addEventListener('touchmove', function (e) {
                e.preventDefault()
            })*/
            var c = document.getElementsByTagName('canvas')[0],
                x = c.getContext('2d'),
                pr = window.devicePixelRatio || 1,
                w = window.innerWidth,
                h = window.innerHeight,
                f = 90,
                q,
                m = Math,
                r = 0,
                u = m.PI*2,
                v = m.cos,
                z = m.random
            c.width = w*pr
            c.height = h*pr
            x.scale(pr, pr)
            x.globalAlpha = 0.6
            function i(){
                x.clearRect(0,0,w,h)
                q=[{x:0,y:h*.7+f},{x:0,y:h*.7-f}]
                while(q[1].x<w+f) d(q[0], q[1])
            }
            function d(i,j){   
                x.beginPath()
                x.moveTo(i.x, i.y)
                x.lineTo(j.x, j.y)
                var k = j.x + (z()*2-0.25)*f,
                    n = y(j.y)
                x.lineTo(k, n)
                x.closePath()
                r-=u/-50
                x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16)
                x.fill()
                q[0] = q[1]
                q[1] = {x:k,y:n}
            }
            function y(p){
                var t = p + (z()*2-1.1)*f
                return (t>h||t<0) ? y(p) : t
            }
            document.onclick = i
            //document.ontouchstart = i
            i()
        </script>
</body>
</html>
