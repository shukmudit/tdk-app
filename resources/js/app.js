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

    items +='<div class="col-sm-6 col-lg-4 all '+doc.data().category+'"><div class="box"> <div><div class="img-box"><img src="'+doc.data().image+'" alt="image"></div><div class="detail-box"><h5>'+doc.data().name+'</h5><p>'+doc.data().descp+'</p><div class="options"><h6>Rs.'+doc.data().price+'/-</h6><a href="javascript:void(0);" class="remove-item" id="minus-'+doc.id+'"><svg width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-516.000000, -1087.000000)" fill="#000000"><path d="M532,1117 C524.268,1117 518,1110.73 518,1103 C518,1095.27 524.268,1089 532,1089 C539.732,1089 546,1095.27 546,1103 C546,1110.73 539.732,1117 532,1117 L532,1117 Z M532,1087 C523.163,1087 516,1094.16 516,1103 C516,1111.84 523.163,1119 532,1119 C540.837,1119 548,1111.84 548,1103 C548,1094.16 540.837,1087 532,1087 L532,1087 Z M538,1102 L526,1102 C525.447,1102 525,1102.45 525,1103 C525,1103.55 525.447,1104 526,1104 L538,1104 C538.553,1104 539,1103.55 539,1103 C539,1102.45 538.553,1102 538,1102 L538,1102 Z" id="minus-circle" sketch:type="MSShapeGroup"></path></g></g></svg></a> <input type="number" value=1 id="qty-'+doc.id+'" style="width: 50px;border-radius: 10px;text-align:center;"/><a href="javascript:void(0);" class="add-item" id="add-'+doc.id+'"><svg width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-464.000000, -1087.000000)" fill="#000000"><path d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z" id="plus-circle" sketch:type="MSShapeGroup"><path></g></g></svg></a><a href="javascript:void(0);" class="cart-btn" id="'+doc.id+'"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 456.029 456.029" style="enable-background:new 0 0 456.029 456.029;" xml:space="preserve"><g><g><path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z" /></g></g><g><g><path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48     C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4C457.728,97.71,450.56,86.958,439.296,84.91z" /></g></g><g><g><path d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z" /></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a></div></div></div></div></div>'

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

  $(".cart-btn").click(function(){
    var item_id = $(this).attr('id')
    checkCookie(item_id)
  })

  $(".remove-item").click(function(){
    var item_id = $(this).attr('id').split("-")[1]
    var qty = $("#qty-"+item_id).val()
    if(qty>1){
      qty--;
      $("#qty-"+item_id).val(qty)
    }
      
  })

  $(".add-item").click(function(){
    var item_id = $(this).attr('id').split("-")[1]
    var qty = $("#qty-"+item_id).val()
    if(qty>=1){
      qty++;
      $("#qty-"+item_id).val(qty)
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

function checkCookie(item_id=null) {
  let cart = getCookie("cart_item").split(',');
  
  if (cart != "" && item_id) {
      cart.push(item_id)
      setCookie("cart_item", cart, 365);
  }else if(cart=='' && item_id) {
      let item_array = [];
      item_array.push(item_id)
      setCookie("cart_item", item_array, 365);
  }else if(cart!='' && !item_id){
      $('.proceed-btn').addClass('disable-links')
  }
}

if(curr_page[1]=='cart')
checkCookie('')

