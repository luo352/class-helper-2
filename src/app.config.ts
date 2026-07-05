export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/register/index',
    'pages/admin-login/index',
    'pages/admin/index',
    'pages/home/index',
    'pages/schedule/index',
    'pages/attendance/index',
    'pages/mine/index',
    'pages/course-detail/index',
    'pages/route/index',
    'pages/share/index',
    'pages/leave-apply/index',
    'pages/reminder-settings/index',
    'pages/data-backup/index',
    'pages/profile/index',
    'pages/change-password/index',
    'pages/notification-settings/index',
    'pages/privacy-settings/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4A90D9',
    navigationBarTitleText: '班级助手',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#4A90D9',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/schedule/index',
        text: '课表'
      },
      {
        pagePath: 'pages/attendance/index',
        text: '考勤'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      'desc': '你的位置信息将用于路线导航和定位服务'
    }
  }
})