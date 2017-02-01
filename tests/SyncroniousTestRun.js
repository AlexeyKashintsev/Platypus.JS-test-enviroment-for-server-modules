"use strict";
window.erData = [];
if (!window.tests)
    window.tests = [];
var testRunning = false;
function addTest(testNum) {
    tests.push({
        name: 'Sync test ' + testNum,
        description: 'Synchronous test ' + testNum,
        roles: ['sync'],
        timeout: 15000,
        repeats: 1,
        priority: 50 - testNum,
        test:
            function (assert, userData, finish, crash) {
                return (new Promise(function (resolve, reject) {
                        function doSetTimeout() {
                            setTimeout(function() {
                                repeats++;
                                if (testNum === testRunning) {
                                    if (repeats < repeatsCnt) {
                                        doSetTimeout();
                                    } else
                                        resolve();
                                } else {
                                    reject();
                                }
                            }, 10);
                        }
                        
                        if (testRunning) {
                            reject();
                        } else {
                            testRunning = testNum;
                            var repeats = 0;
                            var repeatsCnt = 15;
                            
                            doSetTimeout();
                        }
                    }))
                    .then(function (res) {
                        assert.ok(true ,'Test for syncronous run №' + testNum + ' - ok');
                        testRunning = false;
                        finish();
                    }, function(err) {
                        assert.notOk(true, 'Test for syncronius run №' + testNum + ' - failed');
                        crash();
                    });
                }
    });
}

for (var j = 0; j < 50; j++)
    addTest(j);