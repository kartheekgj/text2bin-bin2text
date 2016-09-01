function fnSwitch(type) {
        $(".n2bb2nForm").hide();
        $("#" + type).show();
        var text = (type == 'n2b' ? "Text to Binary Conversion" : 'Binary to Text Conversion');
        var resetText = (type == 'n2b' ? "Try another name<i class='material-icons right'>autorenew</i>" : 'Try another Binary<i class="material-icons right">autorenew</i>');
        var ddText = (type == 'n2b' ? "Text to Binary <i class='material-icons right'>arrow_drop_down</i>" : 'Binary to Text <i class="material-icons right">arrow_drop_down</i>');
        $("#logo").text(text);
        $("#ddST").html(ddText);
        $("#resetName").html(resetText);
        $("#ddST").attr('data-val', type);
		document.title = text + ".";
		
    }

    function fnSwitchReset() {
        var type = $("#ddST").attr('data-val');
        return (type == "n2b" ? nametobin.init() : bintoname.init());
    }
    var bintoname = {
        userBinCode: '',
        init: function() {
            $("#b2n").show();
            $("#userData, #n2b").hide();
            $('#binaryData').val('');
            $("#userGivenName, #asciiname").text('');
            nametobin.recentlyConverted();
        },
        fnGetText: function() {
            var b2n = bintoname._fnGetBinData() || '';
            if (b2n) {
                if (b2n['name'] && b2n['msg'].length == 0) {
                    $("#userGivenName").text(bintoname.userBinCode);
                    var asciiname = bintoname._fnConvertoAscii(bintoname.userBinCode) || '';
                    $("#asciiname").text(asciiname['name']);
                    $("#userNameForm").hide();
                    $("#userData").show();
                    var objData = {
                        name: bintoname.userBinCode,
                        aname: asciiname['name']
                    };
                    nametobin._storetoLocal(objData);
                    nametobin.recentlyConverted();
                } else {
                    Materialize.toast(b2n['msg'],3000);
                }
            }

        },
        _fnGetBinData: function() {
            var username = bintoname.userBinCode = $("#binaryData").val() || '';
            if (username) {
                return {
                    name: username,
                    msg: ""
                }
            } else {
                return {
                    name: "",
                    msg: "Please provide a valid name"
                };
            }
        },
        _fnConvertoAscii: function(code) {
            var arrCode = code.split(" "),
                stringData = '',
                arrString = [],name ='';
            if (arrCode.length) {
                for (var i = 0; i < arrCode.length; i++) {
                    stringData = parseInt(arrCode[i], 2).toString(10);
                    arrString.push(String.fromCharCode(stringData));
                }
				name = bintoname._validateUnicodes(arrString) ? arrString.join('') : "Invalid Binary Code"; 
						
				return {
                    name: name,
                    msg: ''
                }

            } else {
                return {
                    name: "",
                    msg: 'Please enter a valid name'
                }
            }
        },
        _validateUnicodes: function(arrString) {
            var blnIsUnicodePresent = false;
			console.log(arrString.join("").length);
            for (var i = 0; i < arrString.length; i++) {
				
                if (arrString[i].charCodeAt(0) > 255) {
                    blnIsUnicodePresent = true;
                    break;
                }else if(arrString[i]){
					blnIsUnicodePresent = true;
                    break;
				}

            }
            return blnIsUnicodePresent;

        }
    };
var nametobin = {
    username: '',
    init: function() {
        $("#userNameForm").show();
        $("#userData").hide();
        $('#username').val('');
        $("#userGivenName, #asciiname").text('');
        nametobin.recentlyConverted();
    },
    fnGetBin: function() {
        var n2a = nametobin._fnGetUserName() || '';
        if (n2a) {
            if (n2a['name'] && n2a['msg'].length == 0) {
                $("#userGivenName").text(nametobin.username);
                var asciiname = nametobin._fnConvertoAscii(nametobin.username) || '';
                $("#asciiname").text(asciiname);
                $("#userNameForm").hide();
                $("#userData").show();
                var objData = {
                    name: nametobin.username,
                    aname: asciiname
                };
                nametobin._storetoLocal(objData);
                nametobin.recentlyConverted();
            } else {
                Materialize.toast(n2a['msg'],3000);
            }
        }

    },
    _fnGetUserName: function() {
        var username = nametobin.username = $("#username").val() || '';
        if (username) {
            return {
                name: username,
                msg: ""
            }
        } else {
            return {
                name: "",
                msg: "Please provide a valid name"
            };
        }
    },
    _fnConvertoAscii: function(name) {
        var arrName = name.split(''),
            arrAsciiName = [],
            charCode = '',
            asciiCode = '',
            charData = '';
        for (var i = 0; i < arrName.length; i++) {
            charData = arrName[i]
            charCode = charData.charCodeAt(0);
            arrAsciiName.push(charCode.toString(2));
        }
        return arrAsciiName.join(" ");
    },
    _storetoLocal: function(userData) {
        var data = localStorage.getItem('convHis') || JSON.stringify([]),
            jsonData = JSON.parse(data) || [];
        if (Object.keys(jsonData).length !== 0) {
            jsonData.push(userData);
            localStorage.setItem('convHis', JSON.stringify(jsonData))
        } else {
            arrJsonData = [];
            arrJsonData.push(userData);
            localStorage.setItem('convHis', JSON.stringify(arrJsonData))
        }
    },
    recentlyConverted: function() {
        var html = '',
            data = localStorage.getItem('convHis') || JSON.stringify([]),
            jsonData = JSON.parse(data) || [];
        if (Object.keys(jsonData).length !== 0) {
            for (var i = 0; i < Object.keys(jsonData).length; i++) {
                html += '<div class="col s12 m6"><div class="card blue-grey darken-1 card-panel hoverable"><div class="card-content white-text">'
                html += '<span class="card-title">' + jsonData[i]['name'] + '</span><p id="asciiname">' + jsonData[i]['aname'] + '</p>';
                html += '</div>'
                html += '</div></div>';
            }
            $("#recentlyConverted").html(html);
            $("#clearData, #recentlyConverted").show();
        } else {
            $("#recentlyConverted").html('');
            $("#clearData, #recentlyConverted").hide();
        }
    },
    sessionClear: function() {
        localStorage.clear();
        Materialize.toast('All Data Cleared', 3000);
        $("#recentlyConverted").html('');
        $("#clearData, #recentlyConverted").hide();
    }
};
nametobin.recentlyConverted();

$('.input').keypress(function(e){
	var type = $("#ddST").attr('data-val');
	if(e.which == 13){
		(type == "n2b" ? nametobin.fnGetBin() : bintoname.fnGetText());
		return false; //prevent duplicate submission
	}
});
    /*document.getElementById('binaryData').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
    });*/


