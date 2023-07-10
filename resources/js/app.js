import './bootstrap';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
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
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }



  $( "#checkout-form" ).on( "submit", function( event ) {
    alert("Submitted");
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
  alert(file.name)
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
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


$( "#add-product-form" ).on( "submit", function( event ) {
    alert("Submitted");
    const product_info = [];
    $("input[type='text']").each(function () {    
        product_info.push($(this).val())
        alert($(this).val())
    })  
    const product_cat = $(".product_cat").val()
    alert(product_cat)
    product_info.push(product_cat)
   
    add_product_image(product_info)
    event.preventDefault();
  } );