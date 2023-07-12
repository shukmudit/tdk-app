import './bootstrap';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc ,doc, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyAnFnHbGEeh3CKVgsFaiMoV6VV5djSLqOA",
    authDomain: "tdk-app-d853c.firebaseapp.com",
    projectId: "tdk-app-d853c",
    storageBucket: "tdk-app-d853c.appspot.com",
    messagingSenderId: "459978208363",
    appId: "1:459978208363:web:e0ad718e372c2348276d2e",
    measurementId: "G-CGJQQTLNCJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const storage = getStorage(app);

  async function add_customer_info(cust_info) {
    try {
      const docRef = await addDoc(collection(db, "checkout_table"), {
        your_name: cust_info[0],
        phone_no: cust_info[1],
        flat_tower_no: cust_info[2],
        order_id:"tdk123456",
        appartment_name:cust_info[3],
        time: Date(),
        locality:cust_info[4]
      });
      console.log("Document written with ID: ", docRef.id);
      window.location.href = '/order_confirmed';
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }



  $( "#checkout-form" ).on( "submit", function( event ) {
   // alert("Submitted");
    const cust_info = [];
    $("input[type='text']").each(function () {    
       cust_info.push($(this).val())
    })  
    add_customer_info(cust_info);
    event.preventDefault();
  } );

function add_product_image(product_info){
    // Create the file metadata
/** @type {any} */
const metadata = {
    contentType: 'image/png'
  };
  const file = $("#product_image")[0].files[0]
  //alert(file.name)
  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, 'images/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
 
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        add_product_info(product_info,downloadURL)
      });
    }
  );

  
}

async function add_product_info(product_info,downloadURL) {
    try {
      const docRef = await addDoc(collection(db, "product_table"), {
        name: product_info[0],
        category: product_info[3],
        descp: product_info[1],
        price:product_info[2],
        time: Date(),
        image:downloadURL
        });
      console.log("Document written with ID: ", docRef.id);
      location.reload(true);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


$( "#add-product-form" ).on( "submit", function( event ) {
  //  alert("Submitted");
    const product_info = [];
    $("input[type='text']").each(function () {    
        product_info.push($(this).val())
       // alert($(this).val())
    })  
    const product_cat = $(".product_cat").val()
    //alert(product_cat)
    product_info.push(product_cat)
   
    add_product_image(product_info)
    event.preventDefault();
  } );
  

  async function list_products(){
  let items = '';
  let i = 1;
  const querySnapshot = await getDocs(collection(db, "product_table"));
  querySnapshot.forEach((doc) => {
   // console.log(`${doc.id} => ${doc.data()}`);
    items +='<tr><td>'+i+'</td><td>'+doc.data().name+'</td><td>'+doc.data().price+'</td><td>'+doc.data().category+'</td></td><td><img src="'+doc.data().image+'" height="40px"></td><td><button type="button" class="btn btn-block btn-danger del-btn" id="'+doc.id+'">Delete</button></td></td></tr>';
    i++;
  });
  $('.product-listing').html(items)
  $(".del-btn").click( async function () {    
    //alert($(this).attr('id'))
    const id = $(this).attr('id')
    if(confirm("Are you sure you want to delete this?")){
      await deleteDoc(doc(db, "product_table", id));
      location.reload(true);
    }
  })    
}

let curr_page = $(location).attr('pathname') 
curr_page = curr_page.split('/')
if(curr_page[2] == 'list_products')
  list_products()

async function get_menu_items(){
  let items = ' <div class="filters-content "><div class="row grid">';
  const menu_listing = query(collection(db, "product_table"));

  const querySnapshot = await getDocs(menu_listing);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
   // console.log(doc.id, " => ", doc.data());

    items +='<div class="col-sm-6 col-lg-4 all '+doc.data().category+'"><div class="box"> <div><div class="img-box"><img src="'+doc.data().image+'" alt="image"></div><div class="detail-box"><h5>'+doc.data().name+'</h5><p>'+doc.data().descp+'</p><div class="options"><h6>Rs.'+doc.data().price+'/-</h6>  <a href="javascript:void(0);" class="cart-btn"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 456.029 456.029" style="enable-background:new 0 0 456.029 456.029;" xml:space="preserve"><g><g><path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z" /></g></g><g><g><path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48     C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4C457.728,97.71,450.56,86.958,439.296,84.91z" /></g></g><g><g><path d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z" /></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a></div>  </div></div></div></div>'

  });

  $('.menu-listing').html(items+'</div></div> ')

  $('.filters_menu li').click(function () {
    $('.filters_menu li').removeClass('active');
    $(this).addClass('active');

    var data = $(this).attr('data-filter');
    $grid.isotope({
        filter: data
    })
  });

  var $grid = $(".grid").isotope({
      itemSelector: ".all",
      percentPosition: false,
      masonry: {
          columnWidth: ".all"
      }
  })
}
if(curr_page[1]=='')
get_menu_items()


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let cart = getCookie("cart_item");
  
  if (cart != "" ) {
   // item_array.push('2')
    alert("Cart Has item");
  } else {
      let item_array = [];
      item_array.push('11')
      setCookie("cart_item", item_array, 365);
   
  }
}

if(curr_page[1]=='cart')
checkCookie()

