const Mock = require("./config/WxMock");

Mock.mock("/users", {
  code: 200,
  "data|1-50": [
    {
    id: 958,
    title: "内容标题1",
    src: "https://cdn.kaishuhezi.com/kstory/ablum/image/389e9f12-0c12-4df3-a06e-62a83fd923ab_info_w=450&h=450.jpg",
    contentType: "album",
    count: 17,
    isVip: true,
    },
  ],
});
