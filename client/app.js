
const url = "https://codeschool-inventory-project.herokuapp.com";

var app = new Vue ({
  el: "#app",
  data: {
      page: "dashboard",
      drawer: true,
      dialog: false,
      items: [
          { title: 'DashBoard', icon: 'dashboard', page: 'dashboard'},
          { title: 'Inventory', icon: 'shopping_cart', page: 'inventory' },
          { title: 'Admin', icon: 'person', page: 'admin' }

        ],
        headers: [
        {
          text: 'MarketPlace',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Image', value: 'Image' },
        { text: 'Title', value: 'Title' },
        { text: 'Category', value: 'Category' },
        { text: 'qty', value: 'Qty' },
        { text: 'sku', value: 'SKU' },
        { text: 'Location', value: 'Location' },
        { text: 'Cost', value: 'Cost' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      filteredItems: [],
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
                    app.marketplaceList
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
                cost: this.newCost,
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
                    app.dialog= false;
                    app.getInventory();
                }
            });
        },
        deleteItem: function(item) {
            console.log("Deleting item");
            confirm("Are you sure you want to delete this item?");
            fetch(`${url}/inventory/${item._id}`, {
                method: "DELETE"
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
        updateInventory: function(item) {
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
            fetch(`${url}/inventory/${item.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(req_body)
            }).then(function(response) {
                if(response.status == 400 || response.status == 404) {
                    response.json().then(function(data) {
                        alert(data.msg);
                    });
                } else if(response.status == 204) {
                    item.editing = false;
                    app.getInventory();
                }
            });
        },
    },
    computed: {
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
