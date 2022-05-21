let stream;
  const videoElem = document.querySelector('#camera')
  const canvas = document.querySelector('#picture')
  const modalImgDiv = document.querySelector('#modal-img-div')
  const modalSection = document.querySelector('#modal-section')
  let images = []

  if (JSON.parse(localStorage.getItem('cameraApp')) === null) {
    images = []
  } else {
    images = JSON.parse(localStorage.getItem('cameraApp'))
  }
  

    async function cameraButton () {

        if ('mediaDevices' in navigator) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            console.log(stream);
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
            id: images.length,
            image: imageData
          })
    
          localStorage.setItem('cameraApp', JSON.stringify(images));
          
          document.querySelector('#gallery').innerHTML = ''

          getImages()

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
