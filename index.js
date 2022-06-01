    // -------------------------------- BASIC FUNCTIONS START  -------------------------------- //


let stream;
  const videoElem = document.querySelector('#camera')
  const canvas = document.querySelector('#picture')
  const modalImgDiv = document.querySelector('#modal-img-div')
  const modalSection = document.querySelector('#modal-section')
  let images = { pictures: [] }
  let IMG_ID;

    async function cameraButton () {

        if ('mediaDevices' in navigator) {
            stream = await navigator.mediaDevices.getUserMedia(
              { video: {
                width: 414,
                height: 896,
                facingMode: "environment"
              }, 
                audio: false });
            videoElem.srcObject = stream;
        }

      document.querySelector('#take-picture').style.display='block'
      document.querySelector('#start-camera').style.display='none'

    };

    function takePicture() {  
    document.querySelector('#take-picture').style.display='none'
    document.querySelector('#save-picture').style.display='block'
    document.querySelector('#picture').style.display='block'
    document.querySelector('video').style.display='none'
    document.querySelector('canvas').style.display='block'

   

    const ctx = canvas.getContext('2d');

    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height)

    };

    function savePicture() {
        document.querySelector('#save-picture').style.display='none'
        document.querySelector('#take-picture').style.display='block'
        document.querySelector('#picture').style.display='none'
        document.querySelector('video').style.display='block'

        const imageData = canvas.toDataURL('image/pgn');

        images.pictures.push({
          image: imageData,
          id: images.pictures.length
          })


          IMG_ID = images.length - 1 
    
          localStorage.setItem('cameraApp', JSON.stringify(images));
          document.querySelector('#gallery').innerHTML = ''
          getImages()
          sendNotification()
          updatePhotosJSONbin()

    }

    function deleteImg(id) {

      if ( confirm('delete photo?') == true) {
        const jsonItems = window.localStorage.getItem('cameraApp')
        const stuff = JSON.parse(jsonItems)
        const items = stuff.pictures

          
        let newItems = []
  
            items.find((item) => {
              if (item.id == id) {
              } else {
                newItems.push(item)
              }
            })

            let newArray2 = {
              pictures: []
            }
  
              newItems.map((item, index) => {
                newArray2.pictures.push({
                  image: item.image,
                  id: index
                  })
              })
  
        window.localStorage.clear()

        localStorage.setItem('cameraApp', JSON.stringify(newArray2));
        document.querySelector('#gallery').innerHTML = ''
        images = newArray2
        getImages()
        closeModal()
        updatePhotosJSONbin()
      } 

    }
    
    function createImage(image, i) {
      const imageElem = document.createElement('img');
        imageElem.setAttribute('src', image.image);
        imageElem.setAttribute('id', i);

      imageElem.addEventListener('click', () => {
        openModal(imageElem.id)
      })

      document.querySelector('#gallery').append(imageElem);

    }

    function openModal(id){

      const findImage = images.pictures.find((image) => {
        return image.id == id
      })
      const image = findImage.image

      modalImgDiv.innerHTML = `
      <img src="${image}"></img>
      `
      modalSection.style.display='flex'
      setTimeout(open, 1)

      function open () {
        modalSection.style.opacity='1'
      }

      const deteteIcon = document.querySelector('#deleteIcon')
      deteteIcon.setAttribute('onclick', `deleteImg(${id})`)
    }

    function closeModal() {
      modalSection.style.opacity='0'
      setTimeout(close, 500)

      function close(){
        modalSection.style.display='none'
      }  

    }

    function getImages() {

      if (images.pictures.length > 0){
        let i = -1
        for (const image of images.pictures){
        i++
          createImage(image, i)
        }


      }
    }


    function openGallery() {
    const gallery = document.querySelector('#gallery-section')

      gallery.style.display='flex'
      setTimeout(fade, 1)

      function fade() {
        gallery.style.opacity='1'
      }
    }

    function closeGallery() {
    const gallery = document.querySelector('#gallery-section')

      gallery.style.opacity='0'
      setTimeout( displayNone, 1000)

        function displayNone() {
          gallery.style.display='none'
        }
    }

    // -------------------------------- BASIC FUNCTIONS END  -------------------------------- //


    // -------------------------------- NOTIFKATIONER START  -------------------------------- //

    function sendNotification() {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted'){
          createNotification()
        } 
      })
    }

    function createNotification() {
      const text = 'See picture'

      const notification = new Notification('Image saved!', { body: text });

      notification.addEventListener('click', () => {
        openModal(IMG_ID)
      })
    }

    // -------------------------------- NOTIFKATIONER END  -------------------------------- //



    // -------------------------- SERVICE WORKER START -------------------------- //

    window.addEventListener('load', async () => {
      if ('serviceWorker' in navigator){
        try {
          await navigator.serviceWorker.register('service-worker-BF.js')
        } catch (error) {
        }
      }
    })
    // -------------------------- SERVICE WORKER END -------------------------- //


    // -------------------------- JSON BIN START -------------------------- //

    const ACCES_URL = "https://api.jsonbin.io/b/6290c5de05f31f68b3aa0f51"
    const X_MASTER_KEY = "$2b$10$bNmw4shKfZqUPu319JVgFOsCk/ehF2wueZlhX2/n5FnbnQo2BkcpK"

    async function getFromJsonBIN () {
      const responce = await fetch(`${ACCES_URL}/latest`, {
        headers: {
          'X-Master-Key': X_MASTER_KEY,
        }
      });
      const data = await responce.json()

      let newArray = { pictures: [] }

      data.pictures.map((object) => {
        newArray.pictures.push(object)
      })

      localStorage.setItem('cameraApp', JSON.stringify(newArray));

      return newArray
    }

    async function updatePhotosJSONbin () {

      const fromStorage = window.localStorage.getItem('cameraApp')

      const responce = await fetch(ACCES_URL, {
        method: 'PUT',
        body: fromStorage,
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': X_MASTER_KEY
        }
    });

    const data = await responce.json();

    console.log(data);
  }

    // -------------------------- JSON BIN END -------------------------- //

    // -------------------------- CHECK-ONLINE START -------------------------- //


function dotToRed () {
  document.querySelector('#online-dot').style.backgroundColor='#e70000'
  }

function dotToGreen () {
document.querySelector('#online-dot').style.backgroundColor='rgb(0, 192, 0)'
}

setInterval(checkOnline, 5000);

function checkOnline() {
  if (!navigator.onLine) {
    dotToRed()
  } else {
    dotToGreen()
  }
}

checkOnline()

    // -------------------------- CHECK-ONLINE END -------------------------- //


    // -------------------------- ON LOAD -------------------------- //
    

    window.addEventListener('load', async () => {
     
        images = await getFromJsonBIN()
        if (!images){
          images = []
        }

        getImages()
  
    })
    
