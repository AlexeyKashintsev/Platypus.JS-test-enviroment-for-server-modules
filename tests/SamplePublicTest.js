"use strict";
window.erData = [];
if (!window.tests)
    window.tests = [];
tests.push({
    name: 'SamplePublicTest',
    description: 'Sample test for public module',
    roles: ['anonymous'],
    timeout: 15000,
    repeats: 1,
    test:
            function (assert, userData, finish, crash) {
                var moduleName = "PublicSampleTestModule";
                var testModule, bres = [];

                return getProxy(moduleName, assert)
                        .then(function (module) {
                            logger.info('Connect to server module...');
                            testModule = module;
                            
                            return publicTest();
                            
//                            switch (userData.userRole) {
//                                case 'sales':
//                                    return salesTest();
//                                    break;
//                                case 'manager':
//                                    return managerTest();
//                                    break;
//                            }
                        });

                function publicTest() {
                    (new Promise(function (resolve, reject) {
                        console.log('First test: getting success');
                        testModule.doTest(true, resolve, reject);
                    }))
                    .then(function (res) {
                        assert.equal(res, 'Succeed' ,'Test for success result');
                    }, function(err) {
                        assert.notOk(true, 'Test for success result. Error: ' + err);
                    })
                    
                    .then(function () {
                        console.log('Second test: getting failure');
                        return new Promise(function (resolve, reject) {
                            testModule.doTest(false, reject, resolve);
                        });
                    })
                    .then(function (res) {
                        assert.equal(res, 'Fail' ,'Test for failure result');
                        finish();
                    }, function(err) {
                        assert.notOk(true, 'Test for failure result. Error: ' + err);
                        finish();
                    });
                }
            }
});