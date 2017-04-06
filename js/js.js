'use strict';

angular.module('app', ['ui.router', 'ngCookies']);

//定义全局作用域，只对需要的数据发送一次ajax请求，方便每个页面数据的使用
'use strict';
angular.module('app').run(['$rootScope', '$http', function($rootScope, $http) {
    $rootScope.searchSelects = {};
    
    $http.get('data/city.json').then(function(resp) {

        $rootScope.searchSelects.city = resp.data;
    });
    $http.get('data/salary.json').then(function(resp) {
        $rootScope.searchSelects.salary = resp.data;
    });
    $http.get('data/scale.json').then(function(resp) {
        $rootScope.searchSelects.scale = resp.data;
    });
}])

'use strict';
angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: 'view/main.html',
            controller: 'mainCtrl'
        })
        .state('position', {
            url: '/position/:id',
            templateUrl: 'view/position.html',
            controller: 'positionCtrl'
        })
        .state('company', {
            url: '/company/:id',
            templateUrl: 'view/company.html',
            controller: 'companyCtrl'
        })
        .state('search', {
            url: '/search',
            templateUrl: 'view/search.html',
            controller: 'searchCtrl'
        }).state('me', {
            url: '/me',
            templateUrl: 'view/me.html',
            controller: 'meCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'view/login.html',
            controller: 'loginCtrl'
        })
        .state('regist', {
            url: '/regist',
            templateUrl: 'view/regist.html',
            controller: 'registCtrl'
        })
        .state('deliver', {
            url: '/deliver',
            templateUrl: 'view/deliver.html',
            controller: 'deliverCtrl'
        })
        .state('collect', {
            url: '/collect',
            templateUrl: 'view/collect.html',
            controller: 'collectCtrl'
        })
    $urlRouterProvider.otherwise('main');
}]);
'use strict';
angular.module('app').controller('collectCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('data/myFavorite.json').then(function(resp) {
        $scope.collects = resp.data;
    });

    //登录状态时，我的收藏中，收藏星星的取消与选中
    $scope.star2 = true;
    $scope.changeStar = function() {
        if ($scope.star == true) {
            $scope.star2 = true;
            $scope.star = false;
        }

    }
    $scope.changeStar2 = function() {
        if ($scope.star2 == true) {
            $scope.star = true;
            $scope.star2 = false;
        }
    }
}])

//公司职位页面
'use strict';
angular.module('app').controller('companyCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.flag1 = false; //flag1代表技术下面的详情信息先显示
    $scope.flag2 = true; //flag2代表技术按钮被选中时，与运营相对应的信息详情先隐藏

    //职位分类按钮的样式
    $scope.sty1 = {
        'background-color': '#def8f5',
        'color': '#000',
    };

    $scope.sty2 = {
        'background-color': '#12d5b5',
        'color': '#fff',
    }

    //当点击技术，给相应的sty2样式
    $scope.col1 = $scope.sty2;
    $scope.doChange1 = function() {
        $scope.col1 = $scope.sty2;
        $scope.col2 = $scope.sty1;
        if ($scope.flag1 == true) {
            $scope.flag1 = !$scope.flag1;
            $scope.flag2 = !$scope.flag2;
        }

    };

    $scope.doChange2 = function() {
        $scope.col1 = $scope.sty1;
        $scope.col2 = $scope.sty2;
        if ($scope.flag2 == true) {
            $scope.flag1 = !$scope.flag1;
            $scope.flag2 = !$scope.flag2;
        }

    };

    //根据前面页面提供的id,到对应的json中找到与传过来的id相对应的数据返回回来
    $http({
        method: 'get',
        url: 'data/company.json?id=' + $state.params.id,
        responseType: 'json'
    }).then(function(resp) {
        $scope.company = resp.data;
        console.log($scope.company);
    })
}])
'use strict';

// 后端交互  ajax 请求
// 投递记录
angular.module('app').controller('deliverCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.tabList = [{
        id: 'all',
        name: '全部'
    }, {
        id: 'pass',
        name: '面试邀请'
    }, {
        id: 'fail',
        name: '不合适'
    }, ];

    $http.get('data/myPost.json').then(function(resp) {
        $scope.deliverList = resp.data;
    })

    $scope.filterObj = {};
    $scope.tClick = function(id, name) {
        switch (id) {
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
        }
    }

}])
'use strict';

//登录页面
// 后端交互  ajax 请求
//注入 $cookies,$cookieStore用来存储数据，通过$cookieStore.put('name',$scope.name)来存放，通过$cookieStore.get('name')来取数据


angular.module('app').controller('loginCtrl', ['$scope', '$http', '$state', '$rootScope', '$cookies', '$cookieStore', function($scope, $http, $state, $rootScope, $cookies, $cookieStore) {
    //  $http({
    // 	method:'get',
    // 	url:'data/login.json',
    // 	responseType:'json'
    // }).then(function(resp){
    // 	$scope.user=resp.data;
    // 	console.log($scope.user);
    // })
    $http.get('data/login.json').then(function(resp) {
        $scope.user = resp.data;
        $scope.name = resp.data.name;
        //console.log($scope.name + '------name')
        $cookieStore.put('name', $scope.name);
    })

    $scope.flag = true;

    $scope.loginTo = function() {
        var name = $scope.user.name;
        $scope.flag = false;
        if (($scope.loginPhone == $scope.user.name) && ($scope.loginPwd == $scope.user.pwd)) {
            $rootScope.state = 1;
            $state.go('main');
            //console.log($rootScope.rootName);
        } else {
            $scope.flag = false;
        }
    }

}])
'use strict';

//

// 后端交互  ajax 请求
angular.module('app').controller('mainCtrl', ['$scope', '$http', '$state', '$rootScope', '$cookieStore', function($scope, $http, $state, $rootScope, $cookieStore) {

    var name = $cookieStore.get('name');

    //当登录状态为1时，把你好,xxx显示出来
    if ($rootScope.state == 1) {
        $rootScope.ten = true;
        $rootScope.go = true;
        $rootScope.hello = false;

        $scope.phone = "你好," + name;
    } else {
        $rootScope.ten = false;
        $rootScope.go = false;
        $rootScope.hello = true;
        $scope.goLogin = function() {
            $state.go('login');
        }
    }

    $http({
        method: 'get',
        url: 'data/positionList.json',
        responseType: 'json'
    }).then(function(resp) {
        $scope.list = resp.data;
        //console.log($scope.list);
    })

}])
'use strict';

//我 页面
// 后端交互  ajax 请求
angular.module('app').controller('meCtrl', ['$scope', '$http', '$rootScope', '$state', '$cookieStore', function($scope, $http, $rootScope, $state, $cookieStore) {
    $scope.lAfter = false;


    if ($rootScope.state == 1) {
        var name = $cookieStore.get('name');
        $scope.lAfter = true;
        $scope.col = 'loginAfter';
        $scope.btnContent = '取消登录';
        $scope.loginName = name;
        $scope.doClick = function() {
            $state.go('main');
            $rootScope.state = 0;
        }
    } else {
        $scope.col = 'loginBefore';
        $scope.btnContent = '去登录';
        $scope.doClick = function() {
            $state.go('login');
        }
    }
}])
'use strict';

// 后端交互  ajax 请求
angular.module('app').controller('positionCtrl', ['$scope', '$http', '$state', '$rootScope', function($scope, $http, $state, $rootScope) {
    $http({
        method: 'get',
        url: 'data/position.json?id=' + $state.params.id,
        responseType: 'json'
    }).then(function(resp) {
        $scope.data = resp.data;

    });

    //发送Ajax请求，返回company.json数据
    $http({
        method: 'get',
        url: 'data/company.json',
        responseType: 'json'
    }).then(function(resp) {
        $scope.company = resp.data;
        //console.log($scope.company);
    })


    //判断当是登录状态时，收藏的星星要显示出来
    if ($rootScope.state == 1) {
        $scope.star = true;
        $scope.star2 = false;

        //点击收藏星星，转为收藏状态
        $scope.changeStar = function() {
                if ($scope.star == true) {
                    $scope.star2 = true;
                    $scope.star = false;
                }

            }
            //收藏状态时，再次点击，则变为未收藏状态
        $scope.changeStar2 = function() {
                if ($scope.star2 == true) {
                    $scope.star = true;
                    $scope.star2 = false;
                }
            }
            //登录状态时，底部文本变成“投个简历”
        $rootScope.footer = "投个简历";
        //当底部文本变为 “投个简历时”，点击，则变为“已投递”
        if ($rootScope.footer == '投个简历') {
            $scope.goPage = function() {
                $rootScope.footer = "已投递";
            }
        }

    } else {
        //没有登录时，星星隐藏，底部文本内容变为去登录
        $scope.star = false;
        $rootScope.footer = "去登录";
        $scope.goPage = function() {
            $state.go('login');
        }
    }

}])

'use strict';

// 后端交互  ajax 请求
angular.module('app').controller('registCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {

    //做标记，当这三个标记全为true时，则才能点击注册提交信息
    $scope.check1 = false;
    $scope.checkW = false;
    $scope.flag1 = true;
    var flag = false;


    //校验注册手机号是否正确
    $scope.checkPhone = function() {
        var reg = /^1\d{10}$/;
        if (reg.test($scope.phone)) {
            $scope.tipPhone = '✅';
            $scope.check1 = true;
        } else {
            $scope.tipPhone = '❌';
            $scope.check1 = false;
        }
    }

    //校验密码格式是否正确
    $scope.checkPwd = function() {
        var reg = /^[0-9,a-z,A-Z]{6,}$/;
        if (reg.test($scope.pwd)) {
            $scope.tipPwd = '✅';
            $scope.checkW = true;
        } else {
            $scope.tipPwd = '❌';
            $scope.checkW = false;
        }
    }


    //点击发送短信时，发生的事件
    $scope.doSend = function() {
            $scope.flag1 = false;
            var timer;
            document.getElementById("yzcodes").innerHTML = generateRandomCode();

            //点击发送验证码倒计时
            var num = 10;

            function send() {
                num--;
                document.getElementById("sendInfo").innerHTML = num;
                if (num == 0) {
                    num = 10;
                    document.getElementById("sendInfo").innerHTML = '发送短信';
                    // document.getElementById("yzcodes").innerHTML = generateRandomCode();
                    clearInterval(timer);
                }
            }
            timer = setInterval(send, 1000);


            //验证码输入时验证码是否正确
            $scope.checkCode = function() {
                var radnum = document.getElementById("yzcodes").innerHTML.toLowerCase();
                var number = $scope.codes.toLowerCase();
                if (number === radnum) {
                    $scope.tipCode = "✅";
                    flag = true;

                } else {
                    $scope.tipCode = "❌";
                    document.getElementById("yzcodes").innerHTML = generateRandomCode();
                    flag = false;
                }
            }



        }
        //点击注册时，验证各条件是否符合
    $scope.checkRegist = function() {
            if ($scope.check1 && $scope.checkW && flag) {
                $state.go('login');
            }

            // $cookieStore.put('user',{phone:$scope.phone,pwd:$scope.pwd});
        }
        //随机生成验证码
    function generateRandomCode() {
        var str = "";
        for (var i = 1; i <= 4; i++) {
            var n = Math.floor(Math.random() * 62);
            if (n < 10) {
                str += n;
            } else if (n < 36) {
                str += String.fromCharCode(65 + n - 10);
            } else {
                str += String.fromCharCode(97 + n - 36);
            }
        }
        return str;
    }



}])

'use strict';

// 后端交互  ajax 请求
angular.module('app').controller('searchCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
    $http({
        method: 'get',
        url: 'data/positionList.json',
        responseType: 'json'
    }).then(function(resp) {
        $scope.list = resp.data;
        //console.log($scope.list);
    });

    $scope.tabList = [{
        id: 'city',
        name: "城市"
    }, {
        id: 'salary',
        name: "薪水"
    }, {
        id: 'scale',
        name: "公司规模"
    }]



    $scope.tabClick = function(id, name) { //city,城市   salary 薪水
        $scope.selectList = $rootScope.searchSelects[id]; //获取选择列表
        //console.log($scope.selectList);
        $scope.tabId = id; //当前选中tab的索引
        $scope.visible = true; //是否显示选择列表
    };

    //点击选择列表时执行
    $scope.filterObj = []; //存放过滤对象
    $scope.selectClick = function(id, name) { //此处的id与上面的id不同，此处代表选择列表中城市的id:c1 南京, c2 上海, s1 3000以下

        $scope.visible = false;
        if (id) {
            $scope.filterObj[$scope.tabId + 'Id'] = id;

            angular.forEach($scope.tabList, function(item) {
                if (item.id == $scope.tabId) {
                    item.name = name;
                }
            });
        } else { //点击全国或是不限时
            delete $scope.filterObj[$scope.tabId + 'Id'];

            angular.forEach($scope.tabList, function(item) {
                if (item.id == $scope.tabId) {
                    switch (item.id) {
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                    }
                }
            })
        }

    };


    // $scope.flag = true;

    // //点击导航列表，显示隐藏区域
    // $scope.cancel = function() {
    //     $scope.flag = true;
    // }
    // $scope.doSelect1 = function() {
    //     //查询城市列表
    //     $http({
    //         method: 'get',
    //         url: 'data/city.json',
    //         responseType: 'json'
    //     }).then(function(resp) {
    //         $scope.result = resp.data;
    //     })
    //     $scope.sty1 = 'hover';
    //     $scope.sty2 = 'out';
    //     $scope.sty3 = 'out';
    //     $scope.flag = false;
    // }
    // $scope.doSelect2 = function() {

    //     //查询薪水列表
    //     $http({
    //         method: 'get',
    //         url: 'data/salary.json',
    //         responseType: 'json'
    //     }).then(function(resp) {
    //         $scope.result = resp.data;
    //     })
    //     $scope.sty1 = 'out';
    //     $scope.sty2 = 'hover';
    //     $scope.sty3 = 'out';
    //     $scope.flag = false;
    // }
    // $scope.doSelect3 = function() {
    //     //查询公司规模
    //     $http({
    //         method: 'get',
    //         url: 'data/scale.json',
    //         responseType: 'json'
    //     }).then(function(resp) {
    //         $scope.result = resp.data;
    //     });

    //     $scope.flag = true;
    //     $scope.sty1 = 'out';
    //     $scope.sty2 = 'out';
    //     $scope.sty3 = 'hover';
    //     $scope.flag = false;
    // }
}])

'use strict';

angular.module('app').filter('filterByObj', [function() {
    return function(data, filterObj) {
        var result = [];
        angular.forEach(data, function(item) {
            var flag = true;
            for (var index in filterObj) {
                if (item[index] != filterObj[index]) {
                    flag = false;
                }
            }
            if (flag) {
                result.push(item);
            }
        });

        return result;
    }
}]);
'use strict',

angular.module('app').directive('appCollectList', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/collectList.html'
    }
}])
'use strict';

angular.module('app').directive('appCompanyInfo', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/companyInfo.html'
    }
}])
'use strict';

angular.module('app').directive('appCompanyPosition', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/companyPosition.html'
    }
}])
'use strict';

angular.module('app').directive('appDeliverTab', [function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=',
            tabClick: '&'
        },
        templateUrl: 'view/template/deliverTab.html',
        link: function($scope) {
            $scope.click = function(tab) {
                $scope.selectId = tab.id;
                $scope.tabClick(tab);
            }
        }
    }
}])
'use strict';

angular.module('app').directive('appFooter', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/footer.html',
    }
}])
'use strict';
angular.module('app').directive('appGrayOver', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/grayOver.html'
    }
}])
'user strict';

angular.module('app').directive('appHead', [function() {
    return {
        restrict: 'A',
        replace: true, //只能有一个根元素
        templateUrl: 'view/template/head.html'
    };
}])

'use strict';

angular.module('app').directive('appLoginMain', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/loginMain.html'
    }
}])
'use strict';
angular.module('app').directive('appMeLogin', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/meLogin.html'
    }
}])
'use strict';

angular.module('app').directive('appPositionFooter', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionFooter.html'
    }
}])
'use strict';

angular.module('app').directive('appHeadCommon', [function() {
    return {
        scope: {
            title: '@appHeadCommon'
        },
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionHead.html',
        link: function($scope) {
            $scope.doBack = () => {
                window.history.go('-1');
            }
        }
    }
}])
'use strict';

angular.module('app').directive('appPositionInfo', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionInfo.html'
    }
}])
'use strict';

angular.module('app').directive('appPositionList', [function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=',
            filterObj: '='
        },
        templateUrl: 'view/template/positionList.html',
    }
}])
'use strict';
angular.module('app').directive('appRegist', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/registMain.html'
    }
}])
'use strict';

angular.module('app').directive('appSearchHead', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/searchHead.html'
    }
}])
'use strict';

angular.module('app').directive('appSearchTab', [function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=',
            tabClick: '&',
            tabId: '='
        },
        templateUrl: 'view/template/searchTab.html',
    }
}])
'use strict';
angular.module('app').directive('appSelectList', [function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            selectList: '=',
            visible: '=',
            selectClick: '&'
        },
        templateUrl: 'view/template/selectList.html'
    }
}])
