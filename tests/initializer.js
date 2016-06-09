/**
 * 
 * @author Алексей
 */

function init() {
    return new Promise(function (resolve, reject) {
        require(['rpc', 'logger'], function (rpc, Logger) {
            function moduleLoader(moduleName, assert) {
                if (!assert)
                    assert = {
                        async: function(txt) {logger.info(txt);},
                        ok: function(txt) {logger.info(txt);},
                        notOk: function(txt) {logger.info(txt);}
                    };
                
                var getModule = assert.async();
                
                return new Promise(function (resolve, reject) {
                    rpc.requireRemotes(moduleName, function (module) {
                        assert.ok(true, "New connection for server module " + moduleName);
                        getModule();
                        resolve(module);
                    }, function(err) {
                        assert.notOk(true, "New connection for server module " + moduleName);
                        getModule();
                        reject(false);
                    });
                });
            }
            
            window.getProxy = moduleLoader;
            window.logger = Logger;
            resolve();
        }, reject);
    });
}

function login(username, password, assert) {
    return new Promise(function(resolve, reject) {
        console.log('Logging in...');
        $.ajax({
            type: "GET",
            url: "../application-start.html",
            complete: function(a) {
                console.log(a);
                if (a.responseText.search('<input type="password" name="j_password" id="password" />') >= 0)
                    $.ajax({
                        type: "POST",
                        url: "j_security_check",
                        dataType: 'json',
                        async: true,
                        data: {
                            j_username: username,
                            j_password : password
                        },
                        complete: function (b) {
                            console.log('Logged in...');
                            console.log(b);
                            if (b.responseText.search('Platypus Application login fail.') == -1)
                                resolve();
                            else
                                reject();
                        }
                    });
                else
                    reject();
            }
        });
    });
}

function logout(assert) {
    return new Promise(function(resolve, reject) {
        require('security', function(security) {
            security.principal(function(principal) {
                assert.ok(true, "Close current session");
                principal.logout(resolve);
            }, function(err) {
                assert.ok(true, "No current session");
                resolve();
            });
        }, function() {
            assert.ok(true, "No current session");
            resolve();
        });
    });
}