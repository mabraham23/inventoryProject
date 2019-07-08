


var app = new Vue ({
  el: "#app",
  data: {
      page: "dashboard",
      drawer: true,
      items: [
          { title: 'DashBoard', icon: 'dashboard', page: 'dashboard'},
          { title: 'Inventory', icon: 'shopping_cart', page: 'inventory' },
          { title: 'Admin', icon: 'person', page: 'admin' }

        ],
  },



});
