
const url = "https://codeschool-inventory-project.herokuapp.com";

var app = new Vue ({
  el: "#app",
  data: {
      todaysdate: new Date(),
      detail: "",
      calTitle: "",
      page: "dashboard",
      drawer: true,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      dialog: false,
      dialogRegister: false,
      editing: [],
      currentUser: "",
      login_username: "",
      login_password: "",
      register_username: "",
      register_password: "",
      isLoggedIn: false,
      show1: false,
      show2: false,
      search: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
      items: [
          { title: 'DashBoard', icon: 'dashboard', page: 'dashboard'},
          { title: 'Inventory', icon: 'shopping_cart', page: 'inventory' },
          { title: 'Orders', icon: 'store', page: 'orders' },
          { title: 'Admin', icon: 'person', page: 'admin' }

        ],
        headers: [
        {
          text: 'MarketPlace',
          align: 'left',
          sortable: false,
          value: 'marketplace'
        },
        { text: 'Image', value: 'Image' },
        { text: 'Title', value: 'title' },
        { text: 'Category', value: 'category' },
        { text: 'qty', value: 'quantity' },
        { text: 'sku', value: 'sku' },
        { text: 'Location', value: 'location' },
        { text: 'Cost', value: 'cost' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      Orderheaders: [
      {
        text: 'Customer',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Sku', value: 'SKU' },
      { text: 'Title', value: 'Title' },
      { text: 'Category', value: 'Category' },
      { text: 'qty', value: 'Qty' },
      { text: 'MarketPlace', value: 'MarketPlace' },
      { text: 'Location', value: 'Location' },
      { text: 'Price', value: 'Price' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
      events: [
          {
            title: 'Vacation',
            details: 'Going to the beach!',
            date: '2019-07-12',
            open: false
          },
          {
            title: 'Vacation',
            details: 'Going to the beach!',
            date: '2019-07-11',
            open: false
          },
          {
            title: 'Vacation',
            details: 'Going to the beach!',
            date: '2019-07-15',
            open: false
          },
      ],
      filteredItems: [],
      filteredOrders: [],
      marketplaces: [],
      marketplaceType: "all",
      categories: ["all", "shoe", "cooking", "books", "sports", "entertainment"],
      categoryType: "all",

      inventory: [],
        newSku: "",
        newImage: "",
        newTitle: "",
        newCategory: "",
        newMarketplace: "",
        newQuantity: "",
        newCost: "",
        newLocation: "",

        newOrderCustomer: "",
        newOrderSku: "",
        newOrderTitle: "",
        newOrderCategory: "",
        newOrderMarketplace: "",
        newOrderQuantity: "",
        newOrderPrice: "",
        newOrderLocation: "",

        re_render: true,

  },

  created: function() {
      this.getInventory();
  },

    methods: {

        newevent: function(){
            var new_event = {
                title: this.calTitle,
                details: this.detail,
                date: this.date,
                open: false,
            };
            this.events.push(new_event);
        },

        login: function() {
            fetch(`${url}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    username: this.login_username,
                    password: this.login_password
                })
            }).then(function(response) {
                if (response.status == 200) {
                    response.json().then(function(data) {
                        app.isLoggedIn = true;
                        app.getInventory();
                    });
                }
                else if (response.status == 403) {
                    response.json().then(function(data) {
                        alert(data.msg);
                    })
                }
            });
        },
        logout: function() {
            fetch(`${url}/logout`, {
              credentials: "include"
          }).then(function(response) {
                if(response.status == 200 ) {
                  console.log(response.status)
                    app.isLoggedIn = false;
                    console.log(app.isLoggedIn);
                    // app.getInventory();
                } else {
                    response.json().then(function(data) {
                        alert(data.msg);
                    });
                }
            });
        },
        register: function() {
            fetch(`${url}/users/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    username: this.register_username,
                    password: this.register_password
                })
            }).then(function(response) {
                if (response.status == 422 || response.status == 400) {
					response.json().then(function(data) {
						alert(data.msg);
                        app.isLoggedIn = true;
					})
				} else if (response.status == 201) {
					console.log("It worked");
                    app.isLoggedIn = false;
                    app.getInventory();
				}
            });
        },

        updateList: function(index) {
            var new_editing = this.editing;
            new_editing[index].show = !new_editing[index].show;
            this.editing = new_editing;
            this.getInventory();
            // console.log(this.editing);
        },

        cancelnewitem: function(){
            this.dialog = false;
        },
        getInventory: function() {
            console.log("Getting Inventory");
            fetch(`${url}/inventory`, {
              credentials: "include",
            }).then(function(response) {
              if (response.status == 403) {
                this.isLoggedIn = false
              } else {
                response.json().then(function(data) {
                    console.log(data);
                    app.isLoggedIn = true;
                    app.inventory = data.inventory;
                    app.currentUser = data.user_name;
                    app.marketplaceList;
                    app.inventory.forEach(function(product) {
                      app.editing.push({show: false});
                    });
                });
              }
            });
        },
        addItem: function() {
            console.log("Adding Item");
            var req_body = {
                sku: this.newSku,
                image: this.newImage,
                title: this.newTitle,
                category: this.newCategory,
                marketplace: this.newMarketplace,
                quantity: this.newQuantity,
                cost: this.newCost,
                location: this.newLocation
            };
            fetch(`${url}/inventory`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(req_body)
            }).then(function(response) {
                if(response.status == 400) {
                    response.json().then(function(data) {
                        alert(data.msg);
                    })
                } else if (response.status == 201) {
                    app.newSku = "";
                    app.newImage = "";
                    app.newTitle = "";
                    app.newCategory = "";
                    app.newMarketplace = "";
                    app.newQuantity = "";
                    app.newCost = "";
                    app.newLocation = "";
                    app.dialog= false;
                    app.newevent();
                    app.getInventory();
                }
            });
        },
        deleteItem: function(item) {
            console.log("Deleting item");
            confirm("Are you sure you want to delete this item?");
            fetch(`${url}/inventory/${item._id}`, {
                method: "DELETE",
                credentials: "include",
            }).then(function(response) {
                if(response.json == 404) {
                    response.json().then(function(data) {
                        alert(data.msg);
                    });
                } else if(response.status == 204) {
                    app.getInventory();
                }
            });
        },
        updateInventory: function(item, index) {
            console.log("Updating item");
            var req_body = {
                sku: item.sku,
                image: item.image,
                title: item.title,
                category: item.category,
                marketplace: item.marketplace,
                quantity: item.quantity,
                cost: item.cost,
                location: item.location
            };
            fetch(`${url}/inventory/${item._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(req_body)
            }).then(function(response) {
                if(response.status == 400 || response.status == 404) {
                    response.json().then(function(data) {
                        alert(data.msg);
                    });
                } else if(response.status == 200) {
                  console.log(app.editing)
                    item.editing = false;
                    app.getInventory();
                    app.editing[index].show = !app.editing[index].show;
                }
            });
        },
    },
    computed: {
        eventsMap() {
            const map = {}
            this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
            return map
        },
        marketplaceList: function() {
            this.marketplaces = ["all"];
            this.inventory.forEach((item) => {
                if (!this.marketplaces.includes(item.marketplace)) {
                    this.marketplaces.push(item.marketplace);
                }
            })
        },
        filteredItem: function() {
            return this.filteredCategory.filter((i) => {
                return this.filteredMarketplace.includes(i);
            })
        },
        filteredMarketplace: function() {
            return this.inventory.filter((i) => {
                return this.marketplaceType == "all" || (i.marketplace == this.marketplaceType);
            })
        },
        filteredCategory: function() {
            return this.inventory.filter((i) => {
                return this.categoryType == "all" || (i.category == this.categoryType);
            })
        }
    }


});
