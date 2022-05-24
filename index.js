let stream;
  const videoElem = document.querySelector('#camera')
  const canvas = document.querySelector('#picture')
  const modalImgDiv = document.querySelector('#modal-img-div')
  const modalSection = document.querySelector('#modal-section')
  let images = []
  let IMG_ID;

  if (JSON.parse(localStorage.getItem('cameraApp')) === null) {
    images = []
  } else {
    images = JSON.parse(localStorage.getItem('cameraApp'))
  }
  

    async function cameraButton () {

        if ('mediaDevices' in navigator) {
            stream = await navigator.mediaDevices.getUserMedia(
              { video: {
                width: {ideal: 373},
                height: {ideal: 717}
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

    const ctx = canvas.getContext('2d');

    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height)

    };

    function savePicture() {
        document.querySelector('#save-picture').style.display='none'
        document.querySelector('#take-picture').style.display='block'
        document.querySelector('#picture').style.display='none'

        const imageData = canvas.toDataURL('image/pgn');

        images.push({
          image: imageData,
          id: images.length
          })

          IMG_ID = images.length - 1 
    
          localStorage.setItem('cameraApp', JSON.stringify(images));
          document.querySelector('#gallery').innerHTML = ''
          getImages()
          sendNotification()

    }

    function deleteImg(id) {

      if ( confirm('delete photo?') == true) {
        const jsonItems = window.localStorage.getItem('cameraApp')
        const items = JSON.parse(jsonItems)
  
        let newItems = []
  
            items.find((item) => {
              if (item.id == id) {
  
              } else {
                newItems.push(item)
              }
            })
  
            let newItemWithId = []
  
              newItems.map((item, index) => {
                newItemWithId.push({
                  image: item.image,
                  id: index
                  })
              })
  
  
        window.localStorage.clear()
        localStorage.setItem('cameraApp', JSON.stringify(newItemWithId));
        document.querySelector('#gallery').innerHTML = ''
        images = newItemWithId
        getImages()
        closeModal()
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

      const findImage = images.find((image) => {
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

      if (images.length > 0){
        let i = -1
        for (const image of images){
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

    

    getImages()


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



    // -------------------------- SERVICE WORKER -------------------------- //

    window.addEventListener('load', async () => {
      if ('serviceWorker' in navigator){
        try {
          await navigator.serviceWorker.register('service-worker-BF.js')
        } catch (error) {
          console.log('Kunde inte regestrera service workern: ', error);
        }
      }
    })