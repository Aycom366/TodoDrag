//toggle app theme
document.querySelector('.toggleBackground').addEventListener('click',()=>{
    document.body.classList.toggle('light');
});


//getting Items
const formIinputContainer = document.querySelector('.input');
const formValue = document.querySelector('#new-todo');
const alert = document.querySelector('.alert');
const alertInformation = document.querySelector('#alert-information');
const listParent = document.querySelector('.list-items');
const activeClass = document.querySelectorAll('.active-class-items a');
const completed = document.getElementById('clearCompleted');
const leftItem = document.getElementById('left-value');

completed.addEventListener('click',()=>{
    document.querySelectorAll('.checkInput').forEach(checkBox=>{
        if (checkBox.checked){
            const id = checkBox.parentElement.parentElement.id;
            checkBox.parentElement.parentElement.remove();
            removeFromLocalStorage(id);
        }
    });
});



activeClass.forEach(anchor => {
   anchor.addEventListener('click',(e)=>{
       e.currentTarget.href = '#';
        e.preventDefault();
      if(e.currentTarget.id === 'all') {
          e.currentTarget.href = '/';
        document.querySelectorAll('.checkInput').forEach(checkBox=>{
            checkBox.parentElement.parentElement.style.display = 'flex'; 
        });
      }
      if(e.currentTarget.id === 'active') {
        e.currentTarget.href = '/';
        document.querySelectorAll('.checkInput').forEach(checkBox=>{
            checkBox.parentElement.parentElement.style.display = 'flex';
        });
    
        document.querySelectorAll('.checkInput').forEach(checkBox=>{
            if (checkBox.checked){
                checkBox.parentElement.parentElement.style.display = 'none';
            }
        });
      }
       if(e.currentTarget.id === 'completed') {
        e.currentTarget.href = '/';
        document.querySelectorAll('.checkInput').forEach(checkBox=>{
            checkBox.parentElement.parentElement.style.display = 'flex';
        });
    
        document.querySelectorAll('.checkInput').forEach(checkBox=>{
            if (!checkBox.checked){
                checkBox.parentElement.parentElement.style.display = 'none';
            }
        });
        }
   });
});


const checkLeftItem = () =>{
    let totalItem = listParent.children.length;
    let count = 0;
    document.querySelectorAll('.checkInput').forEach((checkBox,index) =>{
        if (checkBox.checked){
           count++;
        }
    });
    leftItem.textContent  = totalItem-count;
}
//passing message to users
const displayAlert = (text,action) =>{
    alertInformation.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(()=>{
        alert.classList.remove(`alert-${action}`);
        alertInformation.textContent = '';
    },2000);
};

//set back to default
const setBackToDefault = () =>{
    formValue.value = '';
 };


//creating form evenet liseterner
formIinputContainer.addEventListener('submit',(e)=>{
    e.preventDefault(); //preventing submnitting automatically
    const id = new Date().getTime().toString();
    const value = formValue.value;
    if(!value){
        displayAlert('Please enter an item to add!','danger');
    }
    else{
        createTodoItem(id,value);
        displayAlert('Item Added!','success');
        addToLocalStorage(id,value);
        setBackToDefault();
        checkLeftItem();
    }
});

//creating the item dynamically
const createTodoItem = (id,value)=>{
    const element = document.createElement('li');
    element.classList.add('list-infos');
    element.draggable = true;
    element.setAttribute('id',id);
    element.innerHTML = `
    <div class="checkboxContainer">
    <input class="checkInput" type="checkbox" hidden>
    <label for="checkInput" class="checkboxLabel"></label>
  </div>
  <p class="item-info">${value}</p>
  <div class="close-container">
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/>
    </svg>
  </div>
    `;
    listParent.appendChild(element);

   const listIinfos =  document.getElementsByTagName('li');
   const labels = document.querySelectorAll('.checkboxLabel');
   const close = document.querySelectorAll('.close-container svg');

   for(let i =0; i<labels.length; i++){
       labels[i].addEventListener('click',checkCurrent);
   }

   for(let i= 0; i< close.length; i++){
       close[i].addEventListener('click',RemoveCurrent);
   }

   sortList(listIinfos);

};

let dragindex=0;
let dropindex=0;
let clone="";

function sortList(target){

    for(let i = 0; i < target.length; i++){

        target[i].addEventListener('dragstart',(e)=>{
            if (e.currentTarget.id){
                e.dataTransfer.setData('text',e.currentTarget.id);
             }
        });
     
        target[i].addEventListener('dragover',(e)=>{
            e.preventDefault();
        });

        target[i].addEventListener('drop',(e)=>{
            e.preventDefault();
            clone=e.currentTarget.cloneNode(true);
            let data = e.dataTransfer.getData('text'); 
               let nodelist=document.getElementsByTagName('li');
            for(let i=0;i<nodelist.length;i++)
            {
                if(nodelist[i].id==data)
                {
                    dragindex=i;
                }
            }
            document.getElementById("list-items").replaceChild(document.getElementById(data),e.currentTarget);
            document.getElementById("list-items").insertBefore(clone,document.getElementById("list-items").childNodes[dragindex]);
               
        });
    }
}



const checkCurrent = (e)=>{
    const label = e.currentTarget;
    label.classList.toggle('checkActive');
    if (label.classList.contains('checkActive')){
        label.parentElement.nextElementSibling.style.textDecoration = 'line-through';
        label.previousElementSibling.checked = true;
    }
    else{
        label.parentElement.nextElementSibling.style.textDecoration = 'none';
        label.previousElementSibling.checked = false;
    }
    checkLeftItem();
};


const RemoveCurrent = (e) =>{
    const parentContainer = e.currentTarget.parentElement.parentElement;
    const id = parentContainer.id;
    listParent.removeChild(parentContainer);
    displayAlert('Item removed successfully!','success');
    removeFromLocalStorage(id);
    checkLeftItem();
    setBackToDefault();
   
};

const removeFromLocalStorage = (id)=>{
    let items = getLocalStorage();
    items = items.filter(item=>{
        if(item.id !== id){
            return items;
        }
    });
    localStorage.setItem('list',JSON.stringify(items));
};

const addToLocalStorage = (id,value) =>{
    const listItem = {id,value};
    let item = getLocalStorage();
    item.push(listItem);
    localStorage.setItem('list',JSON.stringify(item));
    checkLeftItem();
};

const getLocalStorage = () =>{
    return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    :[];
};

//get and set items from local storage onwindows loaded
const setupItems = () =>{
    let item = getLocalStorage();
    if(item.length > 0){
        item.forEach(listItem => {
            createTodoItem(listItem.id,listItem.value);
        });
    }
    checkLeftItem();
}

window.addEventListener('load',setupItems);


