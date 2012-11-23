var ws;
var SocketCreated = false;
var isUserloggedout = false;

function lockOn(str) {
    var lock = document.getElementById('skm_LockPane');
    if (lock)
        lock.className = 'LockOn';
    lock.innerHTML = str;
}

function lockOff() {
    var lock = document.getElementById('skm_LockPane');
    lock.className = 'LockOff';
}

function ToggleConnectionClicked() {
    if (SocketCreated && (ws.readyState == 0 || ws.readyState == 1)) {
        lockOn("离开聊天室...");
        SocketCreated = false;
        isUserloggedout = true;
        ws.close();
    } else {
        lockOn("进入聊天室...");
        Log("准备连接到聊天服务器 ...");
        try {
            if ("WebSocket" in window) {
                ws = new WebSocket("ws://" + document.getElementById("Connection").value);
            }
            else if ("MozWebSocket" in window) {
                ws = new MozWebSocket("ws://" + document.getElementById("Connection").value);
            }

            SocketCreated = true;
            isUserloggedout = false;
        } catch (ex) {
            Log(ex, "ERROR");
            return;
        }
        document.getElementById("ToggleConnection").innerHTML = "断开";
        ws.onopen = WSonOpen;
        ws.onmessage = WSonMessage;
        ws.onclose = WSonClose;
        ws.onerror = WSonError;
    }
}
;


function WSonOpen() {
    lockOff();
    Log("连接已经建立。", "OK");
    $("#SendDataContainer").show();
    var uname=  document.getElementById("txtName").value;
    ws.send("login:" + uname);
    store.set('c_user_name',uname);
}
;

function WSonMessage(event) {
    console.log(event.data);
     //if (_.isJson(event.data)) {
        var msg = JSON.parse(event.data);
        if (msg.TypeId == "2")
            UserList(msg.UserName);
        if(msg.TypeId=="1"){
              Log(msg.MessageContent,store.get('c_user_name')===msg.FromName?"_MYSELF":"_OTHER");
        }
    // }

}
;

function WSonClose() {
    lockOff();
    if (isUserloggedout)
        Log("【" + document.getElementById("txtName").value + "】离开了聊天室！");
    document.getElementById("ToggleConnection").innerHTML = "连接";
    $("#SendDataContainer").hide();
}
;

function WSonError() {
    lockOff();
    Log("远程连接中断。", "ERROR");
}
;


function SendDataClicked() {
    //var val = CKEDITOR.instances.DataToSend.getData();

    ws.send(document.getElementById("txtName").value + "说 :\"" + document.getElementById("DataToSend").value + "\"");
    document.getElementById("DataToSend").value = "";
    //CKEDITOR.tools.callFunction(12, this); return false;

}
;

function UserList(users) {
    var container = document.getElementById("UserContainer");
    container.innerHTML="";
    for (var i = 0; i < users.length; i++) {
        var nDiv = document.createElement("span");
        nDiv.innerHTML = "<a href='javascript:void(0);' >" + users[i] + "</a> <br /> ";

        container.appendChild(nDiv);
    }
}
;
function Log(Text, MessageType) {
    if (MessageType == "OK") Text = "<span style='color: green;'>" + Text + "</span>";
    if (MessageType == "ERROR") Text = "<span style='color: yellow;'>" + Text + "</span>";
    if (MessageType == "_MYSELF") Text = "<span style='color: red;'>" + Text + "</span>";

    var nDiv = document.createElement("span");
    nDiv.innerHTML = Text + "<br />";
    document.getElementById("LogContainer").appendChild(nDiv);
    //document.getElementById("LogContainer").innerHTML = document.getElementById("LogContainer").innerHTML + Text + "<br />";
    var LogContainer = document.getElementById("LogContainer");
    LogContainer.scrollTop = LogContainer.scrollHeight;
    window.focus();
}
;

function selfMsg(Text) {
    return  "<span style='color: green;'>" + Text + "</span>";

}

Object.prototype.isJson = function () {
    var isjson = typeof(this) == "object" && Object.prototype.toString.call(this).toLowerCase() == "[object object]" && !this.length;
    return isjson;
}
$(document).ready(function () {
    $("#SendDataContainer").hide();
    $("#txtName").val("游客"+Math.round(Math.random()*100000));
    var WebSocketsExist = true;
    try {
        var dummy = new WebSocket("ws://localhost:8989/test");
    } catch (ex) {
        try {
            webSocket = new MozWebSocket("ws://localhost:8989/test");
        }
        catch (ex) {
            WebSocketsExist = false;
        }
    }

    if (WebSocketsExist) {
        Log("您的浏览器支持WebSocket. 您可以尝试连接到聊天服务器!", "OK");
        document.getElementById("Connection").value = "10.86.65.43:4141/chat";
    } else {
        Log("您的浏览器不支持WebSocket。请选择其他的浏览器再尝试连接服务器。", "ERROR");
        document.getElementById("ToggleConnection").disabled = true;
    }

    $("#DataToSend").keypress(function (evt) {
        if (evt.keyCode == 13) {
            $("#SendData").click();
            evt.preventDefault();
        }
    })
});

