/**
 * 
 * @author Алексей
 * @public 
 */
define('PublicSampleTestModule', ['orm'], function (Orm, ModuleName) {
    function module_constructor() {
        var self = this, model = Orm.loadModel(ModuleName);
        
        self.doTest = function(aCallSuccess, aSuccess, aFailure) {
            if (aCallSuccess)
                aSuccess('Succeed');
            else
                aFailure('Fail');
        };
    }
    return module_constructor;
});
