"use strict"
// проверка на то что документ загружен
document.addEventListener("DOMContentLoaded",function (){
   
   const form = document.getElementById('form');
   form.addEventListener('submit',formSend);
   async function formSend(e){
      e.preventDefault();

      let error = formValidate(form);

      let formData = new FormData(form);
      formData.append('image',formImage.files[0]);

      if (error===0){
         form.classList.add('_sending')
         let response = await fetch('sendmail.php',{
            method:'POST',
            body: formData
         });
         if (response.ok){
            let result = await response.json();
            alert(result.mmessage);
            formPreview.innerHTML= "";
            form.reset();
            form.classList.remove('._sending')
         }else{
            // alert('ERROR');
            form.classList.remove('._sending')
         }
      }else{
         alert('ERROR')
      }
   }
   
   function formValidate(form){
      let error = 0; 

      //данный класс добавляем элементу который будет подвержен проверке
      let formReq = document.querySelectorAll('._req')

      for (let index=0; index < formReq.length;index++){
         const input = formReq[index];

         formRemoveError(input)
         //данный класс добавляем элементу email 
         if(input.classList.contains('_email')){
            if (email_test(input)){
               formAddError(input);
               error++;
            }   
         }else if(input.getAttribute("type") === "checkbox" && input.checked === false){
            formAddError(input);
            error++;
         }else{
            if(input.value === ''){
               formAddError(input);
               error++;
            }
         }
      }
      return error;
   }
   function formAddError (input){
      input.parentElement.classList.add('_error');
      input.classList.add('_error')
   }
   function formRemoveError (input){
      input.parentElement.classList.remove('_error');
      input.classList.remove('_error')
   }

   // для тестирования email
   function email_test(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
   }

   //image
   const formImage = document.getElementById('formImage')

   const formPreview = document.getElementById('formPreview')

   formImage.addEventListener('change', () => {
      uploadFiles(formImage.files[0])
   })
   function uploadFiles(file){
      //проверяем тип файла
      if(!['image/jpeg','image/png','image/gif'].includes(file.type)){
         alert("Разрешены только изображения.");
         formImage.value = '';
         return;
      }
      //проверяем размер файла 
      if (file.size > 2 * 1024 * 1024){
         alert('Файл должен быть не более 2 МБ.');
         return;
      }
      var reader = new FileReader();
      reader.onload = function(e){
         formPreview.innerHTML = `<img src="${e.target.result}" alt="Foto">`
      };
      reader.onerror = function(e){
         alert('ERROR');
      };
      reader.readAsDataURL(file); 
   }

});