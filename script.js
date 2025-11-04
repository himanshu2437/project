// Cities, Shops and Labors data
const cities = ["Bijnor","Bhopal","Indore","Lucknow","Agra","Delhi","Chennai","Kolkata","Mumbai","Hyderabad","Jaipur"];
const shopNames = [
  "Sai Construction Mart", "Vishal Building Store", "Sharma Cement House", "Gaurav Material Mart", "My Choice Hardware",
  "Ankit Traders", "Reliance Smart Point", "Om General Store", "A To Z Supply", "D S Engineering"
];
const localities = [
  "Kiratpur Road", "Saket Colony", "Near Vardhaman College", "Civil Lines", "Main Bazaar", "Subhash Nagar",
  "Station Road", "Shiv Chowk", "Gandhi Market", "Railway Station"
];
const laborFields = [
  "Civil Engineer/Site Supervisor", "Head Mason", "Mason", "Labor",
  "Steel Fixer", "Carpenter", "Electrician", "Plumber", "Painter", "Tiler"
];
const laborFirstNames = ["Amit","Suresh","Raju","Mukesh","Pankaj","Sunil","Anil","Pradeep","Rohit","Varun"];
const laborLastNames = ["Yadav","Singh","Verma","Sharma","Joshi","Patel","Kumar","Mishra","Gupta","Tiwari"];
// Helper functions
function generatePhone() {
  return "+91" + Math.floor(100000000 + Math.random()*900000000).toString();
}
function generateShopAddress(city, idx) {
  return `${localities[idx % localities.length]}, ${city}`;
}
function generateLaborName(idx) {
  return `${laborFirstNames[idx % laborFirstNames.length]} ${laborLastNames[idx % laborLastNames.length]}`;
}
// Shops DB
const shopsDB = {};
cities.forEach((city,i) => {
  shopsDB[city] = [];
  for(let j=0;j<10;j++){
    const items = {
      "Cement": 320 + j*5,
      "Steel": 48000 + j*200,
      "Bricks": 7 + j*0.3,
      "Sand": 1500 + j*20,
      "Tiles": 120 + j*3,
      "Paint": 140 + j*2
    };
    shopsDB[city].push({
      name: shopNames[j],
      address: generateShopAddress(city,j),
      phone: generatePhone(),
      items: items
    });
  }
});
// Labors DB
const laborsDB = {};
cities.forEach(city => {
  laborsDB[city] = [];
  laborFields.forEach((field, fi) => {
    for(let j=0;j<5;j++){
      laborsDB[city].push({
        field: field,
        name: generateLaborName(j + fi*5),
        phone: generatePhone(),
        address: `${city} Labour Camp Block-${fi+1} Room-${j+1}`,
        charge: 350 + fi*100 + j*30
      });
    }
  });
});
// Storage Helpers
function getUsers() { return JSON.parse(localStorage.getItem("bm_users") || "[]"); }
function saveUsers(users) { localStorage.setItem("bm_users", JSON.stringify(users)); }
function getCart() { return JSON.parse(localStorage.getItem("bm_cart") || "[]"); }
function saveCart(cart) { localStorage.setItem("bm_cart", JSON.stringify(cart)); }
function clearCart() { localStorage.removeItem("bm_cart"); }
// Current User
let currentUser = null;
// Section switching
function showSec(id) {
  ["profileSec","materialsSec","shopsSec","laborSec","orderSec"].forEach(s => {
    if(document.getElementById(s)) document.getElementById(s).style.display = "none";
  });
  let el = document.getElementById(id);
  if(el) el.style.display = "block";
}
// Tab navigation handlers
document.getElementById("profileTab").onclick = () => showSec("profileSec");
document.getElementById("materialsTab").onclick = () => { showSec("materialsSec"); renderMaterials(); };
document.getElementById("shopsTab").onclick = () => { showSec("shopsSec"); renderShops(); };
document.getElementById("laborTab").onclick = () => { showSec("laborSec"); renderLabors(); };
document.getElementById("orderTab").onclick = () => { showSec("orderSec"); renderCart(); };
// Register / Login UI toggle
document.getElementById("showRegisterBtn").onclick = () => {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "block";
};
document.getElementById("backToLoginBtn").onclick = () => {
  document.getElementById("register-box").style.display = "none";
  document.getElementById("login-box").style.display = "block";
};
document.getElementById("showForgotBtn").onclick = () => {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("forgot-box").style.display = "block";
};
document.getElementById("backToLoginBtn2").onclick = () => {
  document.getElementById("forgot-box").style.display = "none";
  document.getElementById("login-box").style.display = "block";
};
// Register form submit handler
document.getElementById("registerForm").onsubmit = function(e){
  e.preventDefault();
  let name = document.getElementById("regName").value.trim();
  let email = document.getElementById("regEmail").value.trim();
  let password = document.getElementById("regPassword").value.trim();
  let address = document.getElementById("regAddress").value.trim();
  let phone = document.getElementById("regPhone").value.trim();
  let photoFile = document.getElementById("regPhoto").files[0];
  let users = getUsers();
  if(users.some(u => u.email === email || u.phone === phone)){
    alert("Email or Phone already exists.");
    return;
  }
  if(photoFile){
    let reader = new FileReader();
    reader.onload = function(ev){
      users.push({name,email,password,address,phone,photo:ev.target.result});
      saveUsers(users);
      alert("Registration Successful! Please login.");
      showSec("login-box");
    }
    reader.readAsDataURL(photoFile);
  } else {
    users.push({name,email,password,address,phone,photo:""});
    saveUsers(users);
    alert("Registration Successful! Please login.");
    showSec("login-box");
  }
};
  
// Login form
document.getElementById("loginForm").onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const users = getUsers();
  // Debug print users
  console.log("Users in system:", users);
  // Find matching user
  const user = users.find(u => 
    (u.name === username || u.email === username || u.phone === username) && u.password === password
  );
  if (!user) {
    alert("Invalid username/email/phone or password!");
    return;
  }
  
  // On success
  currentUser = user;
  alert("Login successful! Welcome " + user.name);
  document.getElementById("login-box").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("logoutBtn").style.display = "inline-block";
  renderProfile();
  showSec("profileSec");
};
// Logout
document.getElementById("logoutBtn").onclick = function(){
  currentUser = null;
  showSec("login-box");
  document.getElementById("logoutBtn").style.display = "none";
};
// Forgot password form
document.getElementById("forgotForm").onsubmit = function(e){
  e.preventDefault();
  let email = document.getElementById("forgotEmail").value.trim();
  let users = getUsers();
  let user = users.find(u => u.email === email);
  alert(user ? "Your password is: " + user.password : "No user found!");
};
// Profile render
function renderProfile(){
  let p = currentUser;
  let photoHTML = p.photo ? `<img src="${p.photo}" class="profile-photo" alt="Profile Photo"/>` : "";
  document.getElementById("profileSec").innerHTML = `
    <h2>My Profile</h2>
    ${photoHTML}
    <p><b>Name:</b> ${p.name}</p>
    <p><b>Email:</b> ${p.email}</p>
    <p><b>Address:</b> ${p.address}</p>
    <p><b>Phone:</b> ${p.phone}</p>
    <button onclick="editProfile()">Edit Profile</button>
  `;
}
// Edit profile
function editProfile(){
  let p = currentUser;
  document.getElementById("profileSec").innerHTML = `
    <h2>Edit Profile</h2>
    <form id="editProfileForm">
      <input type="text" id="editName" value="${p.name}" required />
      <input type="email" id="editEmail" value="${p.email}" required />
      <input type="text" id="editAddress" value="${p.address}" required />
      <input type="text" id="editPhone" value="${p.phone}" required />
      <input type="file" id="editPhoto" accept="image/*" />
      <button type="submit">Update</button>
      <button type="button" onclick="renderProfile()">Cancel</button>
    </form>
  `;
  document.getElementById("editProfileForm").onsubmit = function(e){
    e.preventDefault();
    p.name = document.getElementById("editName").value.trim();
    p.email = document.getElementById("editEmail").value.trim();
    p.address = document.getElementById("editAddress").value.trim();
    p.phone = document.getElementById("editPhone").value.trim();
    let photoFile = document.getElementById("editPhoto").files[0];
    let users = getUsers();
    if(photoFile){
      let reader = new FileReader();
      reader.onload = function(ev){
        p.photo = ev.target.result;
        saveUsers(users);
        renderProfile();
      }
      reader.readAsDataURL(photoFile);
    } else {
      saveUsers(users);
      renderProfile();
    }
  };
}
// Material Data & Render
const materials = [
  {id:"cement",name:"Cement",companies:[
    {name:"JK Super Cement",price:320},
    {name:"Ultratech",price:330},
    {name:"Ambuja",price:350},
    {name:"ACC",price:340},
    {name:"Ramco",price:310}
  ]},
  {id:"steel",name:"Steel/Rebars",companies:[
    {name:"TATA",price:50000},
    {name:"JSW",price:48000},
    {name:"SAIL",price:47000},
    {name:"Essar",price:52000},
    {name:"Rashtriya Ispat",price:49000}
  ]},
  {id:"bricks",name:"Bricks/Blocks",companies:[]},
  {id:"sand",name:"Sand",companies:[]},
  {id:"gravel",name:"Gravel",companies:[]},
  {id:"tiles",name:"Tiles",companies:[
    {name:"Kajaria",price:120},
    {name:"Somany",price:130},
    {name:"Johnson",price:115},
    {name:"Nitco",price:125},
    {name:"Asian Granito",price:140}
  ]},
  {id:"plumbing",name:"Plumbing Pipe & fitting",companies:[
    {name:"Supreme",price:80},
    {name:"Prince",price:82},
    {name:"Ashirvad",price:85},
    {name:"Astral",price:87},
    {name:"Finolex",price:90}
  ]},
  {id:"electrical",name:"Electrical wire & fitting",companies:[
    {name:"Finolex",price:100},
    {name:"Polycab",price:110},
    {name:"Havells",price:105},
    {name:"LT",price:115},
    {name:"RR Kabel",price:108}
  ]},
  {id:"doors",name:"Doors/Windows",companies:[
    {name:"Century",price:1200},
    {name:"Greenply",price:1500},
    {name:"Fenesta",price:1400},
    {name:"Godrej",price:700},
    {name:"Dorma",price:800}
  ]},
  {id:"paint",name:"Paint",companies:[
    {name:"Asian",price:150},
    {name:"Berger",price:140},
    {name:"Nerolac",price:130},
    {name:"Dulux",price:160},
    {name:"Shalimar",price:155}
  ]}
];
// Render Materials
function renderMaterials() {
  let html = "<h2>Materials Catalog</h2>";
  materials.forEach(mat => {
    html += `<h3>${mat.name}</h3>
    <table class="material-table">
      <thead><tr><th>Company</th><th>Price</th><th>Buy</th></tr></thead><tbody>`;
    mat.companies.forEach(comp => {
      html += `<tr><td>${comp.name}</td><td>₹${comp.price}</td><td><button onclick="addToCart('material','${mat.name}','${comp.name}',${comp.price})">Buy</button></td></tr>`;
    });
    html += "</tbody></table>";
  });
  document.getElementById("materialsSec").innerHTML = html;
}
// Render Shops
function renderShops() {
  let html = "<h2>Shops</h2>";
  html += "<select id='shopCitySelect'>";
  cities.forEach(city => html += `<option value="${city}">${city}</option>`);
  html += "</select><div id='shopList'></div>";
  document.getElementById("shopsSec").innerHTML = html;
  document.getElementById("shopCitySelect").addEventListener("change", function () {
    renderShopList(this.value);
  });
  renderShopList(cities[0]);
}
function renderShopList(city) {
  let shops = shopsDB[city];
  let html = `<table class="shop-table"><thead><tr><th>Name</th><th>Address</th><th>Phone</th><th>Items</th><th>Buy</th></tr></thead><tbody>`;
  shops.forEach(shop => {
    let itemDesc = "";
    for (const [item, price] of Object.entries(shop.items)) {
      itemDesc += `${item}: ₹${price}<br>`;
    }
    html += `<tr><td>${shop.name}</td><td>${shop.address}</td><td>${shop.phone}</td><td>${itemDesc}</td><td><button onclick="addToCart('shop','${shop.name} Shop Items','Items',0)">Add</button></td></tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("shopList").innerHTML = html;
}
// Render Labors
function renderLabors() {
  let html = "<h2>Labors</h2>";
  html += "<select id='laborCitySelect'>";
  cities.forEach(city => html += `<option value="${city}">${city}</option>`);
  html += "</select><div id='laborList'></div>";
  document.getElementById("laborSec").innerHTML = html;
  document.getElementById("laborCitySelect").addEventListener("change", function () {
    renderLaborList(this.value);
  });
  renderLaborList(cities[0]);
}
function renderLaborList(city) {
  let labors = laborsDB[city];
  let html = `<table class="labor-table"><thead><tr><th>Name</th><th>Field</th><th>Address</th><th>Phone</th><th>Charge/Day</th><th>Buy</th></tr></thead><tbody>`;
  labors.forEach(labor => {
    html += `<tr><td>${labor.name}</td><td>${labor.field}</td><td>${labor.address}</td><td>${labor.phone}</td><td>₹${labor.charge}</td><td><button onclick="addToCart('labor','${labor.name}','${labor.field}',${labor.charge})">Add</button></td></tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("laborList").innerHTML = html;
}
// Cart management
function addToCart(type, name, desc, price) {
  let cart = getCart();
  cart.push({ type, name, desc, price });
  saveCart(cart);
  alert(`${name} added to cart!`);
}
// Render Cart and order placement
function renderCart() {
  let cart = getCart();
  let html = "<h2>Your Cart</h2>";
  if (cart.length === 0) {
    html += "<p>Cart is empty.</p>";
  } else {
    html += `<table class="order-table"><thead><tr><th>Type</th><th>Name</th><th>Description</th><th>Price</th></tr></thead><tbody>`;
    cart.forEach(item => {
      html += `<tr><td>${item.type}</td><td>${item.name}</td><td>${item.desc}</td><td>₹${item.price}</td></tr>`;
    });
    html += "</tbody></table>";
    html += `<h3>Place Order</h3>
    <form id="orderForm">
      <input type="text" id="orderAddress" placeholder="Delivery Address" required />
      <select id="orderPayment" required>
        <option value="">Select Payment Method</option>
        <option value="COD">Cash on Delivery</option>
        <option value="UPI">UPI</option>
        <option value="Card">Credit/Debit Card</option>
      </select>
      <button type="submit" class="orderBtn">Place Order</button>
    </form>
    <p id="orderMsg"></p>`;
  }
  document.getElementById("orderSec").innerHTML = html;
  document.getElementById("orderForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const address = document.getElementById("orderAddress").value.trim();
    const payment = document.getElementById("orderPayment").value;
    if (!address || !payment) {
      alert("Please enter delivery address and select payment method.");
      return;
    }
    let orders = JSON.parse(localStorage.getItem("bm_orders") || "[]");
    orders.push({ user: currentUser.email, cart: cart, address: address, payment: payment, datetime: new Date().toLocaleString() });
    localStorage.setItem("bm_orders", JSON.stringify(orders));
    clearCart();
    renderCart();
    document.getElementById("orderMsg").textContent = "Order placed successfully!";
  });
}
// 3D Background function
function init3DBackground() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("background3d").appendChild(renderer.domElement);
  const geometry = new THREE.TorusKnotGeometry(8, 2.5, 90, 14);
  const material = new THREE.MeshStandardMaterial({ color: 0x1f6aad, metalness: 0.5, roughness: 0.2 });
  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(20, 40, 20);
  scene.add(light);
  camera.position.z = 36;
  function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.012;
    torusKnot.rotation.y += 0.012;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
window.onload = init3DBackground;
