﻿/* ------------------------------------------------------------------------------
author: Saikrishna Teja Bobba
------------------------------------------------------------------------------ */
//Restore if using another browser
var lc_email = document.getElementById('license-email').innerText;
var lc_licenseid = document.getElementById('license-id').innerText;

function showSignIn() {
    document.getElementById('login-with-livechat').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('license-email').style.display = 'none';
    document.getElementById('license-email').innerHTML = '';
    document.getElementById('license-id').innerHTML = '';
    document.getElementById('beforesignin').style.display = 'block';
}

function showLogout(in_email) {
    document.getElementById('login-with-livechat').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    document.getElementById('license-email').style.display = 'block';
    document.getElementById('license-email').innerHTML = 'You are logged in as ' + in_email + '. To disable LiveChat, Please Logout.';
    document.getElementById('beforesignin').style.display = 'none';
}

if (lc_email != '0' && lc_licenseid != '0') {
    showLogout(lc_email)
} else {
    showSignIn();
}


// Returns a reference to the element by its ID, for child iframe and logout button
var logoutButton = document.getElementById('logout');
var iframeEl = document.getElementById('login-with-livechat');

function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
    }
    else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}


    // Listen to message from child iframe: logged-in or signed-out
bindEvent(window, 'message', function (e) {
    var lcDetails = null;

    if (typeof e.data === 'string') {
        lcDetails = JSON.parse(e.data);
        console.log(lcDetails);
        switch (lcDetails.type) {
            case 'logged-in':

                showLogout(lcDetails.email);

                $.ajax({
                    type: "POST",
                    url: "/livechat/setLicense",
                    data: lcDetails.license.toString() + ',' + lcDetails.email,
                    dataType: "txt",
                    success: function (response) {
                        console.log(response);
                    },
                    failure: function (response) {
                        console.log(response);
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });

                break;
        }
    }
});


// bind button to send message to child frame with msg: logout
bindEvent(logoutButton, 'click', function (e) {

    showSignIn();

    $.ajax({
        type: "DELETE",
        url: "/livechat/deleteLicense",
        success: function (response) {
            console.log(response);
        },
        failure: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    });
    //sendMessage('logout');
});

// Send a message to the child iframe
var sendMessage = function (msg) {
    // Make sure you are sending a string, and to stringify JSON
    iframeEl.contentWindow.postMessage(msg, '*');
};

