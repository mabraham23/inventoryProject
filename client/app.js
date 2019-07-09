// const url = "http://localhost:3000";
const url = "https://codeschool-inventory-project.herokuapp.com/";


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
        inventory: [],
        newSku: "",
        newImage: "",
        newTitle: "",
        newCategory: "",
        newMarketplace: "",
        newQuantity: "",
        newCost: "",
        newLocation: "",
  },
  created: function() {
      this.getInventory();
  },

    methods: {
        getInventory: function() {
            console.log("Getting Inventory");
            fetch(`${url}/inventory`).then(function(response) {
                response.json().then(function(data) {
                    console.log(data);
                    app.inventory = data.inventory
                });
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
                location: this.newLocation
            };
            fetch(`${url}/inventory`, {
                method: "POST",
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
                    app.getInventory();
                }
            });
        }
    },



});
